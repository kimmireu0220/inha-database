import express from 'express';
import { selectSql, insertSql, deleteSql } from '../database/sql.js';

const router = express.Router();

// ============================================
// 사용자 메인 페이지 (항공편 검색)
// ============================================
router.get('/', async (req, res) => {
    try {
        const airports = await selectSql.getAirport();
        res.render('user/main', {
            title: '항공편 예약',
            airports,
        });
    } catch (error) {
        console.error('User main error:', error);
        res.status(500).send('Error loading user page');
    }
});

// ============================================
// 항공편 검색 결과
// ============================================
router.post('/search', async (req, res) => {
    try {
        const { departure, arrival, date } = req.body;
        const flights = await selectSql.getAvailableFlights(departure, arrival, date);
        res.render('user/searchResult', {
            title: '검색 결과',
            flights,
            departure,
            arrival,
            date,
        });
    } catch (error) {
        console.error('Flight search error:', error);
        res.status(500).send('Error searching flights');
    }
});

// ============================================
// 예약하기
// ============================================
router.get('/reserve/:flightNumber/:legNumber/:date', async (req, res) => {
    try {
        const { flightNumber, legNumber, date } = req.params;
        const legInstance = await selectSql.getLegInstanceByKey(flightNumber, legNumber, date);
        const reservedSeats = await selectSql.getReservedSeats(flightNumber, legNumber, date);
        const fares = await selectSql.getFareByFlight(flightNumber);
        
        if (!legInstance) {
            return res.send(`<script>alert('항공편을 찾을 수 없습니다.'); location.href='/user';</script>`);
        }

        // 사용 가능한 좌석 번호 생성 (간단한 예시: 1A, 1B, ...)
        const totalSeats = legInstance.Number_of_available_seats + reservedSeats.length;
        const availableSeats = [];
        for (let row = 1; row <= Math.ceil(totalSeats / 6); row++) {
            for (let col of ['A', 'B', 'C', 'D', 'E', 'F']) {
                const seatNumber = `${row}${col}`;
                if (!reservedSeats.includes(seatNumber) && availableSeats.length < legInstance.Number_of_available_seats) {
                    availableSeats.push(seatNumber);
                }
            }
        }

        res.render('user/reserve', {
            title: '예약하기',
            legInstance,
            availableSeats,
            fares,
        });
    } catch (error) {
        console.error('Reserve get error:', error);
        res.status(500).send('Error loading reservation page');
    }
});

router.post('/reserve', async (req, res) => {
    try {
        const { flightNumber, legNumber, date, seatNumber, name, phone, email, passport } = req.body;
        
        // 고객 정보 확인 또는 생성
        let customer = await selectSql.getCustomerByPhone(phone);
        if (!customer) {
            const customerId = await insertSql.setCustomer({
                Name: name,
                Phone_number: phone,
                Email: email || null,
                Passport_number: passport || null,
            });
            customer = await selectSql.getCustomerById(customerId);
        }

        // 좌석 예약 (트랜잭션 포함)
        await insertSql.setSeatReservation({
            Flight_number: flightNumber,
            Leg_number: parseInt(legNumber),
            Date: date,
            Seat_number: seatNumber,
            Customer_id: customer.Customer_id,
        });

        res.redirect(`/user/reservation/${customer.Customer_id}`);
    } catch (error) {
        console.error('Reserve post error:', error);
        res.send(`<script>alert('예약 실패: ${error.message}'); location.href='/user';</script>`);
    }
});

// ============================================
// 예약 조회
// ============================================
router.get('/reservation', (req, res) => {
    res.render('user/reservationSearch', {
        title: '예약 조회',
    });
});

router.post('/reservation', async (req, res) => {
    try {
        const { phone } = req.body;
        const customer = await selectSql.getCustomerByPhone(phone);
        
        if (!customer) {
            return res.send(`<script>alert('예약 정보를 찾을 수 없습니다.'); location.href='/user/reservation';</script>`);
        }

        res.redirect(`/user/reservation/${customer.Customer_id}`);
    } catch (error) {
        console.error('Reservation search error:', error);
        res.status(500).send('Error searching reservation');
    }
});

router.get('/reservation/:customerId', async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const customer = await selectSql.getCustomerById(customerId);
        const reservations = await selectSql.getSeatReservationByCustomer(customerId);
        
        res.render('user/reservationList', {
            title: '예약 조회',
            customer,
            reservations,
        });
    } catch (error) {
        console.error('Reservation list error:', error);
        res.status(500).send('Error loading reservations');
    }
});

// ============================================
// 예약 취소
// ============================================
router.post('/cancel', async (req, res) => {
    try {
        const { flightNumber, legNumber, date, seatNumber } = req.body;
        
        // 예약 취소 (트랜잭션 포함)
        await deleteSql.deleteSeatReservation(flightNumber, parseInt(legNumber), date, seatNumber);
        
        res.send(`<script>alert('예약이 취소되었습니다.'); location.href='/user/reservation';</script>`);
    } catch (error) {
        console.error('Cancel error:', error);
        res.send(`<script>alert('예약 취소 실패: ${error.message}'); location.href='/user/reservation';</script>`);
    }
});

export default router;

