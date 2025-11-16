import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'dbuser',
    password: 'c3409711!',
    database: 'AIRLINE',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
    multipleStatements: false,
    supportBigNumbers: true,
    bigNumberStrings: true,
});

const promisePool = pool.promise();

// ============================================
// SELECT 쿼리
// ============================================
export const selectSql = {
    // AIRPORT
    getAirport: async () => {
        const sql = `SELECT * FROM AIRPORT ORDER BY Airport_code`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getAirportByCode: async (code) => {
        const sql = `SELECT * FROM AIRPORT WHERE Airport_code = ?`;
        const [result] = await promisePool.query(sql, [code]);
        return result[0];
    },

    // AIRPLANE_TYPE
    getAirplaneType: async () => {
        const sql = `SELECT * FROM AIRPLANE_TYPE ORDER BY Type_name`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getAirplaneTypeByName: async (name) => {
        const sql = `SELECT * FROM AIRPLANE_TYPE WHERE Type_name = ?`;
        const [result] = await promisePool.query(sql, [name]);
        return result[0];
    },

    // AIRPLANE
    getAirplane: async () => {
        const sql = `SELECT a.*, at.Max_seats, at.Company 
                     FROM AIRPLANE a 
                     JOIN AIRPLANE_TYPE at ON a.Airplane_type = at.Type_name 
                     ORDER BY a.Airplane_id`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getAirplaneById: async (id) => {
        const sql = `SELECT a.*, at.Max_seats, at.Company 
                     FROM AIRPLANE a 
                     JOIN AIRPLANE_TYPE at ON a.Airplane_type = at.Type_name 
                     WHERE a.Airplane_id = ?`;
        const [result] = await promisePool.query(sql, [id]);
        return result[0];
    },

    // CAN_LAND
    getCanLand: async () => {
        const sql = `SELECT cl.*, at.Max_seats, a.Name as Airport_name, a.City 
                     FROM CAN_LAND cl 
                     JOIN AIRPLANE_TYPE at ON cl.Airplane_type_name = at.Type_name 
                     JOIN AIRPORT a ON cl.Airport_code = a.Airport_code 
                     ORDER BY cl.Airplane_type_name, cl.Airport_code`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    checkCanLand: async (airplaneType, airportCode) => {
        const sql = `SELECT * FROM CAN_LAND 
                     WHERE Airplane_type_name = ? AND Airport_code = ?`;
        const [result] = await promisePool.query(sql, [airplaneType, airportCode]);
        return result.length > 0;
    },

    // FLIGHT
    getFlight: async () => {
        const sql = `SELECT * FROM FLIGHT ORDER BY Flight_number`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getFlightByNumber: async (number) => {
        const sql = `SELECT * FROM FLIGHT WHERE Flight_number = ?`;
        const [result] = await promisePool.query(sql, [number]);
        return result[0];
    },

    // FLIGHT_LEG
    getFlightLeg: async () => {
        const sql = `SELECT fl.*, 
                            dep.Name as Departure_airport_name, dep.City as Departure_city,
                            arr.Name as Arrival_airport_name, arr.City as Arrival_city
                     FROM FLIGHT_LEG fl
                     JOIN AIRPORT dep ON fl.Departure_airport_code = dep.Airport_code
                     JOIN AIRPORT arr ON fl.Arrival_airport_code = arr.Airport_code
                     ORDER BY fl.Flight_number, fl.Leg_number`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getFlightLegByFlight: async (flightNumber) => {
        const sql = `SELECT fl.*, 
                            dep.Name as Departure_airport_name, dep.City as Departure_city,
                            arr.Name as Arrival_airport_name, arr.City as Arrival_city
                     FROM FLIGHT_LEG fl
                     JOIN AIRPORT dep ON fl.Departure_airport_code = dep.Airport_code
                     JOIN AIRPORT arr ON fl.Arrival_airport_code = arr.Airport_code
                     WHERE fl.Flight_number = ?
                     ORDER BY fl.Leg_number`;
        const [result] = await promisePool.query(sql, [flightNumber]);
        return result;
    },
    getFlightLegByKey: async (flightNumber, legNumber) => {
        const sql = `SELECT * FROM FLIGHT_LEG 
                     WHERE Flight_number = ? AND Leg_number = ?`;
        const [result] = await promisePool.query(sql, [flightNumber, legNumber]);
        return result[0];
    },

    // LEG_INSTANCE
    getLegInstance: async () => {
        const sql = `SELECT li.*, 
                            a.Airplane_id, a.Airplane_type,
                            dep.Name as Departure_airport_name, dep.City as Departure_city,
                            arr.Name as Arrival_airport_name, arr.City as Arrival_city
                     FROM LEG_INSTANCE li
                     JOIN AIRPLANE a ON li.Airplane_id = a.Airplane_id
                     JOIN AIRPORT dep ON li.Departure_airport_code = dep.Airport_code
                     JOIN AIRPORT arr ON li.Arrival_airport_code = arr.Airport_code
                     ORDER BY li.Date DESC, li.Flight_number, li.Leg_number`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getLegInstanceByKey: async (flightNumber, legNumber, date) => {
        const sql = `SELECT li.*, 
                            a.Airplane_id, a.Airplane_type,
                            dep.Name as Departure_airport_name, dep.City as Departure_city,
                            arr.Name as Arrival_airport_name, arr.City as Arrival_city
                     FROM LEG_INSTANCE li
                     JOIN AIRPLANE a ON li.Airplane_id = a.Airplane_id
                     JOIN AIRPORT dep ON li.Departure_airport_code = dep.Airport_code
                     JOIN AIRPORT arr ON li.Arrival_airport_code = arr.Airport_code
                     WHERE li.Flight_number = ? AND li.Leg_number = ? AND li.Date = ?`;
        const [result] = await promisePool.query(sql, [flightNumber, legNumber, date]);
        return result[0];
    },
    getAvailableFlights: async (departureCode, arrivalCode, date) => {
        const sql = `SELECT * FROM vw_available_flights 
                     WHERE Departure_airport_code = ? 
                       AND Arrival_airport_code = ? 
                       AND Date = ?`;
        const [result] = await promisePool.query(sql, [departureCode, arrivalCode, date]);
        return result;
    },

    // FARE
    getFare: async () => {
        const sql = `SELECT f.*, fl.Airline 
                     FROM FARE f
                     JOIN FLIGHT fl ON f.Flight_number = fl.Flight_number
                     ORDER BY f.Flight_number, f.Fare_code`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getFareByFlight: async (flightNumber) => {
        const sql = `SELECT * FROM FARE WHERE Flight_number = ? ORDER BY Fare_code`;
        const [result] = await promisePool.query(sql, [flightNumber]);
        return result;
    },

    // CUSTOMER
    getCustomer: async () => {
        const sql = `SELECT * FROM CUSTOMER ORDER BY Customer_id`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getCustomerById: async (id) => {
        const sql = `SELECT * FROM CUSTOMER WHERE Customer_id = ?`;
        const [result] = await promisePool.query(sql, [id]);
        return result[0];
    },
    getCustomerByPhone: async (phone) => {
        const sql = `SELECT * FROM CUSTOMER WHERE Phone_number = ?`;
        const [result] = await promisePool.query(sql, [phone]);
        return result[0];
    },

    // SEAT_RESERVATION
    getSeatReservation: async () => {
        const sql = `SELECT * FROM vw_customer_reservations ORDER BY Reservation_date DESC`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getSeatReservationByCustomer: async (customerId) => {
        const sql = `SELECT * FROM vw_customer_reservations 
                     WHERE Customer_id = ? 
                     ORDER BY Date DESC, Reservation_date DESC`;
        const [result] = await promisePool.query(sql, [customerId]);
        return result;
    },
    getSeatReservationByKey: async (flightNumber, legNumber, date, seatNumber) => {
        const sql = `SELECT * FROM SEAT_RESERVATION 
                     WHERE Flight_number = ? AND Leg_number = ? AND Date = ? AND Seat_number = ?`;
        const [result] = await promisePool.query(sql, [flightNumber, legNumber, date, seatNumber]);
        return result[0];
    },
    getReservedSeats: async (flightNumber, legNumber, date) => {
        const sql = `SELECT Seat_number FROM SEAT_RESERVATION 
                     WHERE Flight_number = ? AND Leg_number = ? AND Date = ?`;
        const [result] = await promisePool.query(sql, [flightNumber, legNumber, date]);
        return result.map(row => row.Seat_number);
    },
};

// ============================================
// INSERT 쿼리
// ============================================
export const insertSql = {
    // AIRPORT
    setAirport: async (data) => {
        const sql = `INSERT INTO AIRPORT (Airport_code, Name, City, Country, Timezone) 
                     VALUES (?, ?, ?, ?, ?)`;
        await promisePool.query(sql, [
            data.Airport_code,
            data.Name,
            data.City,
            data.Country,
            data.Timezone || null
        ]);
    },

    // AIRPLANE_TYPE
    setAirplaneType: async (data) => {
        const sql = `INSERT INTO AIRPLANE_TYPE (Type_name, Max_seats, Company) 
                     VALUES (?, ?, ?)`;
        await promisePool.query(sql, [
            data.Type_name,
            data.Max_seats,
            data.Company || null
        ]);
    },

    // AIRPLANE
    setAirplane: async (data) => {
        const sql = `INSERT INTO AIRPLANE (Airplane_id, Total_number_of_seats, Airplane_type) 
                     VALUES (?, ?, ?)`;
        await promisePool.query(sql, [
            data.Airplane_id,
            data.Total_number_of_seats,
            data.Airplane_type
        ]);
    },

    // CAN_LAND
    setCanLand: async (data) => {
        const sql = `INSERT INTO CAN_LAND (Airplane_type_name, Airport_code) 
                     VALUES (?, ?)`;
        await promisePool.query(sql, [
            data.Airplane_type_name,
            data.Airport_code
        ]);
    },

    // FLIGHT
    setFlight: async (data) => {
        const sql = `INSERT INTO FLIGHT (Flight_number, Airline, Weekdays) 
                     VALUES (?, ?, ?)`;
        await promisePool.query(sql, [
            data.Flight_number,
            data.Airline,
            data.Weekdays || null
        ]);
    },

    // FLIGHT_LEG
    setFlightLeg: async (data) => {
        const sql = `INSERT INTO FLIGHT_LEG 
                        (Flight_number, Leg_number, Departure_airport_code, Scheduled_departure_time, 
                         Arrival_airport_code, Scheduled_arrival_time) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        await promisePool.query(sql, [
            data.Flight_number,
            data.Leg_number,
            data.Departure_airport_code,
            data.Scheduled_departure_time,
            data.Arrival_airport_code,
            data.Scheduled_arrival_time
        ]);
    },

    // LEG_INSTANCE
    setLegInstance: async (data) => {
        const sql = `INSERT INTO LEG_INSTANCE 
                        (Flight_number, Leg_number, Date, Airplane_id, Number_of_available_seats,
                         Departure_airport_code, Departure_time, Arrival_airport_code, Arrival_time) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        await promisePool.query(sql, [
            data.Flight_number,
            data.Leg_number,
            data.Date,
            data.Airplane_id,
            data.Number_of_available_seats || null,
            data.Departure_airport_code,
            data.Departure_time,
            data.Arrival_airport_code,
            data.Arrival_time
        ]);
    },

    // FARE
    setFare: async (data) => {
        const sql = `INSERT INTO FARE (Flight_number, Fare_code, Amount, Restrictions) 
                     VALUES (?, ?, ?, ?)`;
        await promisePool.query(sql, [
            data.Flight_number,
            data.Fare_code,
            data.Amount,
            data.Restrictions || null
        ]);
    },

    // CUSTOMER
    setCustomer: async (data) => {
        const sql = `INSERT INTO CUSTOMER (Name, Phone_number, Email, Passport_number) 
                     VALUES (?, ?, ?, ?)`;
        const [result] = await promisePool.query(sql, [
            data.Name,
            data.Phone_number,
            data.Email || null,
            data.Passport_number || null
        ]);
        return result.insertId;
    },

    // SEAT_RESERVATION (트랜잭션 필요)
    setSeatReservation: async (data) => {
        const connection = await promisePool.getConnection();
        try {
            await connection.beginTransaction();

            // 좌석 예약 삽입
            const sql1 = `INSERT INTO SEAT_RESERVATION 
                         (Flight_number, Leg_number, Date, Seat_number, Customer_id) 
                         VALUES (?, ?, ?, ?, ?)`;
            await connection.query(sql1, [
                data.Flight_number,
                data.Leg_number,
                data.Date,
                data.Seat_number,
                data.Customer_id
            ]);

            // 사용 가능한 좌석 수 감소
            const sql2 = `UPDATE LEG_INSTANCE 
                         SET Number_of_available_seats = Number_of_available_seats - 1 
                         WHERE Flight_number = ? AND Leg_number = ? AND Date = ?`;
            await connection.query(sql2, [
                data.Flight_number,
                data.Leg_number,
                data.Date
            ]);

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },
};

// ============================================
// UPDATE 쿼리
// ============================================
export const updateSql = {
    // AIRPORT
    updateAirport: async (data) => {
        const sql = `UPDATE AIRPORT 
                     SET Name = ?, City = ?, Country = ?, Timezone = ? 
                     WHERE Airport_code = ?`;
        await promisePool.query(sql, [
            data.Name,
            data.City,
            data.Country,
            data.Timezone || null,
            data.Airport_code
        ]);
    },

    // AIRPLANE_TYPE
    updateAirplaneType: async (data) => {
        const sql = `UPDATE AIRPLANE_TYPE 
                     SET Max_seats = ?, Company = ? 
                     WHERE Type_name = ?`;
        await promisePool.query(sql, [
            data.Max_seats,
            data.Company || null,
            data.Type_name
        ]);
    },

    // AIRPLANE
    updateAirplane: async (data) => {
        const sql = `UPDATE AIRPLANE 
                     SET Total_number_of_seats = ?, Airplane_type = ? 
                     WHERE Airplane_id = ?`;
        await promisePool.query(sql, [
            data.Total_number_of_seats,
            data.Airplane_type,
            data.Airplane_id
        ]);
    },

    // FLIGHT
    updateFlight: async (data) => {
        const sql = `UPDATE FLIGHT 
                     SET Airline = ?, Weekdays = ? 
                     WHERE Flight_number = ?`;
        await promisePool.query(sql, [
            data.Airline,
            data.Weekdays || null,
            data.Flight_number
        ]);
    },

    // FLIGHT_LEG
    updateFlightLeg: async (data) => {
        const sql = `UPDATE FLIGHT_LEG 
                     SET Departure_airport_code = ?, Scheduled_departure_time = ?,
                         Arrival_airport_code = ?, Scheduled_arrival_time = ? 
                     WHERE Flight_number = ? AND Leg_number = ?`;
        await promisePool.query(sql, [
            data.Departure_airport_code,
            data.Scheduled_departure_time,
            data.Arrival_airport_code,
            data.Scheduled_arrival_time,
            data.Flight_number,
            data.Leg_number
        ]);
    },

    // LEG_INSTANCE
    updateLegInstance: async (data) => {
        const sql = `UPDATE LEG_INSTANCE 
                     SET Airplane_id = ?, Number_of_available_seats = ?,
                         Departure_airport_code = ?, Departure_time = ?,
                         Arrival_airport_code = ?, Arrival_time = ? 
                     WHERE Flight_number = ? AND Leg_number = ? AND Date = ?`;
        await promisePool.query(sql, [
            data.Airplane_id,
            data.Number_of_available_seats,
            data.Departure_airport_code,
            data.Departure_time,
            data.Arrival_airport_code,
            data.Arrival_time,
            data.Flight_number,
            data.Leg_number,
            data.Date
        ]);
    },

    // FARE
    updateFare: async (data) => {
        const sql = `UPDATE FARE 
                     SET Amount = ?, Restrictions = ? 
                     WHERE Flight_number = ? AND Fare_code = ?`;
        await promisePool.query(sql, [
            data.Amount,
            data.Restrictions || null,
            data.Flight_number,
            data.Fare_code
        ]);
    },

    // CUSTOMER
    updateCustomer: async (data) => {
        const sql = `UPDATE CUSTOMER 
                     SET Name = ?, Phone_number = ?, Email = ?, Passport_number = ? 
                     WHERE Customer_id = ?`;
        await promisePool.query(sql, [
            data.Name,
            data.Phone_number,
            data.Email || null,
            data.Passport_number || null,
            data.Customer_id
        ]);
    },
};

// ============================================
// DELETE 쿼리
// ============================================
export const deleteSql = {
    // AIRPORT
    deleteAirport: async (code) => {
        const sql = `DELETE FROM AIRPORT WHERE Airport_code = ?`;
        await promisePool.query(sql, [code]);
    },

    // AIRPLANE_TYPE
    deleteAirplaneType: async (name) => {
        const sql = `DELETE FROM AIRPLANE_TYPE WHERE Type_name = ?`;
        await promisePool.query(sql, [name]);
    },

    // AIRPLANE
    deleteAirplane: async (id) => {
        const sql = `DELETE FROM AIRPLANE WHERE Airplane_id = ?`;
        await promisePool.query(sql, [id]);
    },

    // CAN_LAND
    deleteCanLand: async (airplaneType, airportCode) => {
        const sql = `DELETE FROM CAN_LAND 
                     WHERE Airplane_type_name = ? AND Airport_code = ?`;
        await promisePool.query(sql, [airplaneType, airportCode]);
    },

    // FLIGHT
    deleteFlight: async (number) => {
        const sql = `DELETE FROM FLIGHT WHERE Flight_number = ?`;
        await promisePool.query(sql, [number]);
    },

    // FLIGHT_LEG
    deleteFlightLeg: async (flightNumber, legNumber) => {
        const sql = `DELETE FROM FLIGHT_LEG 
                     WHERE Flight_number = ? AND Leg_number = ?`;
        await promisePool.query(sql, [flightNumber, legNumber]);
    },

    // LEG_INSTANCE
    deleteLegInstance: async (flightNumber, legNumber, date) => {
        const sql = `DELETE FROM LEG_INSTANCE 
                     WHERE Flight_number = ? AND Leg_number = ? AND Date = ?`;
        await promisePool.query(sql, [flightNumber, legNumber, date]);
    },

    // FARE
    deleteFare: async (flightNumber, fareCode) => {
        const sql = `DELETE FROM FARE 
                     WHERE Flight_number = ? AND Fare_code = ?`;
        await promisePool.query(sql, [flightNumber, fareCode]);
    },

    // CUSTOMER
    deleteCustomer: async (id) => {
        const sql = `DELETE FROM CUSTOMER WHERE Customer_id = ?`;
        await promisePool.query(sql, [id]);
    },

    // SEAT_RESERVATION (트랜잭션 필요)
    deleteSeatReservation: async (flightNumber, legNumber, date, seatNumber) => {
        const connection = await promisePool.getConnection();
        try {
            await connection.beginTransaction();

            // 좌석 예약 삭제
            const sql1 = `DELETE FROM SEAT_RESERVATION 
                         WHERE Flight_number = ? AND Leg_number = ? AND Date = ? AND Seat_number = ?`;
            await connection.query(sql1, [flightNumber, legNumber, date, seatNumber]);

            // 사용 가능한 좌석 수 증가
            const sql2 = `UPDATE LEG_INSTANCE 
                         SET Number_of_available_seats = Number_of_available_seats + 1 
                         WHERE Flight_number = ? AND Leg_number = ? AND Date = ?`;
            await connection.query(sql2, [flightNumber, legNumber, date]);

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },
};

// ============================================
// 제약조건 검증 함수
// ============================================
export const validationSql = {
    // FLIGHT_LEG 존재 여부 확인
    checkFlightLegExists: async (flightNumber, legNumber) => {
        const result = await selectSql.getFlightLegByKey(flightNumber, legNumber);
        return result !== undefined;
    },

    // AIRPLANE 존재 여부 확인
    checkAirplaneExists: async (airplaneId) => {
        const result = await selectSql.getAirplaneById(airplaneId);
        return result !== undefined;
    },

    // CAN_LAND 관계 확인
    checkCanLandRelation: async (airplaneId, arrivalAirportCode) => {
        const airplane = await selectSql.getAirplaneById(airplaneId);
        if (!airplane) return false;
        return await selectSql.checkCanLand(airplane.Airplane_type, arrivalAirportCode);
    },

    // 좌석 수 확인
    checkSeatCount: async (airplaneId, availableSeats) => {
        const airplane = await selectSql.getAirplaneById(airplaneId);
        if (!airplane) return false;
        return availableSeats <= airplane.Total_number_of_seats;
    },

    // FLIGHT 존재 여부 확인
    checkFlightExists: async (flightNumber) => {
        const result = await selectSql.getFlightByNumber(flightNumber);
        return result !== undefined;
    },

    // AIRPORT 존재 여부 확인
    checkAirportExists: async (airportCode) => {
        const result = await selectSql.getAirportByCode(airportCode);
        return result !== undefined;
    },

    // LEG_INSTANCE 삽입 전 모든 제약조건 검증
    validateLegInstance: async (data) => {
        const errors = [];

        // FLIGHT_LEG 존재 확인
        const flightLegExists = await validationSql.checkFlightLegExists(
            data.Flight_number, data.Leg_number
        );
        if (!flightLegExists) {
            errors.push('FLIGHT_LEG does not exist');
        }

        // AIRPLANE 존재 확인
        const airplaneExists = await validationSql.checkAirplaneExists(data.Airplane_id);
        if (!airplaneExists) {
            errors.push('AIRPLANE does not exist');
        }

        // CAN_LAND 관계 확인
        const canLand = await validationSql.checkCanLandRelation(
            data.Airplane_id, data.Arrival_airport_code
        );
        if (!canLand) {
            errors.push('Airplane type cannot land at arrival airport');
        }

        // AIRPORT 존재 확인
        const depAirportExists = await validationSql.checkAirportExists(
            data.Departure_airport_code
        );
        if (!depAirportExists) {
            errors.push('Departure airport does not exist');
        }

        const arrAirportExists = await validationSql.checkAirportExists(
            data.Arrival_airport_code
        );
        if (!arrAirportExists) {
            errors.push('Arrival airport does not exist');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    },
};
