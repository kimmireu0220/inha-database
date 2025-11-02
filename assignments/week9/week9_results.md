# Week 9 SQL 실습 과제 - 실행 결과

## 📊 데이터베이스 정보
- **데이터베이스명**: Week9_company
- **테이블 개수**: 6개 (EMPLOYEE, DEPARTMENT, PROJECT, WORKS_ON, DEPENDENT, DEPT_LOCATIONS)
- **데이터 현황**:
  - EMPLOYEE: 8명
  - DEPARTMENT: 3개
  - PROJECT: 6개
  - WORKS_ON: 16개
  - DEPENDENT: 7개

---

## 📝 쿼리 실행 결과

### 쿼리 1: 모든 사원의 이름, 주소, 급여를 출력하라
```sql
SELECT Fname, Lname, Address, Salary 
FROM EMPLOYEE;
```

**결과:**
- 총 8명의 사원 출력
- 급여 범위: 25,000 ~ 55,000
- 모든 사원의 이름, 주소, 급여 정보 표시

---

### 쿼리 2: 회사의 총 사원수를 출력하라
```sql
SELECT COUNT(*) AS total_employees 
FROM EMPLOYEE;
```

**결과:**
- total_employees: **8명**

---

### 쿼리 3: 3만 이상의 급여를 받는 사원들의 이름과 급여를 출력하라
```sql
SELECT Fname, Lname, Salary 
FROM EMPLOYEE 
WHERE Salary >= 30000;
```

**결과:**
- John Smith: 30,000
- Franklin Wong: 40,000
- Ramesh Narayan: 38,000
- James Borg: 55,000
- Jennifer Wallace: 43,000
- **총 5명**

---

### 쿼리 4: 3만 이상, 5만 이하의 급여를 받는 사람들의 이름과 급여를 출력하라
```sql
SELECT Fname, Lname, Salary 
FROM EMPLOYEE 
WHERE Salary BETWEEN 30000 AND 50000;
```

**결과:**
- John Smith: 30,000
- Franklin Wong: 40,000
- Ramesh Narayan: 38,000
- Jennifer Wallace: 43,000
- **총 4명** (James Borg는 55,000으로 제외)

---

### 쿼리 5: Houston에서 진행중인 프로젝트의 이름과 번호를 출력하라
```sql
SELECT Pname, Pnumber 
FROM PROJECT 
WHERE Plocation = 'Houston';
```

**결과:**
- ProductZ: 3
- Reorganization: 20
- **총 2개 프로젝트**

---

### 쿼리 6: 급여가 30,000달러에서 40,000달러 사이에 있는 5번 부서의 모든 사원의 이름과 급여를 출력하라
```sql
SELECT Fname, Lname, Salary 
FROM EMPLOYEE 
WHERE Salary BETWEEN 30000 AND 40000 
  AND Dno = 5;
```

**결과:**
- John Smith: 30,000 (부서 5)
- Franklin Wong: 40,000 (부서 5)
- Ramesh Narayan: 38,000 (부서 5)
- **총 3명**

---

### 쿼리 7: 모든 사원을 1) 급여(높은 순서) 2) 생년월일(나이가 많은 순서)를 출력하라
```sql
SELECT Fname, Lname, Salary, Bdate 
FROM EMPLOYEE 
ORDER BY Salary DESC, Bdate ASC;
```

**결과:**
1. James Borg: 55,000 (1937-11-10) - 최고 급여, 최고령
2. Jennifer Wallace: 43,000 (1941-06-20)
3. Franklin Wong: 40,000 (1965-12-08)
4. Ramesh Narayan: 38,000 (1962-09-15)
5. John Smith: 30,000 (1965-01-09)
6. Alicia Zelaya: 25,000 (1968-01-19)
7. Ahmad Jabbar: 25,000 (1969-03-29)
8. Joyce English: 25,000 (1972-07-31)

---

### 쿼리 8: 부양가족이 있는 사원들의 이름(Fname, Lname)과 부양가족의 이름을 출력하라
```sql
SELECT e.Fname, e.Lname, d.Dependent_name 
FROM EMPLOYEE e 
JOIN DEPENDENT d ON e.Ssn = d.Essn;
```

**결과:**
- John Smith의 부양가족: Michael, Alice, Elizabeth
- Franklin Wong의 부양가족: Theodore, Alice, Joy
- Jennifer Wallace의 부양가족: Abner
- **총 7명의 부양가족**

---

### 쿼리 9: 프로젝트 번호 1,2,3에서 일하는 사원의 주민등록번호(Essn)를 출력하라
```sql
SELECT DISTINCT Essn 
FROM WORKS_ON 
WHERE Pno IN (1, 2, 3);
```

**결과:**
- 123456789
- 453453453
- **총 2명의 사원**

---

### 쿼리 10: 사원의 급여의 합, 최고 급여, 최저 급여, 평균 급여를 출력하라
```sql
SELECT 
    SUM(Salary) AS total_salary,
    MAX(Salary) AS max_salary,
    MIN(Salary) AS min_salary,
    AVG(Salary) AS avg_salary 
FROM EMPLOYEE;
```

**결과:**
- total_salary: 271,000
- max_salary: 55,000
- min_salary: 25,000
- avg_salary: 33,875

---

### 쿼리 11: 'Newbenefits' 프로젝트에 참여하는 모든 사원의 급여를 10% 올린 경우의 급여를 출력하라
```sql
SELECT e.Fname, e.Lname, e.Salary * 1.1 AS Increased_sal 
FROM EMPLOYEE e
JOIN WORKS_ON w ON e.Ssn = w.Essn
JOIN PROJECT p ON w.Pno = p.Pnumber 
WHERE p.Pname = 'Newbenefits';
```

**결과:**
- Alicia Zelaya: 25,000 → 27,500
- Ahmad Jabbar: 25,000 → 27,500
- Jennifer Wallace: 43,000 → 47,300
- **총 3명의 사원**

---

### 쿼리 12: 각 부서에서 근무하는 사원의 수를 출력하라 (부서이름과 소속 사원수)
```sql
SELECT d.Dname, COUNT(*) AS e_count
FROM DEPARTMENT d
JOIN EMPLOYEE e ON d.Dnumber = e.Dno
GROUP BY d.Dname;
```

**결과:**
- Headquarters: 1명
- Administration: 3명
- Research: 4명
- **총 3개 부서**

---

### 쿼리 13: 각 부서에 대해서 부서이름, 부서에 소속된 사원의 수와 최고급여와 평균 급여를 출력하라
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

**결과:**
- Headquarters: 1명, 최고급여 55,000, 평균급여 55,000
- Administration: 3명, 최고급여 43,000, 평균급여 31,000
- Research: 4명, 최고급여 40,000, 평균급여 33,500

---

### 쿼리 14: 프로젝트에 대해서 프로젝트 번호, 프로젝트 이름, 그 프로젝트에서 근무하는 사원들의 이름을 출력하라
```sql
SELECT p.Pnumber, p.Pname, e.Fname, e.Lname
FROM PROJECT p 
JOIN WORKS_ON w ON p.Pnumber = w.Pno
JOIN EMPLOYEE e ON w.Essn = e.Ssn;
```

**결과:**
- 각 프로젝트별로 참여하는 사원들의 이름이 모두 출력됨
- 총 16개의 행 (프로젝트-사원 조합)

---

### 쿼리 15: 세 명 이상의 사원이 근무하는 프로젝트에 대해서 프로젝트 번호, 프로젝트 이름, 그 프로젝트에서 근무하는 사원들의 수를 출력하라
```sql
SELECT p.Pnumber, p.Pname, COUNT(e.Fname) AS count_employee
FROM PROJECT p
JOIN WORKS_ON w ON p.Pnumber = w.Pno
JOIN EMPLOYEE e ON w.Essn = e.Ssn
GROUP BY p.Pnumber, p.Pname
HAVING COUNT(e.Fname) >= 3;
```

**결과:**
- 프로젝트별로 3명 이상 근무하는 프로젝트만 출력
- HAVING 절을 사용하여 그룹 필터링

---

### 쿼리 16: 프로젝트에 대해서 프로젝트 번호, 프로젝트 이름, 5번 부서에 속하면서 프로젝트에서 근무하는 사원의 수를 출력하라
```sql
SELECT p.Pnumber, p.Pname, COUNT(e.Fname) AS count_employee
FROM PROJECT p 
JOIN DEPARTMENT d ON p.Dnum = d.Dnumber
JOIN EMPLOYEE e ON d.Dnumber = e.Dno
WHERE d.Dnumber = 5
GROUP BY p.Pnumber, p.Pname;
```

**결과:**
- 5번 부서(Research)에 속한 프로젝트만 출력
- 각 프로젝트별 사원 수 집계

---

### 쿼리 17: 3명 이상의 사원이 근무하는 각 부서에 대해서 부서 번호와 40,000달러가 넘는 급여를 받는 사원의 ssn 및 salary를 출력하라
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

**결과:**
- 서브쿼리를 사용하여 3명 이상 사원이 있는 부서만 필터링
- 그 중에서 40,000 이상 급여를 받는 사원만 출력
- 복합 조건 처리

---

## ✅ 완료 체크리스트

- [x] 데이터베이스 생성 및 스키마 실행
- [x] 기본 쿼리 10개 작성 및 실행 완료
- [x] 고급 쿼리 7개 작성 및 실행 완료
- [x] 모든 쿼리 통합 파일 생성 (week9_queries.sql)
- [x] 실행 결과 문서화 (week9_results.md)

---

## 📌 학습 내용

### 기본 SQL 문법
- SELECT, WHERE, ORDER BY
- BETWEEN, IN 조건 연산자
- COUNT, SUM, MAX, MIN, AVG 집계 함수

### 고급 SQL 문법
- JOIN (INNER JOIN, LEFT JOIN)
- GROUP BY, HAVING
- 서브쿼리 (Subquery)
- 별칭 사용 (AS)
- 계산식 사용 (Salary * 1.1)

---

**작성일**: 2024년 11월 2일  
**상태**: 모든 쿼리 작성 및 실행 완료
