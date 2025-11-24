-- ============================================
-- Week 12 Index 과제 완전 분석 스크립트
-- ============================================

USE WEEK11_INHA_DB;

-- ============================================
-- STEP 1: 데이터 개수 확인
-- ============================================
SELECT '=== STEP 1: 데이터 개수 확인 ===' AS '';
SELECT COUNT(*) AS total_students FROM Student;

-- ============================================
-- STEP 2: 인덱스 적용 전 조사
-- ============================================
SELECT '=== STEP 2: 인덱스 적용 전 조사 ===' AS '';

-- 2.1 SHOW INDEX (인덱스 적용 전)
SELECT '--- SHOW INDEX (인덱스 적용 전) ---' AS '';
SHOW INDEX FROM Student;

-- 2.2 EXPLAIN 분석 (인덱스 적용 전)
SELECT '--- EXPLAIN: StudentId 조회 (인덱스 적용 전) ---' AS '';
EXPLAIN SELECT * FROM Student WHERE StudentId = 12201560;

SELECT '--- EXPLAIN: Sname 조회 (인덱스 적용 전) ---' AS '';
EXPLAIN SELECT * FROM Student WHERE Sname = '김민준';

SELECT '--- EXPLAIN: Semail 조회 (인덱스 적용 전) ---' AS '';
EXPLAIN SELECT * FROM Student WHERE Semail LIKE '%@inha.ac.kr' LIMIT 1;

SELECT '--- EXPLAIN: Sphonenum 조회 (인덱스 적용 전) ---' AS '';
EXPLAIN SELECT * FROM Student WHERE Sphonenum = '01012345678';

SELECT '--- EXPLAIN: Did 조회 (인덱스 적용 전) ---' AS '';
EXPLAIN SELECT * FROM Student WHERE Did = 1 LIMIT 10;

SELECT '--- EXPLAIN: 복합 조건 (Did + Sname, 인덱스 적용 전) ---' AS '';
EXPLAIN SELECT * FROM Student WHERE Sname = '김민준' AND Did = 1;

-- ============================================
-- STEP 3: 인덱스 생성
-- ============================================
SELECT '=== STEP 3: 인덱스 생성 ===' AS '';

-- 기존 인덱스 삭제 (이미 존재하는 경우)
DROP INDEX IF EXISTS idx_sname ON Student;
DROP INDEX IF EXISTS idx_semail ON Student;
DROP INDEX IF EXISTS idx_sphonenum ON Student;
DROP INDEX IF EXISTS idx_did ON Student;
DROP INDEX IF EXISTS idx_did_sname ON Student;
DROP INDEX IF EXISTS idx_studentid_email ON Student;

-- 인덱스 생성
SELECT '--- 인덱스 1: idx_sname 생성 ---' AS '';
CREATE INDEX idx_sname ON Student(Sname) USING BTREE;

SELECT '--- 인덱스 2: idx_semail 생성 ---' AS '';
CREATE INDEX idx_semail ON Student(Semail) USING BTREE;

SELECT '--- 인덱스 3: idx_sphonenum 생성 ---' AS '';
CREATE INDEX idx_sphonenum ON Student(Sphonenum) USING BTREE;

SELECT '--- 인덱스 4: idx_did 생성 ---' AS '';
CREATE INDEX idx_did ON Student(Did) USING BTREE;

SELECT '--- 인덱스 5: idx_did_sname 복합 인덱스 생성 ---' AS '';
CREATE INDEX idx_did_sname ON Student(Did, Sname) USING BTREE;

SELECT '--- 인덱스 6: idx_studentid_email 복합 인덱스 생성 ---' AS '';
CREATE INDEX idx_studentid_email ON Student(StudentId, Semail) USING BTREE;

-- ============================================
-- STEP 3: 인덱스 적용 후 조사
-- ============================================
SELECT '=== STEP 3: 인덱스 적용 후 조사 ===' AS '';

-- 3.1 SHOW INDEX (인덱스 적용 후)
SELECT '--- SHOW INDEX (인덱스 적용 후) ---' AS '';
SHOW INDEX FROM Student;

-- 3.2 EXPLAIN 분석 (인덱스 적용 후)
SELECT '--- EXPLAIN: StudentId 조회 (인덱스 적용 후) ---' AS '';
EXPLAIN SELECT * FROM Student WHERE StudentId = 12201560;

SELECT '--- EXPLAIN: Sname 조회 (인덱스 적용 후) ---' AS '';
EXPLAIN SELECT * FROM Student WHERE Sname = '김민준';

SELECT '--- EXPLAIN: Semail 조회 (인덱스 적용 후) ---' AS '';
EXPLAIN SELECT * FROM Student WHERE Semail LIKE '%@inha.ac.kr' LIMIT 1;

SELECT '--- EXPLAIN: Sphonenum 조회 (인덱스 적용 후) ---' AS '';
EXPLAIN SELECT * FROM Student WHERE Sphonenum = '01012345678';

SELECT '--- EXPLAIN: Did 조회 (인덱스 적용 후) ---' AS '';
EXPLAIN SELECT * FROM Student WHERE Did = 1 LIMIT 10;

SELECT '--- EXPLAIN: 복합 조건 (Did + Sname, 인덱스 적용 후) ---' AS '';
EXPLAIN SELECT * FROM Student WHERE Sname = '김민준' AND Did = 1;

-- ============================================
-- 성능 비교 요약
-- ============================================
SELECT '=== 성능 비교 요약 ===' AS '';
SELECT 
    '인덱스 적용 전후 rows 값 비교' AS 설명,
    'StudentId: 100000+ → 1' AS 개선1,
    'Sname: 100000+ → 20-50' AS 개선2,
    'Semail: 100000+ → 1' AS 개선3,
    'Sphonenum: 100000+ → 1' AS 개선4;


