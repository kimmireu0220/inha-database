-- ============================================
-- STEP 3: 인덱스 적용 후 성능 비교
-- ============================================

USE WEEK11_INHA_DB;

-- ============================================
-- 인덱스 적용 후 EXPLAIN 실행
-- ============================================

-- 쿼리 1: StudentId로 조회 (Primary Key 인덱스 사용)
EXPLAIN SELECT * FROM Student WHERE StudentId = 12201560;

-- 쿼리 2: Sname으로 조회 (idx_sname 인덱스 사용)
EXPLAIN SELECT * FROM Student WHERE Sname = '김민준';

-- 쿼리 3: Semail로 조회 (idx_semail 인덱스 사용)
EXPLAIN SELECT * FROM Student WHERE Semail = 'test@inha.ac.kr';

-- 쿼리 4: Sphonenum으로 조회 (idx_sphonenum 인덱스 사용)
EXPLAIN SELECT * FROM Student WHERE Sphonenum = '01012345678';

-- 쿼리 5: Did로 조회 (idx_did 인덱스 사용)
EXPLAIN SELECT * FROM Student WHERE Did = 1;

-- 쿼리 6: Semail LIKE 패턴 검색 (인덱스 사용 불가 - 와일드카드 시작)
EXPLAIN SELECT * FROM Student WHERE Semail LIKE '%@inha.ac.kr';

-- 쿼리 7: 복합 조건 (idx_did_sname 인덱스 사용)
EXPLAIN SELECT * FROM Student WHERE Sname = '김민준' AND Did = 1;

-- 쿼리 8: 범위 검색 (StudentId - Primary Key 인덱스 사용)
EXPLAIN SELECT * FROM Student WHERE StudentId BETWEEN 12000000 AND 12001000;

-- ============================================
-- 실행 시간 측정 (선택사항)
-- ============================================
-- SET profiling = 1;
-- SELECT * FROM Student WHERE Sname = '김민준';
-- SHOW PROFILES;



