# AIRLINE 데이터베이스 EER Diagram 정보

## 테이블 구조 및 관계

### 1. AIRPORT (공항)
- **Primary Key**: Airport_code (VARCHAR(3))
- **Attributes**: Name, City, Country, Timezone
- **Relationships**:
  - 1:N → FLIGHT_LEG (Departure_airport_code)
  - 1:N → FLIGHT_LEG (Arrival_airport_code)
  - 1:N → LEG_INSTANCE (Departure_airport_code)
  - 1:N → LEG_INSTANCE (Arrival_airport_code)
  - N:M → AIRPLANE_TYPE (through CAN_LAND)

### 2. AIRPLANE_TYPE (항공기 타입)
- **Primary Key**: Type_name (VARCHAR(50))
- **Attributes**: Max_seats, Company
- **Relationships**:
  - 1:N → AIRPLANE (Airplane_type)
  - N:M → AIRPORT (through CAN_LAND)

### 3. AIRPLANE (항공기)
- **Primary Key**: Airplane_id (VARCHAR(10))
- **Attributes**: Total_number_of_seats, Airplane_type
- **Foreign Keys**:
  - Airplane_type → AIRPLANE_TYPE.Type_name
- **Relationships**:
  - N:1 → AIRPLANE_TYPE
  - 1:N → LEG_INSTANCE

### 4. CAN_LAND (착륙 가능 관계)
- **Primary Key**: (Airplane_type_name, Airport_code)
- **Foreign Keys**:
  - Airplane_type_name → AIRPLANE_TYPE.Type_name
  - Airport_code → AIRPORT.Airport_code
- **Relationships**:
  - N:1 → AIRPLANE_TYPE
  - N:1 → AIRPORT

### 5. FLIGHT (항공편)
- **Primary Key**: Flight_number (VARCHAR(10))
- **Attributes**: Airline, Weekdays
- **Relationships**:
  - 1:N → FLIGHT_LEG
  - 1:N → FARE
  - 1:N → LEG_INSTANCE (through FLIGHT_LEG)

### 6. FLIGHT_LEG (항공편 구간)
- **Primary Key**: (Flight_number, Leg_number)
- **Attributes**: Scheduled_departure_time, Scheduled_arrival_time
- **Foreign Keys**:
  - Flight_number → FLIGHT.Flight_number
  - Departure_airport_code → AIRPORT.Airport_code
  - Arrival_airport_code → AIRPORT.Airport_code
- **Relationships**:
  - N:1 → FLIGHT
  - N:1 → AIRPORT (Departure)
  - N:1 → AIRPORT (Arrival)
  - 1:N → LEG_INSTANCE

### 7. LEG_INSTANCE (항공편 구간 인스턴스)
- **Primary Key**: (Flight_number, Leg_number, Date)
- **Attributes**: Number_of_available_seats, Departure_time, Arrival_time
- **Foreign Keys**:
  - (Flight_number, Leg_number) → FLIGHT_LEG (Flight_number, Leg_number)
  - Airplane_id → AIRPLANE.Airplane_id
  - Departure_airport_code → AIRPORT.Airport_code
  - Arrival_airport_code → AIRPORT.Airport_code
- **Relationships**:
  - N:1 → FLIGHT_LEG
  - N:1 → AIRPLANE
  - N:1 → AIRPORT (Departure)
  - N:1 → AIRPORT (Arrival)
  - 1:N → SEAT_RESERVATION

### 8. FARE (요금)
- **Primary Key**: (Flight_number, Fare_code)
- **Attributes**: Amount, Restrictions
- **Foreign Keys**:
  - Flight_number → FLIGHT.Flight_number
- **Relationships**:
  - N:1 → FLIGHT

### 9. CUSTOMER (고객)
- **Primary Key**: Customer_id (INT, AUTO_INCREMENT)
- **Attributes**: Name, Phone_number, Email, Passport_number
- **Relationships**:
  - 1:N → SEAT_RESERVATION

### 10. SEAT_RESERVATION (좌석 예약)
- **Primary Key**: (Flight_number, Leg_number, Date, Seat_number)
- **Attributes**: Reservation_date
- **Foreign Keys**:
  - (Flight_number, Leg_number, Date) → LEG_INSTANCE (Flight_number, Leg_number, Date)
  - Customer_id → CUSTOMER.Customer_id
- **Relationships**:
  - N:1 → LEG_INSTANCE
  - N:1 → CUSTOMER

## 관계 다이어그램 (텍스트 표현)

```
AIRPORT
  ├── 1:N → FLIGHT_LEG (Departure_airport_code)
  ├── 1:N → FLIGHT_LEG (Arrival_airport_code)
  ├── 1:N → LEG_INSTANCE (Departure_airport_code)
  ├── 1:N → LEG_INSTANCE (Arrival_airport_code)
  └── N:M → AIRPLANE_TYPE (through CAN_LAND)

AIRPLANE_TYPE
  ├── 1:N → AIRPLANE
  └── N:M → AIRPORT (through CAN_LAND)

AIRPLANE
  ├── N:1 → AIRPLANE_TYPE
  └── 1:N → LEG_INSTANCE

FLIGHT
  ├── 1:N → FLIGHT_LEG
  ├── 1:N → FARE
  └── 1:N → LEG_INSTANCE (through FLIGHT_LEG)

FLIGHT_LEG
  ├── N:1 → FLIGHT
  ├── N:1 → AIRPORT (Departure)
  ├── N:1 → AIRPORT (Arrival)
  └── 1:N → LEG_INSTANCE

LEG_INSTANCE
  ├── N:1 → FLIGHT_LEG
  ├── N:1 → AIRPLANE
  ├── N:1 → AIRPORT (Departure)
  ├── N:1 → AIRPORT (Arrival)
  └── 1:N → SEAT_RESERVATION

CUSTOMER
  └── 1:N → SEAT_RESERVATION

SEAT_RESERVATION
  ├── N:1 → LEG_INSTANCE
  └── N:1 → CUSTOMER

FARE
  └── N:1 → FLIGHT

CAN_LAND
  ├── N:1 → AIRPLANE_TYPE
  └── N:1 → AIRPORT
```

## MySQL Workbench에서 EER Diagram 생성 방법

1. MySQL Workbench 실행
2. `Database` > `Reverse Engineer` 메뉴 선택
3. 연결 정보 입력:
   - Host: localhost
   - Port: 3306
   - Username: dbuser
   - Password: c3409711!
   - Default Schema: AIRLINE
4. `Next` 클릭
5. `AIRLINE` 데이터베이스 선택
6. 모든 테이블 선택 (뷰는 제외)
7. `Execute` 클릭하여 EER Diagram 생성
8. 생성된 다이어그램에서 관계선 확인
9. `File` > `Export` > `Export as PNG` 또는 `Export as PDF`로 저장

## 참고사항

- 뷰(vw_available_flights, vw_customer_reservations, vw_flight_details)는 EER Diagram에 포함하지 않음
- 모든 외래키 관계가 자동으로 표시됨
- 복합키 관계도 정상적으로 표시됨

