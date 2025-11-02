# Week 9 SQL 실습 과제 - 실행 계획

## 🎯 목표
COMPANY 데이터베이스를 활용하여 총 17개의 SQL 쿼리를 작성하고 실행하여 결과를 확인

## 📋 단계별 실행 계획

### Phase 1: 환경 설정 (최우선)

#### 1-1. 데이터베이스 생성
```sql
CREATE DATABASE Week9_company CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Week9_company;
```

**실행 방법:**
```bash
mysql -u root -p'c3409711!' -e "CREATE DATABASE IF NOT EXISTS Week9_company CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

#### 1-2. 스키마 파일 실행
```bash
cd assignments/week9
mysql -u root -p'c3409711!' Week9_company < COMPANY_Database_Schema.sql
```

#### 1-3. 데이터 확인
```sql
-- 각 테이블의 데이터 개수 확인
SELECT 'EMPLOYEE' as Table_Name, COUNT(*) as Count FROM EMPLOYEE
UNION ALL
SELECT 'DEPARTMENT', COUNT(*) FROM DEPARTMENT
UNION ALL
SELECT 'PROJECT', COUNT(*) FROM PROJECT
UNION ALL
SELECT 'WORKS_ON', COUNT(*) FROM WORKS_ON
UNION ALL
SELECT 'DEPENDENT', COUNT(*) FROM DEPENDENT;
```

**예상 결과:**
- EMPLOYEE: 8명
- DEPARTMENT: 3개
- PROJECT: 6개
- WORKS_ON: 16개
- DEPENDENT: 7개

---

### Phase 2: 기본 SQL 쿼리 작성 (1-10번)

#### 쿼리 1: 모든 사원의 이름, 주소, 급여 출력
```sql
SELECT Fname, Lname, Address, Salary 
FROM EMPLOYEE;
```
- **스크린샷**: `screenshots/01_all_employees.png`

#### 쿼리 2: 회사의 총 사원수 출력
```sql
SELECT COUNT(*) AS total_employees 
FROM EMPLOYEE;
```
- **스크린샷**: `screenshots/02_total_employees.png`

#### 쿼리 3: 3만 이상의 급여를 받는 사원들의 이름과 급여 출력
```sql
SELECT Fname, Lname, Salary 
FROM EMPLOYEE 
WHERE Salary >= 30000;
```
- **스크린샷**: `screenshots/03_high_salary_employees.png`

#### 쿼리 4: 3만 이상, 5만 이하의 급여를 받는 사람들의 이름과 급여 출력
```sql
SELECT Fname, Lname, Salary 
FROM EMPLOYEE 
WHERE Salary BETWEEN 30000 AND 50000;
```
- **스크린샷**: `screenshots/04_salary_range.png`

#### 쿼리 5: Houston에서 진행중인 프로젝트의 이름과 번호 출력
```sql
SELECT Pname, Pnumber 
FROM PROJECT 
WHERE Plocation = 'Houston';
```
- **스크린샷**: `screenshots/05_houston_projects.png`

#### 쿼리 6: 급여가 30,000달러에서 40,000달러 사이에 있는 5번 부서의 모든 사원의 이름과 급여 출력
```sql
SELECT Fname, Lname, Salary 
FROM EMPLOYEE 
WHERE Salary BETWEEN 30000 AND 40000 
  AND Dno = 5;
```
- **스크린샷**: `screenshots/06_dept5_salary_range.png`

#### 쿼리 7: 모든 사원을 1) 급여(높은 순서) 2) 생년월일(나이가 많은 순서)로 출력
```sql
SELECT Fname, Lname, Salary, Bdate 
FROM EMPLOYEE 
ORDER BY Salary DESC, Bdate ASC;
```
- **스크린샷**: `screenshots/07_sorted_employees.png`

#### 쿼리 8: 부양가족이 있는 사원들의 이름(Fname, Lname)과 부양가족의 이름 출력
```sql
SELECT e.Fname, e.Lname, d.Dependent_name 
FROM EMPLOYEE e 
JOIN DEPENDENT d ON e.Ssn = d.Essn;
```
- **스크린샷**: `screenshots/08_employees_with_dependents.png`

#### 쿼리 9: 프로젝트 번호 1,2,3에서 일하는 사원의 주민등록번호(Essn) 출력
```sql
SELECT DISTINCT Essn 
FROM WORKS_ON 
WHERE Pno IN (1, 2, 3);
```
- **스크린샷**: `screenshots/09_project_123_employees.png`

#### 쿼리 10: 사원의 급여의 합, 최고 급여, 최저 급여, 평균 급여 출력
```sql
SELECT 
    SUM(Salary) AS total_salary,
    MAX(Salary) AS max_salary,
    MIN(Salary) AS min_salary,
    AVG(Salary) AS avg_salary 
FROM EMPLOYEE;
```
- **스크린샷**: `screenshots/10_salary_statistics.png`

---

### Phase 3: 고급 SQL 쿼리 작성 (11-17번)

#### 쿼리 11: 'Newbenefits' 프로젝트에 참여하는 모든 사원의 급여를 10% 올린 경우의 급여 출력
```sql
SELECT e.Fname, e.Lname, e.Salary * 1.1 AS Increased_sal 
FROM EMPLOYEE e
JOIN WORKS_ON w ON e.Ssn = w.Essn
JOIN PROJECT p ON w.Pno = p.Pnumber 
WHERE p.Pname = 'Newbenefits';
```
- **PDF 해답 참고**: 105-107줄
- **스크린샷**: `screenshots/11_newbenefits_increased_salary.png`

#### 쿼리 12: 각 부서에서 근무하는 사원의 수 출력 (부서이름과 소속 사원수)
```sql
SELECT d.Dname, COUNT(*) AS e_count
FROM DEPARTMENT d
JOIN EMPLOYEE e ON d.Dnumber = e.Dno
GROUP BY d.Dname;
```
- **PDF 해답 참고**: 112-124줄
- **스크린샷**: `screenshots/12_department_employee_count.png`

#### 쿼리 13: 각 부서에 대해서 부서이름, 부서에 소속된 사원의 수와 최고급여와 평균 급여 출력
```sql
SELECT 
    d.Dname, 
    COUNT(*) AS count_employee, 
    MAX(e.Salary) AS max_salary, 
    AVG(e.Salary) AS avg_salary
FROM DEPARTMENT d
LEFT JOIN EMPLOYEE e ON d.Dnumber = e.Dno
GROUP BY d.Dname;
```
- **PDF 해답 참고**: 129-141줄
- **스크린샷**: `screenshots/13_department_statistics.png`

#### 쿼리 14: 프로젝트에 대해서 프로젝트 번호, 프로젝트 이름, 그 프로젝트에서 근무하는 사원들의 이름 출력
```sql
SELECT p.Pnumber, p.Pname, e.Fname, e.Lname
FROM PROJECT p 
JOIN WORKS_ON w ON p.Pnumber = w.Pno
JOIN EMPLOYEE e ON w.Essn = e.Ssn;
```
- **PDF 해답 참고**: 146-154줄
- **스크린샷**: `screenshots/14_project_employees.png`

#### 쿼리 15: 세 명 이상의 사원이 근무하는 프로젝트에 대해서 프로젝트 번호, 프로젝트 이름, 그 프로젝트에서 근무하는 사원들의 수 출력
```sql
SELECT p.Pnumber, p.Pname, COUNT(e.Fname) AS count_employee
FROM PROJECT p
JOIN WORKS_ON w ON p.Pnumber = w.Pno
JOIN EMPLOYEE e ON w.Essn = e.Ssn
GROUP BY p.Pname 
HAVING COUNT(e.Fname) >= 3;
```
- **PDF 해답 참고**: 162-178줄
- **스크린샷**: `screenshots/15_projects_3plus_employees.png`

#### 쿼리 16: 프로젝트에 대해서 프로젝트 번호, 프로젝트 이름, 5번 부서에 속하면서 프로젝트에서 근무하는 사원의 수 출력
```sql
SELECT p.Pnumber, p.Pname, COUNT(e.Fname) AS count_employee
FROM PROJECT p 
JOIN DEPARTMENT d ON p.Dnum = d.Dnumber
JOIN EMPLOYEE e ON d.Dnumber = e.Dno
WHERE d.Dnumber = 5
GROUP BY p.Pname;
```
- **PDF 해답 참고**: 183-199줄
- **스크린샷**: `screenshots/16_dept5_project_employees.png`

#### 쿼리 17: 3명 이상의 사원이 근무하는 각 부서에 대해서 부서 번호와 40,000달러가 넘는 급여를 받는 사원의 ssn 및 salary 출력
```sql
SELECT d.Dnumber, e.Ssn, e.Salary
FROM DEPARTMENT d
JOIN EMPLOYEE e ON d.Dnumber = e.Dno
WHERE e.Salary >= 40000
  AND d.Dnumber IN (
      SELECT Dno
      FROM EMPLOYEE
      GROUP BY Dno 
      HAVING COUNT(*) >= 3
  );
```
- **PDF 해답 참고**: 204-232줄
- **스크린샷**: `screenshots/17_department_high_salary.png`

---

## 📁 작업 파일 생성 계획

### 1. week9_queries.sql 파일 생성
- 모든 17개 쿼리를 한 파일에 작성
- 각 쿼리 앞에 주석으로 번호와 설명 추가
- 실행 시 주석 처리하여 단계별 실행 가능

### 2. week9_results.md 파일 생성
- 각 쿼리의 실행 결과를 표로 정리
- 예상 결과와 실제 결과 비교
- 쿼리 설명 및 학습 내용 정리

### 3. 스크린샷 저장
- 각 쿼리 실행 결과를 캡처
- 파일명 규칙: `01_쿼리명.png` ~ `17_쿼리명.png`

---

## 🔧 실제 작업 순서

### Step 1: 환경 준비 (10분)
1. ✅ MySQL 서버 실행 확인
2. ⏳ Week9_company 데이터베이스 생성
3. ⏳ 스키마 파일 실행
4. ⏳ 데이터 확인 (각 테이블 COUNT 확인)

### Step 2: 기본 쿼리 작성 (1시간)
1. ⏳ week9_queries.sql 파일 생성
2. ⏳ 쿼리 1-10번 작성
3. ⏳ 각 쿼리 실행 및 결과 확인
4. ⏳ 스크린샷 캡처
5. ⏳ 결과 문서화

### Step 3: 고급 쿼리 작성 (2시간)
1. ⏳ 쿼리 11-17번 작성 (PDF 해답 참고)
2. ⏳ JOIN 구문 검증
3. ⏳ GROUP BY, HAVING 검증
4. ⏳ 서브쿼리 검증
5. ⏳ 각 쿼리 실행 및 결과 확인
6. ⏳ 스크린샷 캡처
7. ⏳ 결과 문서화

### Step 4: 최종 정리 (30분)
1. ⏳ 모든 쿼리 재실행 및 검증
2. ⏳ week9_results.md 최종 작성
3. ⏳ 스크린샷 파일 정리
4. ⏳ 최종 확인

---

## ⚠️ 주의사항

### MySQL 문법 관련
- 테이블명과 컬럼명은 대소문자를 구분하지 않지만, 스키마에서는 대문자로 정의됨
- 문자열 값은 작은따옴표 사용: 'Houston', 'Newbenefits'
- 숫자 값은 따옴표 없이: 30000, 5
- AS 키워드로 별칭 지정 가능

### PDF 해답과의 차이점
- PDF 해답은 참고용이며, MySQL 문법에 맞게 수정 필요할 수 있음
- 테이블명: employee → EMPLOYEE (대문자 권장)
- 문자열 비교: = 연산자 사용 가능

### 디버깅 팁
- 쿼리가 실행되지 않으면 구문 오류 확인
- 결과가 예상과 다르면 WHERE 조건 확인
- JOIN 시 NULL 값 확인 (LEFT JOIN vs INNER JOIN)
- GROUP BY 사용 시 SELECT에 있는 모든 컬럼이 GROUP BY에 포함되어야 함

---

## ✅ 완료 체크리스트

### 환경 설정
- [ ] Week9_company 데이터베이스 생성
- [ ] 스키마 파일 실행 성공
- [ ] 각 테이블 데이터 개수 확인

### 기본 쿼리 (1-10번)
- [ ] 쿼리 1 작성 및 실행
- [ ] 쿼리 2 작성 및 실행
- [ ] 쿼리 3 작성 및 실행
- [ ] 쿼리 4 작성 및 실행
- [ ] 쿼리 5 작성 및 실행
- [ ] 쿼리 6 작성 및 실행
- [ ] 쿼리 7 작성 및 실행
- [ ] 쿼리 8 작성 및 실행
- [ ] 쿼리 9 작성 및 실행
- [ ] 쿼리 10 작성 및 실행

### 고급 쿼리 (11-17번)
- [ ] 쿼리 11 작성 및 실행
- [ ] 쿼리 12 작성 및 실행
- [ ] 쿼리 13 작성 및 실행
- [ ] 쿼리 14 작성 및 실행
- [ ] 쿼리 15 작성 및 실행
- [ ] 쿼리 16 작성 및 실행
- [ ] 쿼리 17 작성 및 실행

### 최종 정리
- [ ] week9_queries.sql 파일 완성
- [ ] week9_results.md 파일 작성
- [ ] 모든 스크린샷 캡처 완료 (17개)
- [ ] 최종 검증 완료

---

## 🎯 예상 소요 시간
- 환경 설정: 10분
- 기본 쿼리 (1-10번): 1시간
- 고급 쿼리 (11-17번): 2시간
- 최종 정리: 30분
- **총 예상 시간: 약 3시간 40분**

---

## 📌 시작 명령어

### 데이터베이스 생성 및 스키마 실행
```bash
cd "/Users/mireukim/Storage/Inha University/데이터베이스 설계/실습/inha-database/assignments/week9"

# 데이터베이스 생성
mysql -u root -p'c3409711!' -e "CREATE DATABASE IF NOT EXISTS Week9_company CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 스키마 실행
mysql -u root -p'c3409711!' Week9_company < COMPANY_Database_Schema.sql

# 데이터 확인
mysql -u root -p'c3409711!' Week9_company -e "SELECT COUNT(*) FROM EMPLOYEE; SELECT COUNT(*) FROM DEPARTMENT; SELECT COUNT(*) FROM PROJECT;"
```

---

**작성일**: 2024년 11월 2일  
**상태**: 실행 준비 완료
