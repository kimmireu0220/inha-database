USE InhaDB;

-- Building 테이블 생성
CREATE TABLE IF NOT EXISTS building (
    Id INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL
);

-- Department 테이블 생성
CREATE TABLE IF NOT EXISTS department (
    Id INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100),
    Phone_number VARCHAR(20)
);

-- Room 테이블 생성
CREATE TABLE IF NOT EXISTS room (
    Id INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Capacity INT,
    building_Id INT,
    Department_Id INT,
    FOREIGN KEY (building_Id) REFERENCES building(Id),
    FOREIGN KEY (Department_Id) REFERENCES department(Id)
);

-- Student 테이블 생성
CREATE TABLE IF NOT EXISTS Student (
    Id INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100),
    PhoneNumber VARCHAR(20),
    Major VARCHAR(100)
);

-- Class 테이블 생성
CREATE TABLE IF NOT EXISTS Class (
    Id INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Professor VARCHAR(100),
    Number_of_participants INT,
    Department_Id INT,
    Room_Id INT,
    FOREIGN KEY (Department_Id) REFERENCES department(Id),
    FOREIGN KEY (Room_Id) REFERENCES room(Id)
);

-- 샘플 데이터 삽입
INSERT INTO building (Id, Name) VALUES 
(1, '공과대학'),
(2, '자연과학대학'),
(3, '경영대학');

INSERT INTO department (Id, Name, Email, Phone_number) VALUES 
(1, '컴퓨터공학과', 'cs@inha.ac.kr', '032-860-1234'),
(2, '전자공학과', 'ee@inha.ac.kr', '032-860-1235'),
(3, '경영학과', 'biz@inha.ac.kr', '032-860-1236');

INSERT INTO room (Id, Name, Capacity, building_Id, Department_Id) VALUES 
(1, '공학관 101호', 50, 1, 1),
(2, '공학관 102호', 40, 1, 1),
(3, '자연과학관 201호', 60, 2, 2),
(4, '경영관 301호', 45, 3, 3);

INSERT INTO Student (Id, Name, Email, PhoneNumber, Major) VALUES 
(1, '김철수', 'kimcs@inha.ac.kr', '010-1234-5678', '컴퓨터공학'),
(2, '이영희', 'leeyh@inha.ac.kr', '010-2345-6789', '전자공학'),
(3, '박민수', 'parkms@inha.ac.kr', '010-3456-7890', '경영학');

INSERT INTO Class (Id, Name, Professor, Number_of_participants, Department_Id, Room_Id) VALUES 
(1, '데이터베이스설계', '최원익', 30, 1, 1),
(2, '자료구조', '김교수', 25, 1, 2),
(3, '회로이론', '박교수', 35, 2, 3),
(4, '경영학원론', '이교수', 40, 3, 4);
