import express from 'express';
import { selectSql, insertSql, updateSql, deleteSql, validationSql } from '../database/sql.js';

const router = express.Router();

// ============================================
// 관리자 메인 페이지
// ============================================
router.get('/', async (req, res) => {
    try {
        const airports = await selectSql.getAirport();
        const airplanes = await selectSql.getAirplane();
        const flights = await selectSql.getFlight();
        
        res.render('admin/main', {
            title: '관리자 페이지',
            airports,
            airplanes,
            flights,
        });
    } catch (error) {
        console.error('Admin main error:', error);
        res.status(500).send('Error loading admin page');
    }
});

// ============================================
// 공항 관리
// ============================================
router.get('/airport', async (req, res) => {
    try {
        const airports = await selectSql.getAirport();
        res.render('admin/airport', {
            title: '공항 관리',
            airports,
        });
    } catch (error) {
        console.error('Airport list error:', error);
        res.status(500).send('Error loading airports');
    }
});

router.post('/airport', async (req, res) => {
    try {
        await insertSql.setAirport(req.body);
        res.redirect('/admin/airport');
    } catch (error) {
        console.error('Airport insert error:', error);
        res.send(`<script>alert('공항 추가 실패: ${error.message}'); location.href='/admin/airport';</script>`);
    }
});

router.get('/airport/update/:code', async (req, res) => {
    try {
        const airport = await selectSql.getAirportByCode(req.params.code);
        res.render('admin/airportUpdate', {
            title: '공항 수정',
            airport,
        });
    } catch (error) {
        console.error('Airport update get error:', error);
        res.status(500).send('Error loading airport');
    }
});

router.post('/airport/update', async (req, res) => {
    try {
        await updateSql.updateAirport(req.body);
        res.redirect('/admin/airport');
    } catch (error) {
        console.error('Airport update error:', error);
        res.send(`<script>alert('공항 수정 실패: ${error.message}'); location.href='/admin/airport';</script>`);
    }
});

router.post('/airport/delete', async (req, res) => {
    try {
        await deleteSql.deleteAirport(req.body.code);
        res.redirect('/admin/airport');
    } catch (error) {
        console.error('Airport delete error:', error);
        res.send(`<script>alert('공항 삭제 실패: ${error.message}'); location.href='/admin/airport';</script>`);
    }
});

// ============================================
// 항공기 타입 관리
// ============================================
router.get('/airplane-type', async (req, res) => {
    try {
        const airplaneTypes = await selectSql.getAirplaneType();
        res.render('admin/airplaneType', {
            title: '항공기 타입 관리',
            airplaneTypes,
        });
    } catch (error) {
        console.error('Airplane type list error:', error);
        res.status(500).send('Error loading airplane types');
    }
});

router.post('/airplane-type', async (req, res) => {
    try {
        await insertSql.setAirplaneType(req.body);
        res.redirect('/admin/airplane-type');
    } catch (error) {
        console.error('Airplane type insert error:', error);
        res.send(`<script>alert('항공기 타입 추가 실패: ${error.message}'); location.href='/admin/airplane-type';</script>`);
    }
});

router.get('/airplane-type/update/:name', async (req, res) => {
    try {
        const airplaneType = await selectSql.getAirplaneTypeByName(req.params.name);
        res.render('admin/airplaneTypeUpdate', {
            title: '항공기 타입 수정',
            airplaneType,
        });
    } catch (error) {
        console.error('Airplane type update get error:', error);
        res.status(500).send('Error loading airplane type');
    }
});

router.post('/airplane-type/update', async (req, res) => {
    try {
        await updateSql.updateAirplaneType(req.body);
        res.redirect('/admin/airplane-type');
    } catch (error) {
        console.error('Airplane type update error:', error);
        res.send(`<script>alert('항공기 타입 수정 실패: ${error.message}'); location.href='/admin/airplane-type';</script>`);
    }
});

router.post('/airplane-type/delete', async (req, res) => {
    try {
        await deleteSql.deleteAirplaneType(req.body.name);
        res.redirect('/admin/airplane-type');
    } catch (error) {
        console.error('Airplane type delete error:', error);
        res.send(`<script>alert('항공기 타입 삭제 실패: ${error.message}'); location.href='/admin/airplane-type';</script>`);
    }
});

// ============================================
// 항공기 관리
// ============================================
router.get('/airplane', async (req, res) => {
    try {
        const airplanes = await selectSql.getAirplane();
        const airplaneTypes = await selectSql.getAirplaneType();
        res.render('admin/airplane', {
            title: '항공기 관리',
            airplanes,
            airplaneTypes,
        });
    } catch (error) {
        console.error('Airplane list error:', error);
        res.status(500).send('Error loading airplanes');
    }
});

router.post('/airplane', async (req, res) => {
    try {
        await insertSql.setAirplane(req.body);
        res.redirect('/admin/airplane');
    } catch (error) {
        console.error('Airplane insert error:', error);
        res.send(`<script>alert('항공기 추가 실패: ${error.message}'); location.href='/admin/airplane';</script>`);
    }
});

router.get('/airplane/update/:id', async (req, res) => {
    try {
        const airplane = await selectSql.getAirplaneById(req.params.id);
        const airplaneTypes = await selectSql.getAirplaneType();
        res.render('admin/airplaneUpdate', {
            title: '항공기 수정',
            airplane,
            airplaneTypes,
        });
    } catch (error) {
        console.error('Airplane update get error:', error);
        res.status(500).send('Error loading airplane');
    }
});

router.post('/airplane/update', async (req, res) => {
    try {
        await updateSql.updateAirplane(req.body);
        res.redirect('/admin/airplane');
    } catch (error) {
        console.error('Airplane update error:', error);
        res.send(`<script>alert('항공기 수정 실패: ${error.message}'); location.href='/admin/airplane';</script>`);
    }
});

router.post('/airplane/delete', async (req, res) => {
    try {
        await deleteSql.deleteAirplane(req.body.id);
        res.redirect('/admin/airplane');
    } catch (error) {
        console.error('Airplane delete error:', error);
        res.send(`<script>alert('항공기 삭제 실패: ${error.message}'); location.href='/admin/airplane';</script>`);
    }
});

// ============================================
// CAN_LAND 관리
// ============================================
router.get('/can-land', async (req, res) => {
    try {
        const canLands = await selectSql.getCanLand();
        const airplaneTypes = await selectSql.getAirplaneType();
        const airports = await selectSql.getAirport();
        res.render('admin/canLand', {
            title: '착륙 가능 관계 관리',
            canLands,
            airplaneTypes,
            airports,
        });
    } catch (error) {
        console.error('Can land list error:', error);
        res.status(500).send('Error loading can land relations');
    }
});

router.post('/can-land', async (req, res) => {
    try {
        await insertSql.setCanLand(req.body);
        res.redirect('/admin/can-land');
    } catch (error) {
        console.error('Can land insert error:', error);
        res.send(`<script>alert('착륙 가능 관계 추가 실패: ${error.message}'); location.href='/admin/can-land';</script>`);
    }
});

router.post('/can-land/delete', async (req, res) => {
    try {
        await deleteSql.deleteCanLand(req.body.airplaneType, req.body.airportCode);
        res.redirect('/admin/can-land');
    } catch (error) {
        console.error('Can land delete error:', error);
        res.send(`<script>alert('착륙 가능 관계 삭제 실패: ${error.message}'); location.href='/admin/can-land';</script>`);
    }
});

// ============================================
// 항공편 관리
// ============================================
router.get('/flight', async (req, res) => {
    try {
        const flights = await selectSql.getFlight();
        res.render('admin/flight', {
            title: '항공편 관리',
            flights,
        });
    } catch (error) {
        console.error('Flight list error:', error);
        res.status(500).send('Error loading flights');
    }
});

router.post('/flight', async (req, res) => {
    try {
        await insertSql.setFlight(req.body);
        res.redirect('/admin/flight');
    } catch (error) {
        console.error('Flight insert error:', error);
        res.send(`<script>alert('항공편 추가 실패: ${error.message}'); location.href='/admin/flight';</script>`);
    }
});

router.get('/flight/update/:number', async (req, res) => {
    try {
        const flight = await selectSql.getFlightByNumber(req.params.number);
        res.render('admin/flightUpdate', {
            title: '항공편 수정',
            flight,
        });
    } catch (error) {
        console.error('Flight update get error:', error);
        res.status(500).send('Error loading flight');
    }
});

router.post('/flight/update', async (req, res) => {
    try {
        await updateSql.updateFlight(req.body);
        res.redirect('/admin/flight');
    } catch (error) {
        console.error('Flight update error:', error);
        res.send(`<script>alert('항공편 수정 실패: ${error.message}'); location.href='/admin/flight';</script>`);
    }
});

router.post('/flight/delete', async (req, res) => {
    try {
        await deleteSql.deleteFlight(req.body.number);
        res.redirect('/admin/flight');
    } catch (error) {
        console.error('Flight delete error:', error);
        res.send(`<script>alert('항공편 삭제 실패: ${error.message}'); location.href='/admin/flight';</script>`);
    }
});

// ============================================
// 항공편 구간 관리
// ============================================
router.get('/flight-leg', async (req, res) => {
    try {
        const flightLegs = await selectSql.getFlightLeg();
        const flights = await selectSql.getFlight();
        const airports = await selectSql.getAirport();
        res.render('admin/flightLeg', {
            title: '항공편 구간 관리',
            flightLegs,
            flights,
            airports,
        });
    } catch (error) {
        console.error('Flight leg list error:', error);
        res.status(500).send('Error loading flight legs');
    }
});

router.post('/flight-leg', async (req, res) => {
    try {
        await insertSql.setFlightLeg(req.body);
        res.redirect('/admin/flight-leg');
    } catch (error) {
        console.error('Flight leg insert error:', error);
        res.send(`<script>alert('항공편 구간 추가 실패: ${error.message}'); location.href='/admin/flight-leg';</script>`);
    }
});

router.get('/flight-leg/update/:flightNumber/:legNumber', async (req, res) => {
    try {
        const flightLeg = await selectSql.getFlightLegByKey(req.params.flightNumber, req.params.legNumber);
        const airports = await selectSql.getAirport();
        res.render('admin/flightLegUpdate', {
            title: '항공편 구간 수정',
            flightLeg,
            airports,
        });
    } catch (error) {
        console.error('Flight leg update get error:', error);
        res.status(500).send('Error loading flight leg');
    }
});

router.post('/flight-leg/update', async (req, res) => {
    try {
        await updateSql.updateFlightLeg(req.body);
        res.redirect('/admin/flight-leg');
    } catch (error) {
        console.error('Flight leg update error:', error);
        res.send(`<script>alert('항공편 구간 수정 실패: ${error.message}'); location.href='/admin/flight-leg';</script>`);
    }
});

router.post('/flight-leg/delete', async (req, res) => {
    try {
        await deleteSql.deleteFlightLeg(req.body.flightNumber, req.body.legNumber);
        res.redirect('/admin/flight-leg');
    } catch (error) {
        console.error('Flight leg delete error:', error);
        res.send(`<script>alert('항공편 구간 삭제 실패: ${error.message}'); location.href='/admin/flight-leg';</script>`);
    }
});

// ============================================
// 항공편 구간 인스턴스 관리
// ============================================
router.get('/leg-instance', async (req, res) => {
    try {
        const legInstances = await selectSql.getLegInstance();
        const flightLegs = await selectSql.getFlightLeg();
        const airplanes = await selectSql.getAirplane();
        res.render('admin/legInstance', {
            title: '항공편 구간 인스턴스 관리',
            legInstances,
            flightLegs,
            airplanes,
        });
    } catch (error) {
        console.error('Leg instance list error:', error);
        res.status(500).send('Error loading leg instances');
    }
});

router.post('/leg-instance', async (req, res) => {
    try {
        // 제약조건 검증
        const validation = await validationSql.validateLegInstance(req.body);
        if (!validation.valid) {
            return res.send(`<script>alert('제약조건 위반: ${validation.errors.join(', ')}'); location.href='/admin/leg-instance';</script>`);
        }
        
        await insertSql.setLegInstance(req.body);
        res.redirect('/admin/leg-instance');
    } catch (error) {
        console.error('Leg instance insert error:', error);
        res.send(`<script>alert('항공편 구간 인스턴스 추가 실패: ${error.message}'); location.href='/admin/leg-instance';</script>`);
    }
});

router.get('/leg-instance/update/:flightNumber/:legNumber/:date', async (req, res) => {
    try {
        const legInstance = await selectSql.getLegInstanceByKey(
            req.params.flightNumber, 
            req.params.legNumber, 
            req.params.date
        );
        const airplanes = await selectSql.getAirplane();
        const airports = await selectSql.getAirport();
        res.render('admin/legInstanceUpdate', {
            title: '항공편 구간 인스턴스 수정',
            legInstance,
            airplanes,
            airports,
        });
    } catch (error) {
        console.error('Leg instance update get error:', error);
        res.status(500).send('Error loading leg instance');
    }
});

router.post('/leg-instance/update', async (req, res) => {
    try {
        await updateSql.updateLegInstance(req.body);
        res.redirect('/admin/leg-instance');
    } catch (error) {
        console.error('Leg instance update error:', error);
        res.send(`<script>alert('항공편 구간 인스턴스 수정 실패: ${error.message}'); location.href='/admin/leg-instance';</script>`);
    }
});

router.post('/leg-instance/delete', async (req, res) => {
    try {
        await deleteSql.deleteLegInstance(req.body.flightNumber, req.body.legNumber, req.body.date);
        res.redirect('/admin/leg-instance');
    } catch (error) {
        console.error('Leg instance delete error:', error);
        res.send(`<script>alert('항공편 구간 인스턴스 삭제 실패: ${error.message}'); location.href='/admin/leg-instance';</script>`);
    }
});

// ============================================
// 요금 관리
// ============================================
router.get('/fare', async (req, res) => {
    try {
        const fares = await selectSql.getFare();
        const flights = await selectSql.getFlight();
        res.render('admin/fare', {
            title: '요금 관리',
            fares,
            flights,
        });
    } catch (error) {
        console.error('Fare list error:', error);
        res.status(500).send('Error loading fares');
    }
});

router.post('/fare', async (req, res) => {
    try {
        await insertSql.setFare(req.body);
        res.redirect('/admin/fare');
    } catch (error) {
        console.error('Fare insert error:', error);
        res.send(`<script>alert('요금 추가 실패: ${error.message}'); location.href='/admin/fare';</script>`);
    }
});

router.get('/fare/update/:flightNumber/:fareCode', async (req, res) => {
    try {
        const fares = await selectSql.getFareByFlight(req.params.flightNumber);
        const fare = fares.find(f => f.Fare_code === req.params.fareCode);
        res.render('admin/fareUpdate', {
            title: '요금 수정',
            fare,
        });
    } catch (error) {
        console.error('Fare update get error:', error);
        res.status(500).send('Error loading fare');
    }
});

router.post('/fare/update', async (req, res) => {
    try {
        await updateSql.updateFare(req.body);
        res.redirect('/admin/fare');
    } catch (error) {
        console.error('Fare update error:', error);
        res.send(`<script>alert('요금 수정 실패: ${error.message}'); location.href='/admin/fare';</script>`);
    }
});

router.post('/fare/delete', async (req, res) => {
    try {
        await deleteSql.deleteFare(req.body.flightNumber, req.body.fareCode);
        res.redirect('/admin/fare');
    } catch (error) {
        console.error('Fare delete error:', error);
        res.send(`<script>alert('요금 삭제 실패: ${error.message}'); location.href='/admin/fare';</script>`);
    }
});

export default router;

