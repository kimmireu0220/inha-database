-- ============================================
-- STEP 3: 인덱스 생성 및 성능 비교
-- ============================================

USE WEEK11_INHA_DB;

-- ============================================
-- 인덱스 생성 (5개 이상)
-- ============================================

-- 인덱스 1: StudentId (이미 Primary Key이지만, 명시적으로 확인)
-- Primary Key는 자동으로 인덱스가 생성되므로 별도 생성 불필요

-- 인덱스 2: Sname (이름으로 검색)
CREATE INDEX idx_sname ON Student(Sname) USING BTREE;

-- 인덱스 3: Semail (이메일로 검색)
CREATE INDEX idx_semail ON Student(Semail) USING BTREE;

-- 인덱스 4: Sphonenum (전화번호로 검색)
CREATE INDEX idx_sphonenum ON Student(Sphonenum) USING BTREE;

-- 인덱스 5: Did (학과로 검색)
CREATE INDEX idx_did ON Student(Did) USING BTREE;

-- 인덱스 6: 복합 인덱스 (Did, Sname) - 학과별 이름 검색 최적화
CREATE INDEX idx_did_sname ON Student(Did, Sname) USING BTREE;

-- 인덱스 7: 복합 인덱스 (StudentId, Semail) - 학번과 이메일 조합 검색
CREATE INDEX idx_studentid_email ON Student(StudentId, Semail) USING BTREE;

-- ============================================
-- 인덱스 생성 후 SHOW INDEX 확인
-- ============================================
SHOW INDEX FROM Student;



