-- ============================================
-- STEP 2: SHOW INDEX 및 EXPLAIN 조사
-- ============================================

USE WEEK11_INHA_DB;

-- ============================================
-- 1. SHOW INDEX - 현재 인덱스 상태 확인
-- ============================================
SHOW INDEX FROM Student;

-- ============================================
-- 2. EXPLAIN - 인덱스 적용 전 쿼리 실행 계획 분석
-- ============================================

-- 쿼리 1: StudentId로 조회 (Primary Key 사용 예상)
EXPLAIN SELECT * FROM Student WHERE StudentId = 12201560;

-- 쿼리 2: Sname으로 조회 (인덱스 없음)
EXPLAIN SELECT * FROM Student WHERE Sname = '김민준';

-- 쿼리 3: Semail로 조회 (인덱스 없음)
EXPLAIN SELECT * FROM Student WHERE Semail = 'test@inha.ac.kr';

-- 쿼리 4: Sphonenum으로 조회 (인덱스 없음)
EXPLAIN SELECT * FROM Student WHERE Sphonenum = '01012345678';

-- 쿼리 5: Did로 조회 (Foreign Key, 인덱스 없을 수 있음)
EXPLAIN SELECT * FROM Student WHERE Did = 1;

-- 쿼리 6: Semail LIKE 패턴 검색 (인덱스 없음)
EXPLAIN SELECT * FROM Student WHERE Semail LIKE '%@inha.ac.kr';

-- 쿼리 7: 복합 조건 (Sname과 Did)
EXPLAIN SELECT * FROM Student WHERE Sname = '김민준' AND Did = 1;

-- 쿼리 8: 범위 검색 (StudentId)
EXPLAIN SELECT * FROM Student WHERE StudentId BETWEEN 12000000 AND 12001000;

-- ============================================
-- 3. 데이터 개수 확인
-- ============================================
SELECT COUNT(*) AS total_students FROM Student;


