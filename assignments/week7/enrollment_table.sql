USE InhaDB;

-- Enrollment 테이블 생성 (Student와 Class 간의 관계)
CREATE TABLE IF NOT EXISTS Enrollment (
    Student_Id INT,
    Class_Id INT,
    PRIMARY KEY (Student_Id, Class_Id),
    FOREIGN KEY (Student_Id) REFERENCES Student(Id) ON DELETE CASCADE,
    FOREIGN KEY (Class_Id) REFERENCES Class(Id) ON DELETE CASCADE
);

-- 샘플 데이터 삽입 (테스트용)
-- 학생 1번이 수업 1번, 2번 수강
INSERT INTO Enrollment (Student_Id, Class_Id) VALUES 
(1, 1),
(1, 2),
(2, 1),
(2, 3),
(3, 2),
(3, 3);

