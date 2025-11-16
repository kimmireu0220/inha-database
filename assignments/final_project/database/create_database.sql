-- ============================================
-- AIRLINE 데이터베이스 생성 스크립트
-- ============================================

-- 데이터베이스 생성
DROP DATABASE IF EXISTS AIRLINE;
CREATE DATABASE AIRLINE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE AIRLINE;

-- ============================================
-- 1. AIRPORT 테이블 (공항 정보)
-- ============================================
CREATE TABLE AIRPORT (
    Airport_code VARCHAR(3) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    City VARCHAR(50) NOT NULL,
    Country VARCHAR(50) NOT NULL,
    Timezone VARCHAR(50),
    INDEX idx_city (City)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. AIRPLANE_TYPE 테이블 (항공기 타입)
-- ============================================
CREATE TABLE AIRPLANE_TYPE (
    Type_name VARCHAR(50) PRIMARY KEY,
    Max_seats INT NOT NULL CHECK (Max_seats > 0),
    Company VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. AIRPLANE 테이블 (항공기)
-- ============================================
CREATE TABLE AIRPLANE (
    Airplane_id VARCHAR(10) PRIMARY KEY,
    Total_number_of_seats INT NOT NULL CHECK (Total_number_of_seats > 0),
    Airplane_type VARCHAR(50) NOT NULL,
    FOREIGN KEY (Airplane_type) REFERENCES AIRPLANE_TYPE(Type_name)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_airplane_type (Airplane_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. CAN_LAND 테이블 (항공기 타입-공항 착륙 가능 관계)
-- ============================================
CREATE TABLE CAN_LAND (
    Airplane_type_name VARCHAR(50),
    Airport_code VARCHAR(3),
    PRIMARY KEY (Airplane_type_name, Airport_code),
    FOREIGN KEY (Airplane_type_name) REFERENCES AIRPLANE_TYPE(Type_name)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Airport_code) REFERENCES AIRPORT(Airport_code)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. FLIGHT 테이블 (항공편)
-- ============================================
CREATE TABLE FLIGHT (
    Flight_number VARCHAR(10) PRIMARY KEY,
    Airline VARCHAR(50) NOT NULL,
    Weekdays VARCHAR(20) COMMENT '운항 요일 (예: Mon,Wed,Fri)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. FLIGHT_LEG 테이블 (항공편 구간)
-- ============================================
CREATE TABLE FLIGHT_LEG (
    Flight_number VARCHAR(10),
    Leg_number INT,
    Departure_airport_code VARCHAR(3) NOT NULL,
    Scheduled_departure_time TIME NOT NULL,
    Arrival_airport_code VARCHAR(3) NOT NULL,
    Scheduled_arrival_time TIME NOT NULL,
    PRIMARY KEY (Flight_number, Leg_number),
    FOREIGN KEY (Flight_number) REFERENCES FLIGHT(Flight_number)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Departure_airport_code) REFERENCES AIRPORT(Airport_code)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (Arrival_airport_code) REFERENCES AIRPORT(Airport_code)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CHECK (Leg_number > 0),
    INDEX idx_departure_airport (Departure_airport_code),
    INDEX idx_arrival_airport (Arrival_airport_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. FARE 테이블 (요금)
-- ============================================
CREATE TABLE FARE (
    Flight_number VARCHAR(10),
    Fare_code VARCHAR(10),
    Amount DECIMAL(10, 2) NOT NULL CHECK (Amount >= 0),
    Restrictions VARCHAR(200),
    PRIMARY KEY (Flight_number, Fare_code),
    FOREIGN KEY (Flight_number) REFERENCES FLIGHT(Flight_number)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. LEG_INSTANCE 테이블 (항공편 구간 인스턴스 - 날짜별)
-- ============================================
CREATE TABLE LEG_INSTANCE (
    Flight_number VARCHAR(10),
    Leg_number INT,
    Date DATE,
    Airplane_id VARCHAR(10) NOT NULL,
    Number_of_available_seats INT NOT NULL CHECK (Number_of_available_seats >= 0),
    Departure_airport_code VARCHAR(3),
    Departure_time TIME,
    Arrival_airport_code VARCHAR(3),
    Arrival_time TIME,
    PRIMARY KEY (Flight_number, Leg_number, Date),
    FOREIGN KEY (Flight_number, Leg_number) REFERENCES FLIGHT_LEG(Flight_number, Leg_number)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Airplane_id) REFERENCES AIRPLANE(Airplane_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (Departure_airport_code) REFERENCES AIRPORT(Airport_code)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (Arrival_airport_code) REFERENCES AIRPORT(Airport_code)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_date (Date),
    INDEX idx_airplane (Airplane_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. CUSTOMER 테이블 (고객 정보 - 예약을 위해 필요)
-- ============================================
CREATE TABLE CUSTOMER (
    Customer_id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Phone_number VARCHAR(20) NOT NULL,
    Email VARCHAR(100),
    Passport_number VARCHAR(20),
    UNIQUE KEY unique_phone (Phone_number),
    INDEX idx_name (Name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 10. SEAT_RESERVATION 테이블 (좌석 예약)
-- ============================================
CREATE TABLE SEAT_RESERVATION (
    Flight_number VARCHAR(10),
    Leg_number INT,
    Date DATE,
    Seat_number VARCHAR(5) NOT NULL,
    Customer_id INT NOT NULL,
    Reservation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Flight_number, Leg_number, Date, Seat_number),
    FOREIGN KEY (Flight_number, Leg_number, Date) 
        REFERENCES LEG_INSTANCE(Flight_number, Leg_number, Date)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Customer_id) REFERENCES CUSTOMER(Customer_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_customer (Customer_id),
    INDEX idx_reservation_date (Reservation_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 인덱스 추가 (성능 최적화)
-- ============================================

-- FLIGHT_LEG 조회 최적화
CREATE INDEX idx_flight_leg_composite ON FLIGHT_LEG(Flight_number, Leg_number);

-- LEG_INSTANCE 날짜 범위 조회 최적화
CREATE INDEX idx_leg_instance_date_range ON LEG_INSTANCE(Date, Flight_number);

-- SEAT_RESERVATION 고객별 조회 최적화
CREATE INDEX idx_seat_reservation_customer_date ON SEAT_RESERVATION(Customer_id, Date);

-- ============================================
-- 뷰 생성
-- ============================================

-- 항공편 상세 정보 뷰 (FLIGHT + FLIGHT_LEG 정보)
CREATE VIEW vw_flight_details AS
SELECT 
    f.Flight_number,
    f.Airline,
    f.Weekdays,
    fl.Leg_number,
    fl.Departure_airport_code,
    dep.Name AS Departure_airport_name,
    dep.City AS Departure_city,
    fl.Scheduled_departure_time,
    fl.Arrival_airport_code,
    arr.Name AS Arrival_airport_name,
    arr.City AS Arrival_city,
    fl.Scheduled_arrival_time
FROM FLIGHT f
LEFT JOIN FLIGHT_LEG fl ON f.Flight_number = fl.Flight_number
LEFT JOIN AIRPORT dep ON fl.Departure_airport_code = dep.Airport_code
LEFT JOIN AIRPORT arr ON fl.Arrival_airport_code = arr.Airport_code;

-- 예약 가능한 항공편 조회 뷰
CREATE VIEW vw_available_flights AS
SELECT 
    li.Flight_number,
    li.Leg_number,
    li.Date,
    fl.Departure_airport_code,
    dep.Name AS Departure_airport_name,
    dep.City AS Departure_city,
    li.Departure_time,
    fl.Arrival_airport_code,
    arr.Name AS Arrival_airport_name,
    arr.City AS Arrival_city,
    li.Arrival_time,
    li.Number_of_available_seats,
    a.Airplane_id,
    at.Type_name AS Airplane_type,
    at.Max_seats,
    (SELECT MIN(fa.Amount) FROM FARE fa WHERE fa.Flight_number = li.Flight_number) AS Min_fare
FROM LEG_INSTANCE li
JOIN FLIGHT_LEG fl ON li.Flight_number = fl.Flight_number AND li.Leg_number = fl.Leg_number
JOIN AIRPLANE a ON li.Airplane_id = a.Airplane_id
JOIN AIRPLANE_TYPE at ON a.Airplane_type = at.Type_name
JOIN AIRPORT dep ON li.Departure_airport_code = dep.Airport_code
JOIN AIRPORT arr ON li.Arrival_airport_code = arr.Airport_code
WHERE li.Number_of_available_seats > 0
  AND li.Date >= CURDATE();

-- 고객 예약 정보 뷰
CREATE VIEW vw_customer_reservations AS
SELECT 
    sr.Customer_id,
    c.Name AS Customer_name,
    c.Phone_number,
    sr.Flight_number,
    sr.Leg_number,
    sr.Date,
    sr.Seat_number,
    sr.Reservation_date,
    fl.Departure_airport_code,
    dep.Name AS Departure_airport_name,
    dep.City AS Departure_city,
    fl.Scheduled_departure_time,
    fl.Arrival_airport_code,
    arr.Name AS Arrival_airport_name,
    arr.City AS Arrival_city,
    fl.Scheduled_arrival_time,
    f.Airline
FROM SEAT_RESERVATION sr
JOIN CUSTOMER c ON sr.Customer_id = c.Customer_id
JOIN FLIGHT_LEG fl ON sr.Flight_number = fl.Flight_number AND sr.Leg_number = fl.Leg_number
JOIN FLIGHT f ON sr.Flight_number = f.Flight_number
JOIN AIRPORT dep ON fl.Departure_airport_code = dep.Airport_code
JOIN AIRPORT arr ON fl.Arrival_airport_code = arr.Airport_code;

-- ============================================
-- 트리거
-- ============================================
DELIMITER $$

-- LEG_INSTANCE 삽입 시 좌석 수 자동 설정
CREATE TRIGGER trg_set_available_seats
BEFORE INSERT ON LEG_INSTANCE
FOR EACH ROW
BEGIN
    DECLARE total_seats INT;
    SELECT Total_number_of_seats INTO total_seats
    FROM AIRPLANE
    WHERE Airplane_id = NEW.Airplane_id;
    
    IF NEW.Number_of_available_seats IS NULL OR NEW.Number_of_available_seats = 0 THEN
        SET NEW.Number_of_available_seats = total_seats;
    END IF;
END$$

-- FLIGHT_LEG 삽입 시 출발지와 도착지가 다른지 검증
CREATE TRIGGER trg_check_airports_different
BEFORE INSERT ON FLIGHT_LEG
FOR EACH ROW
BEGIN
    IF NEW.Departure_airport_code = NEW.Arrival_airport_code THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Departure and arrival airports must be different';
    END IF;
END$$

CREATE TRIGGER trg_check_airports_different_update
BEFORE UPDATE ON FLIGHT_LEG
FOR EACH ROW
BEGIN
    IF NEW.Departure_airport_code = NEW.Arrival_airport_code THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Departure and arrival airports must be different';
    END IF;
END$$

DELIMITER ;

-- ============================================
-- 샘플 데이터 삽입
-- ============================================

-- 공항 데이터
INSERT INTO AIRPORT (Airport_code, Name, City, Country, Timezone) VALUES
('ICN', 'Incheon International Airport', 'Incheon', 'South Korea', 'Asia/Seoul'),
('GMP', 'Gimpo International Airport', 'Seoul', 'South Korea', 'Asia/Seoul'),
('NRT', 'Narita International Airport', 'Tokyo', 'Japan', 'Asia/Tokyo'),
('HND', 'Haneda Airport', 'Tokyo', 'Japan', 'Asia/Tokyo'),
('PEK', 'Beijing Capital International Airport', 'Beijing', 'China', 'Asia/Shanghai'),
('PVG', 'Shanghai Pudong International Airport', 'Shanghai', 'China', 'Asia/Shanghai'),
('JFK', 'John F. Kennedy International Airport', 'New York', 'USA', 'America/New_York'),
('LAX', 'Los Angeles International Airport', 'Los Angeles', 'USA', 'America/Los_Angeles');

-- 항공기 타입
INSERT INTO AIRPLANE_TYPE (Type_name, Max_seats, Company) VALUES
('Boeing 737', 180, 'Boeing'),
('Boeing 777', 350, 'Boeing'),
('Airbus A320', 180, 'Airbus'),
('Airbus A380', 555, 'Airbus'),
('Boeing 787', 290, 'Boeing');

-- 항공기
INSERT INTO AIRPLANE (Airplane_id, Total_number_of_seats, Airplane_type) VALUES
('KR001', 180, 'Boeing 737'),
('KR002', 180, 'Boeing 737'),
('KR003', 350, 'Boeing 777'),
('KR004', 180, 'Airbus A320'),
('KR005', 555, 'Airbus A380'),
('KR006', 290, 'Boeing 787');

-- CAN_LAND 관계 (모든 항공기 타입이 모든 공항에 착륙 가능하다고 가정)
INSERT INTO CAN_LAND (Airplane_type_name, Airport_code)
SELECT Type_name, Airport_code
FROM AIRPLANE_TYPE, AIRPORT;

-- 항공편
INSERT INTO FLIGHT (Flight_number, Airline, Weekdays) VALUES
('KE001', 'Korean Air', 'Mon,Wed,Fri,Sun'),
('KE002', 'Korean Air', 'Tue,Thu,Sat'),
('KE101', 'Korean Air', 'Daily'),
('KE201', 'Korean Air', 'Mon,Wed,Fri'),
('OZ001', 'Asiana Airlines', 'Daily'),
('OZ101', 'Asiana Airlines', 'Mon,Wed,Fri,Sun');

-- 항공편 구간
INSERT INTO FLIGHT_LEG (Flight_number, Leg_number, Departure_airport_code, Scheduled_departure_time, Arrival_airport_code, Scheduled_arrival_time) VALUES
('KE001', 1, 'ICN', '08:00:00', 'NRT', '10:30:00'),
('KE001', 2, 'NRT', '11:30:00', 'JFK', '14:00:00'),
('KE002', 1, 'ICN', '14:00:00', 'PEK', '15:30:00'),
('KE101', 1, 'GMP', '09:00:00', 'HND', '11:00:00'),
('KE201', 1, 'ICN', '10:00:00', 'PVG', '11:30:00'),
('KE201', 2, 'PVG', '12:30:00', 'LAX', '08:00:00'),
('OZ001', 1, 'ICN', '13:00:00', 'NRT', '15:30:00'),
('OZ101', 1, 'GMP', '16:00:00', 'PEK', '17:30:00');

-- 요금
INSERT INTO FARE (Flight_number, Fare_code, Amount, Restrictions) VALUES
('KE001', 'ECONOMY', 500000.00, 'Non-refundable'),
('KE001', 'BUSINESS', 1500000.00, 'Refundable'),
('KE001', 'FIRST', 3000000.00, 'Fully refundable'),
('KE002', 'ECONOMY', 300000.00, 'Non-refundable'),
('KE101', 'ECONOMY', 200000.00, 'Non-refundable'),
('KE201', 'ECONOMY', 800000.00, 'Non-refundable'),
('KE201', 'BUSINESS', 2500000.00, 'Refundable'),
('OZ001', 'ECONOMY', 450000.00, 'Non-refundable'),
('OZ101', 'ECONOMY', 350000.00, 'Non-refundable');

-- 항공편 구간 인스턴스 (다음 주 날짜들)
INSERT INTO LEG_INSTANCE (Flight_number, Leg_number, Date, Airplane_id, Number_of_available_seats, Departure_airport_code, Departure_time, Arrival_airport_code, Arrival_time)
SELECT 
    'KE001', 1, DATE_ADD(CURDATE(), INTERVAL n DAY), 'KR001', 180, 'ICN', '08:00:00', 'NRT', '10:30:00'
FROM (
    SELECT 0 as n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14
) days
WHERE DAYOFWEEK(DATE_ADD(CURDATE(), INTERVAL n DAY)) IN (2, 4, 6, 1); -- Mon, Wed, Fri, Sun

INSERT INTO LEG_INSTANCE (Flight_number, Leg_number, Date, Airplane_id, Number_of_available_seats, Departure_airport_code, Departure_time, Arrival_airport_code, Arrival_time)
SELECT 
    'KE001', 2, DATE_ADD(CURDATE(), INTERVAL n DAY), 'KR003', 350, 'NRT', '11:30:00', 'JFK', '14:00:00'
FROM (
    SELECT 0 as n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14
) days
WHERE DAYOFWEEK(DATE_ADD(CURDATE(), INTERVAL n DAY)) IN (2, 4, 6, 1);

INSERT INTO LEG_INSTANCE (Flight_number, Leg_number, Date, Airplane_id, Number_of_available_seats, Departure_airport_code, Departure_time, Arrival_airport_code, Arrival_time)
SELECT 
    'KE101', 1, DATE_ADD(CURDATE(), INTERVAL n DAY), 'KR004', 180, 'GMP', '09:00:00', 'HND', '11:00:00'
FROM (
    SELECT 0 as n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14
) days;

-- 고객 샘플 데이터
INSERT INTO CUSTOMER (Name, Phone_number, Email, Passport_number) VALUES
('John Doe', '010-1234-5678', 'john@example.com', 'P123456'),
('Jane Smith', '010-2345-6789', 'jane@example.com', 'P234567'),
('Bob Johnson', '010-3456-7890', 'bob@example.com', 'P345678');

