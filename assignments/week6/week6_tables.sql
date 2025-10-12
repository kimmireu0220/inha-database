-- 6주차 과제: MySQL Express 연동을 위한 테이블 생성 및 데이터 입력

-- 1. Class 테이블 생성
CREATE TABLE IF NOT EXISTS `Class` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(100) NOT NULL,
    `Professor` VARCHAR(100) NOT NULL,
    `Number_of_participants` INT NOT NULL,
    `Department_Id` INT NOT NULL,
    `Room_Id` INT NOT NULL,
    PRIMARY KEY (`Id`),
    INDEX `fk_Class_Department_idx` (`Department_Id` ASC),
    INDEX `fk_Class_Room_idx` (`Room_Id` ASC),
    CONSTRAINT `fk_Class_Department`
        FOREIGN KEY (`Department_Id`)
        REFERENCES `Department` (`Id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    CONSTRAINT `fk_Class_Room`
        FOREIGN KEY (`Room_Id`)
        REFERENCES `Room` (`Id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- 2. Club 테이블 생성
CREATE TABLE IF NOT EXISTS `Club` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(100) NOT NULL,
    `Building_Id` INT NOT NULL,
    PRIMARY KEY (`Id`),
    INDEX `fk_Club_Building_idx` (`Building_Id` ASC),
    CONSTRAINT `fk_Club_Building`
        FOREIGN KEY (`Building_Id`)
        REFERENCES `Building` (`Id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- 3. Employee 테이블 생성
CREATE TABLE IF NOT EXISTS `Employee` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(100) NOT NULL,
    `Position` VARCHAR(100) NOT NULL,
    `Department_Id` INT NOT NULL,
    PRIMARY KEY (`Id`),
    INDEX `fk_Employee_Department_idx` (`Department_Id` ASC),
    CONSTRAINT `fk_Employee_Department`
        FOREIGN KEY (`Department_Id`)
        REFERENCES `Department` (`Id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- 4. Class 테이블 데이터 입력 (5개 이상)
INSERT INTO `Class` (`Name`, `Professor`, `Number_of_participants`, `Department_Id`, `Room_Id`) VALUES
('데이터베이스설계', '최원익', 40, 1, 1),
('자료구조', '김교수', 35, 1, 2),
('컴퓨터구조', '이교수', 30, 1, 1),
('기계설계', '박교수', 25, 2, 3),
('열역학', '최교수', 20, 2, 3),
('회로이론', '정교수', 45, 3, 4),
('마케팅원론', '한교수', 50, 4, 5),
('물리학개론', '송교수', 40, 5, 4);

-- 5. Club 테이블 데이터 입력 (5개 이상)
INSERT INTO `Club` (`Name`, `Building_Id`) VALUES
('컴퓨터공학과 동아리', 1),
('기계공학과 동아리', 1),
('전자공학과 동아리', 2),
('경영학과 동아리', 3),
('물리학과 동아리', 2),
('축구부', 4),
('농구부', 4),
('음악동아리', 5);

-- 6. Employee 테이블 데이터 입력 (5개 이상)
INSERT INTO `Employee` (`Name`, `Position`, `Department_Id`) VALUES
('김직원', '행정직', 1),
('이직원', '연구직', 1),
('박직원', '행정직', 2),
('최직원', '연구직', 2),
('정직원', '행정직', 3),
('한직원', '연구직', 3),
('송직원', '행정직', 4),
('강직원', '연구직', 5);
