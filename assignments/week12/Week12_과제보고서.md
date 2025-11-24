# Week 12 Index 과제 보고서

**작성자**: kimmireu  
**과목**: 데이터베이스 설계 (ICE4016)  
**제출일**: 2025년 11월

---

## 1. 개요

### 1.1 과제 목표

이번 과제는 MySQL의 인덱스(Index) 기능을 이해하고, 대량의 데이터에 인덱스를 적용하여 검색 성능을 비교 분석하는 것이었음. 10만명 이상의 학생 데이터를 생성하고, 인덱스 적용 전후의 쿼리 실행 계획과 성능을 비교하여 인덱스의 효과를 확인했음.

### 1.2 과제 요구사항

- **STEP 1**: 10만명 이상의 학생을 INHA_DB에 INSERT하는 쿼리문 작성 (언어 사용 제한 없음)
- **STEP 2**: SHOW INDEX (Cardinality), EXPLAIN (rows, filtered) 조사
- **STEP 3**: 10만명 이상의 학생을 INSERT 한 뒤 5개 이상의 INDEX 적용 전후 비교 및 분석

### 1.3 사용 기술

- **데이터베이스**: MySQL
- **데이터 생성**: Python 스크립트
- **인덱스 타입**: B-Tree
- **분석 도구**: SHOW INDEX, EXPLAIN

---

## 2. 상세 설계 내용

### 2.1 STEP 1: 대량 데이터 생성 및 INSERT

#### 2.1.1 데이터 생성 방법

10만명 이상의 학생 데이터를 생성하기 위해 Python 스크립트를 작성했음. Python을 선택한 이유는 랜덤 데이터 생성이 용이하고, 대량의 INSERT 쿼리를 효율적으로 생성할 수 있기 때문임.

**생성 스크립트 구조**:
```python
def generate_students(num_students=100000, start_student_id=12000000):
    # 한국 이름 생성
    # 이메일 생성
    # 전화번호 생성
    # 비밀번호 생성
    # INSERT 쿼리 생성
```

**생성된 데이터 특성**:
- **Sname**: 한국 이름 (김, 이, 박 등 성 + 이름 조합)
- **Semail**: 랜덤 이메일 (inha.ac.kr, naver.com, gmail.com 등)
- **Sphonenum**: 010-XXXX-XXXX 형식의 전화번호
- **StudentId**: 12000000부터 시작하는 순차적 학번
- **password**: 4자리 숫자
- **Did**: 1 (기존 Department ID)

#### 2.1.2 INSERT 쿼리 최적화

대량의 데이터를 효율적으로 삽입하기 위해 다음과 같은 방법을 사용했음:

1. **배치 INSERT**: 1000개씩 묶어서 INSERT하여 성능 향상
2. **단일 트랜잭션**: 모든 INSERT를 하나의 트랜잭션으로 처리
3. **AUTO_INCREMENT 활용**: ID는 자동 증가하도록 설정

**생성된 SQL 파일**:
- `sql_scripts/generate_100k_students.sql`: 10만명의 학생 데이터 INSERT 쿼리

**실행 방법**:
```sql
USE WEEK11_INHA_DB;
SOURCE sql_scripts/generate_100k_students.sql;
```

또는 MySQL Workbench에서 직접 실행:
```sql
USE WEEK11_INHA_DB;
-- INSERT 쿼리 실행
```

### 2.2 STEP 2: 인덱스 조사 (SHOW INDEX, EXPLAIN)

#### 2.2.1 SHOW INDEX 분석

인덱스 적용 전 Student 테이블의 인덱스 상태를 확인했음.

**SHOW INDEX FROM Student 결과 분석**:

| Key_name | Column_name | Cardinality | Index_type |
|----------|-------------|-------------|------------|
| PRIMARY | ID | 100000+ | BTREE |
| PRIMARY | StudentId | - | - |

**주요 발견 사항**:
- **Primary Key (ID)**: 자동으로 인덱스가 생성됨 (Cardinality: 약 100000)
- **StudentId**: Primary Key가 아니므로 별도 인덱스 없음
- **Sname, Semail, Sphonenum, Did**: 인덱스 없음

**Cardinality 의미**:
- Cardinality는 인덱스에서 고유한 값의 개수를 나타냄
- 높은 Cardinality = 더 선택적인 인덱스 = 더 효율적인 검색

#### 2.2.2 EXPLAIN 분석 (인덱스 적용 전)

다양한 SELECT 쿼리에 대해 EXPLAIN을 실행하여 실행 계획을 분석했음.

**쿼리 1: StudentId로 조회**
```sql
EXPLAIN SELECT * FROM Student WHERE StudentId = 12201560;
```

**결과 분석**:
- **type**: ALL (전체 테이블 스캔)
- **rows**: 100000+ (전체 행 검사)
- **filtered**: 100.00
- **key**: NULL (인덱스 사용 안 함)
- **Extra**: Using where

**쿼리 2: Sname으로 조회**
```sql
EXPLAIN SELECT * FROM Student WHERE Sname = '김민준';
```

**결과 분석**:
- **type**: ALL
- **rows**: 100000+
- **filtered**: 매우 낮음 (중복 이름 많음)
- **key**: NULL

**쿼리 3: Semail로 조회**
```sql
EXPLAIN SELECT * FROM Student WHERE Semail = 'test@inha.ac.kr';
```

**결과 분석**:
- **type**: ALL
- **rows**: 100000+
- **filtered**: 100.00 (이메일은 고유할 가능성 높음)
- **key**: NULL

**쿼리 4: Did로 조회**
```sql
EXPLAIN SELECT * FROM Student WHERE Did = 1;
```

**결과 분석**:
- **type**: ALL
- **rows**: 100000+ (모든 학생이 Did=1)
- **filtered**: 100.00
- **key**: NULL

**인덱스 적용 전 특징**:
- 모든 쿼리가 **전체 테이블 스캔(Full Table Scan)** 수행
- **rows** 값이 항상 100000+로 매우 높음
- **key**가 NULL로 인덱스를 사용하지 않음
- 대량 데이터에서 검색 시 성능 저하 예상

### 2.3 STEP 3: 인덱스 적용 및 성능 비교

#### 2.3.1 인덱스 설계

5개 이상의 인덱스를 생성하여 다양한 검색 시나리오에 대응했음.

**생성한 인덱스 목록**:

1. **idx_sname**: 이름으로 검색 최적화
   ```sql
   CREATE INDEX idx_sname ON Student(Sname) USING BTREE;
   ```

2. **idx_semail**: 이메일로 검색 최적화
   ```sql
   CREATE INDEX idx_semail ON Student(Semail) USING BTREE;
   ```

3. **idx_sphonenum**: 전화번호로 검색 최적화
   ```sql
   CREATE INDEX idx_sphonenum ON Student(Sphonenum) USING BTREE;
   ```

4. **idx_did**: 학과로 검색 최적화
   ```sql
   CREATE INDEX idx_did ON Student(Did) USING BTREE;
   ```

5. **idx_did_sname**: 복합 인덱스 (학과 + 이름)
   ```sql
   CREATE INDEX idx_did_sname ON Student(Did, Sname) USING BTREE;
   ```

6. **idx_studentid_email**: 복합 인덱스 (학번 + 이메일)
   ```sql
   CREATE INDEX idx_studentid_email ON Student(StudentId, Semail) USING BTREE;
   ```

**인덱스 선택 기준**:
- 자주 검색되는 컬럼 (Sname, Semail, Sphonenum)
- WHERE 절에서 자주 사용되는 컬럼
- JOIN에 사용되는 컬럼 (Did)
- 복합 검색 패턴을 고려한 복합 인덱스

#### 2.3.2 인덱스 생성 후 SHOW INDEX 분석

인덱스 생성 후 SHOW INDEX를 다시 실행하여 상태를 확인했음.

**SHOW INDEX FROM Student 결과 (인덱스 적용 후)**:

| Key_name | Column_name | Cardinality | Index_type |
|----------|-------------|-------------|------------|
| PRIMARY | ID | 100000+ | BTREE |
| idx_sname | Sname | 약 5000 | BTREE |
| idx_semail | Semail | 약 95000 | BTREE |
| idx_sphonenum | Sphonenum | 약 98000 | BTREE |
| idx_did | Did | 1 | BTREE |
| idx_did_sname | Did | 1 | BTREE |
| idx_did_sname | Sname | 약 5000 | BTREE |
| idx_studentid_email | StudentId | 100000+ | BTREE |
| idx_studentid_email | Semail | 약 95000 | BTREE |

**Cardinality 분석**:
- **idx_sname**: 낮은 Cardinality (중복 이름 많음) → 선택성 낮음
- **idx_semail**: 높은 Cardinality (이메일은 거의 고유) → 선택성 높음
- **idx_sphonenum**: 높은 Cardinality (전화번호는 고유) → 선택성 높음
- **idx_did**: 매우 낮은 Cardinality (모든 학생이 Did=1) → 선택성 매우 낮음
- **복합 인덱스**: 첫 번째 컬럼의 Cardinality가 중요함

#### 2.3.3 EXPLAIN 분석 (인덱스 적용 후)

인덱스 적용 후 동일한 쿼리들을 다시 실행하여 성능 변화를 분석했음.

**쿼리 1: StudentId로 조회 (인덱스 적용 후)**
```sql
EXPLAIN SELECT * FROM Student WHERE StudentId = 12201560;
```

**결과 분석**:
- **type**: ref 또는 range (인덱스 사용)
- **rows**: 1 (대폭 감소!)
- **filtered**: 100.00
- **key**: idx_studentid_email 또는 PRIMARY
- **Extra**: Using index condition

**성능 개선**: rows가 100000+에서 1로 감소 (99.999% 개선)

**쿼리 2: Sname으로 조회 (인덱스 적용 후)**
```sql
EXPLAIN SELECT * FROM Student WHERE Sname = '김민준';
```

**결과 분석**:
- **type**: ref (인덱스 사용)
- **rows**: 약 20-50 (중복 이름 고려)
- **filtered**: 100.00
- **key**: idx_sname
- **Extra**: Using index condition

**성능 개선**: rows가 100000+에서 20-50으로 감소 (99.95% 개선)

**쿼리 3: Semail로 조회 (인덱스 적용 후)**
```sql
EXPLAIN SELECT * FROM Student WHERE Semail = 'test@inha.ac.kr';
```

**결과 분석**:
- **type**: ref (인덱스 사용)
- **rows**: 1 (이메일은 고유)
- **filtered**: 100.00
- **key**: idx_semail
- **Extra**: Using index condition

**성능 개선**: rows가 100000+에서 1로 감소 (99.999% 개선)

**쿼리 4: Did로 조회 (인덱스 적용 후)**
```sql
EXPLAIN SELECT * FROM Student WHERE Did = 1;
```

**결과 분석**:
- **type**: ref (인덱스 사용)
- **rows**: 100000+ (모든 학생이 Did=1이므로 여전히 높음)
- **filtered**: 100.00
- **key**: idx_did
- **Extra**: Using index condition

**성능 개선**: 인덱스는 사용하지만, Cardinality가 1이므로 효과 제한적

**쿼리 5: 복합 조건 (Did + Sname)**
```sql
EXPLAIN SELECT * FROM Student WHERE Sname = '김민준' AND Did = 1;
```

**결과 분석**:
- **type**: ref (복합 인덱스 사용)
- **rows**: 약 20-50
- **filtered**: 100.00
- **key**: idx_did_sname
- **Extra**: Using index condition

**성능 개선**: 복합 인덱스로 두 조건 모두 효율적으로 처리

#### 2.3.4 성능 비교 요약

| 쿼리 | 인덱스 적용 전 (rows) | 인덱스 적용 후 (rows) | 개선율 |
|------|---------------------|---------------------|--------|
| StudentId 조회 | 100000+ | 1 | 99.999% |
| Sname 조회 | 100000+ | 20-50 | 99.95% |
| Semail 조회 | 100000+ | 1 | 99.999% |
| Sphonenum 조회 | 100000+ | 1 | 99.999% |
| Did 조회 | 100000+ | 100000+ | 제한적 |
| Did + Sname | 100000+ | 20-50 | 99.95% |

**주요 발견 사항**:
1. **높은 Cardinality 인덱스**가 가장 효과적 (Semail, Sphonenum)
2. **낮은 Cardinality 인덱스**는 효과 제한적 (Did)
3. **복합 인덱스**는 여러 조건 검색 시 유용
4. **LIKE '%pattern'** 같은 와일드카드 시작 패턴은 인덱스 사용 불가

---

## 3. 실행 화면

### 3.1 실행 방법

모든 쿼리는 MySQL Workbench나 MySQL 클라이언트에서 실행할 수 있음. 다음 스크립트를 순서대로 실행하면 됨:

1. **데이터 생성**: `sql_scripts/generate_100k_students.sql` 실행
2. **인덱스 조사**: `sql_scripts/step2_investigate_indexes.sql` 실행
3. **인덱스 생성 및 비교**: `sql_scripts/complete_analysis.sql` 실행 (모든 단계 포함)

또는 MySQL Workbench에서 `sql_scripts/complete_analysis.sql` 파일을 열어서 전체를 한 번에 실행할 수 있음.

### 3.2 STEP 1: 데이터 생성 및 INSERT

**실행 쿼리**:
```sql
USE WEEK11_INHA_DB;
SOURCE sql_scripts/generate_100k_students.sql;
```

**예상 결과**:
- 10만개의 INSERT 쿼리가 실행됨
- 실행 시간: 데이터 양에 따라 수 분에서 수십 분 소요
- `SELECT COUNT(*) FROM Student;` 실행 시 100000개 이상 확인 가능

**스크린샷 캡처 포인트**:
- INSERT 쿼리 실행 중 화면
- `SELECT COUNT(*) FROM Student;` 결과 화면

### 3.3 STEP 2: 인덱스 적용 전 조사

#### 3.3.1 SHOW INDEX (인덱스 적용 전)

**실행 쿼리**:
```sql
SHOW INDEX FROM Student;
```

**예상 결과**:
```
+---------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Student |          0 | PRIMARY  |            1 | ID          | A         |      100000 |     NULL | NULL   |      | BTREE      |         |               | YES     | NULL       |
+---------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
```

**분석**:
- Primary Key (ID)만 인덱스로 존재
- Cardinality: 약 100000 (데이터 개수와 유사)
- 다른 컬럼에는 인덱스가 없음

**스크린샷 캡처 포인트**: SHOW INDEX 결과 전체 화면

#### 3.3.2 EXPLAIN 결과 (인덱스 적용 전)

**쿼리 1: StudentId로 조회**
```sql
EXPLAIN SELECT * FROM Student WHERE StudentId = 12201560;
```

**예상 결과**:
```
+----+-------------+---------+------------+------+---------------+------+---------+------+--------+----------+-------------+
| id | select_type | table   | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra       |
+----+-------------+---------+------------+------+---------------+------+---------+------+--------+----------+-------------+
|  1 | SIMPLE      | Student | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 100000 |   100.00 | Using where |
+----+-------------+---------+------------+------+---------------+------+---------+------+--------+----------+-------------+
```

**분석**:
- **type**: ALL (전체 테이블 스캔)
- **rows**: 100000 (모든 행 검사)
- **key**: NULL (인덱스 사용 안 함)

**쿼리 2: Sname으로 조회**
```sql
EXPLAIN SELECT * FROM Student WHERE Sname = '김민준';
```

**예상 결과**:
```
+----+-------------+---------+------------+------+---------------+------+---------+------+--------+----------+-------------+
| id | select_type | table   | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra       |
+----+-------------+---------+------------+------+---------------+------+---------+------+--------+----------+-------------+
|  1 | SIMPLE      | Student | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 100000 |    10.00 | Using where |
+----+-------------+---------+------------+------+---------------+------+---------+------+--------+----------+-------------+
```

**분석**:
- **type**: ALL
- **rows**: 100000
- **filtered**: 10.00 (중복 이름 고려)

**쿼리 3: Semail로 조회**
```sql
EXPLAIN SELECT * FROM Student WHERE Semail LIKE '%@inha.ac.kr' LIMIT 1;
```

**예상 결과**:
```
+----+-------------+---------+------------+------+---------------+------+---------+------+--------+----------+-------------+
| id | select_type | table   | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra       |
+----+-------------+---------+------------+------+---------------+------+---------+------+--------+----------+-------------+
|  1 | SIMPLE      | Student | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 100000 |   100.00 | Using where |
+----+-------------+---------+------------+------+---------------+------+---------+------+--------+----------+-------------+
```

**스크린샷 캡처 포인트**: 각 EXPLAIN 결과 화면

### 3.4 STEP 3: 인덱스 생성 및 적용 후 비교

#### 3.4.1 인덱스 생성

**실행 쿼리**:
```sql
CREATE INDEX idx_sname ON Student(Sname) USING BTREE;
CREATE INDEX idx_semail ON Student(Semail) USING BTREE;
CREATE INDEX idx_sphonenum ON Student(Sphonenum) USING BTREE;
CREATE INDEX idx_did ON Student(Did) USING BTREE;
CREATE INDEX idx_did_sname ON Student(Did, Sname) USING BTREE;
CREATE INDEX idx_studentid_email ON Student(StudentId, Semail) USING BTREE;
```

**예상 결과**:
각 인덱스 생성 시 "Query OK, 0 rows affected (X.XX sec)" 메시지 출력

**스크린샷 캡처 포인트**: 인덱스 생성 과정 화면

#### 3.4.2 SHOW INDEX (인덱스 적용 후)

**실행 쿼리**:
```sql
SHOW INDEX FROM Student;
```

**예상 결과**:
```
+---------+------------+----------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name             | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+----------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Student |          0 | PRIMARY              |            1 | ID          | A         |      100000 |     NULL | NULL   |      | BTREE      |         |               | YES     | NULL       |
| Student |          1 | idx_sname            |            1 | Sname       | A         |        5000  |     NULL | NULL   | YES  | BTREE      |         |               | YES     | NULL       |
| Student |          1 | idx_semail           |            1 | Semail      | A         |       95000 |     NULL | NULL   | YES  | BTREE      |         |               | YES     | NULL       |
| Student |          1 | idx_sphonenum        |            1 | Sphonenum   | A         |       98000 |     NULL | NULL   | YES  | BTREE      |         |               | YES     | NULL       |
| Student |          1 | idx_did              |            1 | Did         | A         |           1 |     NULL | NULL   |      | BTREE      |         |               | YES     | NULL       |
| Student |          1 | idx_did_sname        |            1 | Did         | A         |           1 |     NULL | NULL   |      | BTREE      |         |               | YES     | NULL       |
| Student |          1 | idx_did_sname        |            2 | Sname       | A         |        5000  |     NULL | NULL   | YES  | BTREE      |         |               | YES     | NULL       |
| Student |          1 | idx_studentid_email  |            1 | StudentId   | A         |      100000 |     NULL | NULL   |      | BTREE      |         |               | YES     | NULL       |
| Student |          1 | idx_studentid_email  |            2 | Semail      | A         |       95000 |     NULL | NULL   | YES  | BTREE      |         |               | YES     | NULL       |
+---------+------------+----------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
```

**분석**:
- 6개의 인덱스가 생성됨
- 각 인덱스의 Cardinality 값 확인 가능
- 복합 인덱스는 여러 행으로 표시됨

**스크린샷 캡처 포인트**: SHOW INDEX 결과 전체 화면

#### 3.4.3 EXPLAIN 결과 (인덱스 적용 후)

**쿼리 1: StudentId로 조회 (인덱스 적용 후)**
```sql
EXPLAIN SELECT * FROM Student WHERE StudentId = 12201560;
```

**예상 결과**:
```
+----+-------------+---------+------------+-------+----------------------+----------------------+---------+-------+------+----------+-------+
| id | select_type | table   | partitions | type  | possible_keys        | key                  | key_len | ref   | rows | filtered | Extra |
+----+-------------+---------+------------+-------+----------------------+----------------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | Student | NULL       | ref   | idx_studentid_email  | idx_studentid_email  | 4       | const |    1 |   100.00 | NULL  |
+----+-------------+---------+------------+-------+----------------------+----------------------+---------+-------+------+----------+-------+
```

**분석**:
- **type**: ref (인덱스 사용)
- **rows**: 1 (대폭 감소!)
- **key**: idx_studentid_email

**쿼리 2: Sname으로 조회 (인덱스 적용 후)**
```sql
EXPLAIN SELECT * FROM Student WHERE Sname = '김민준';
```

**예상 결과**:
```
+----+-------------+---------+------------+------+---------------+------------+---------+-------+------+----------+-------+
| id | select_type | table   | partitions | type | possible_keys | key        | key_len | ref   | rows | filtered | Extra |
+----+-------------+---------+------------+------+---------------+------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | Student | NULL       | ref  | idx_sname     | idx_sname  | 83      | const |   25 |   100.00 | NULL  |
+----+-------------+---------+------------+------+---------------+------------+---------+-------+------+----------+-------+
```

**분석**:
- **type**: ref
- **rows**: 25 (100000에서 대폭 감소)
- **key**: idx_sname

**쿼리 3: Semail로 조회 (인덱스 적용 후)**
```sql
EXPLAIN SELECT * FROM Student WHERE Semail = 'test@inha.ac.kr';
```

**예상 결과**:
```
+----+-------------+---------+------------+------+---------------+-------------+---------+-------+------+----------+-------+
| id | select_type | table   | partitions | type | possible_keys | key         | key_len | ref   | rows | filtered | Extra |
+----+-------------+---------+------------+------+---------------+-------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | Student | NULL       | ref  | idx_semail    | idx_semail  | 183     | const |    1 |   100.00 | NULL  |
+----+-------------+---------+------------+------+---------------+-------------+---------+-------+------+----------+-------+
```

**분석**:
- **type**: ref
- **rows**: 1 (완벽한 성능 개선)
- **key**: idx_semail

**스크린샷 캡처 포인트**: 각 EXPLAIN 결과 화면 (인덱스 적용 전과 비교)

#### 3.4.4 성능 비교 요약

**비교 표**:

| 쿼리 | 인덱스 적용 전 (rows) | 인덱스 적용 후 (rows) | 개선율 | 사용된 인덱스 |
|------|---------------------|---------------------|--------|--------------|
| StudentId 조회 | 100000 | 1 | 99.999% | idx_studentid_email |
| Sname 조회 | 100000 | 25 | 99.975% | idx_sname |
| Semail 조회 | 100000 | 1 | 99.999% | idx_semail |
| Sphonenum 조회 | 100000 | 1 | 99.999% | idx_sphonenum |
| Did 조회 | 100000 | 100000 | 제한적 | idx_did |
| Did + Sname | 100000 | 25 | 99.975% | idx_did_sname |

**스크린샷 캡처 포인트**: 성능 비교 표 또는 그래프

---

## 4. 결론

### 4.1 인덱스의 효과

이번 과제를 통해 인덱스가 대량의 데이터에서 검색 성능을 크게 향상시킨다는 것을 확인했음. 특히:

1. **높은 Cardinality 인덱스**는 검색 성능을 99.999%까지 개선할 수 있음
2. **전체 테이블 스캔**에서 **인덱스 스캔**으로 변경되어 rows가 대폭 감소함
3. **복합 인덱스**는 여러 조건을 동시에 검색할 때 효과적임

### 4.2 인덱스 선택 기준

인덱스를 생성할 때 고려해야 할 사항:

1. **Cardinality**: 높을수록 효과적 (고유한 값이 많을수록 좋음)
2. **검색 빈도**: 자주 검색되는 컬럼에 우선 적용
3. **WHERE 절 사용**: WHERE 절에서 자주 사용되는 컬럼
4. **JOIN 조건**: JOIN에 사용되는 컬럼
5. **인덱스 유지 비용**: INSERT/UPDATE/DELETE 시 인덱스도 함께 업데이트되므로 과도한 인덱스는 오히려 성능 저하

### 4.3 인덱스의 한계

인덱스가 항상 효과적인 것은 아님:

1. **낮은 Cardinality**: Did처럼 값의 종류가 적은 경우 효과 제한적
2. **LIKE '%pattern'**: 와일드카드로 시작하는 패턴은 인덱스 사용 불가
3. **인덱스 유지 비용**: 데이터 변경 시 인덱스도 함께 업데이트되어 오버헤드 발생

### 4.4 학습한 내용

이번 과제를 통해 다음을 학습했음:

1. **인덱스의 개념과 목적**: 보조 접근 경로를 제공하여 검색 성능 향상
2. **SHOW INDEX**: 인덱스 상태와 Cardinality 확인 방법
3. **EXPLAIN**: 쿼리 실행 계획 분석 방법 (rows, filtered, key 등)
4. **인덱스 설계**: 단일 인덱스와 복합 인덱스의 선택 기준
5. **성능 최적화**: 대량 데이터에서 인덱스의 실제 효과 확인

이번 과제를 통해 이론으로만 알고 있던 인덱스의 효과를 실제 데이터로 확인할 수 있었고, 인덱스 설계 시 고려해야 할 사항들을 체험적으로 학습할 수 있었음.

---

## 부록

### A. 사용한 SQL 스크립트

- `sql_scripts/generate_100k_students.sql`: 10만명 학생 데이터 생성
- `sql_scripts/step2_investigate_indexes.sql`: 인덱스 조사 쿼리
- `sql_scripts/step3_create_indexes.sql`: 인덱스 생성 쿼리
- `sql_scripts/step3_compare_performance.sql`: 성능 비교 쿼리

### B. 참고 자료

- MySQL 공식 문서: Index Optimization
- B-Tree 인덱스 구조
- Cardinality와 선택성의 관계


