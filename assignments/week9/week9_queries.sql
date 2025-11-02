-- ============================================
-- Week 9 SQL 실습 과제 - 모든 쿼리
-- 데이터베이스: Week9_company
-- ============================================

USE Week9_company;

-- ============================================
-- Phase 2: 기본 SQL 쿼리 (1-10번)
-- ============================================

-- 쿼리 1: 모든 사원의 이름, 주소, 급여를 출력하라
SELECT Fname, Lname, Address, Salary 
FROM EMPLOYEE;

-- 쿼리 2: 회사의 총 사원수를 출력하라
SELECT COUNT(*) AS total_employees 
FROM EMPLOYEE;

-- 쿼리 3: 3만 이상의 급여를 받는 사원들의 이름과 급여를 출력하라
SELECT Fname, Lname, Salary 
FROM EMPLOYEE 
WHERE Salary >= 30000;

-- 쿼리 4: 3만 이상, 5만 이하의 급여를 받는 사람들의 이름과 급여를 출력하라
SELECT Fname, Lname, Salary 
FROM EMPLOYEE 
WHERE Salary BETWEEN 30000 AND 50000;

-- 쿼리 5: Houston에서 진행중인 프로젝트의 이름과 번호를 출력하라
SELECT Pname, Pnumber 
FROM PROJECT 
WHERE Plocation = 'Houston';

-- 쿼리 6: 급여가 30,000달러에서 40,000달러 사이에 있는 5번 부서의 모든 사원의 이름과 급여를 출력하라
SELECT Fname, Lname, Salary 
FROM EMPLOYEE 
WHERE Salary BETWEEN 30000 AND 40000 
  AND Dno = 5;

-- 쿼리 7: 모든 사원을 1) 급여(높은 순서) 2) 생년월일(나이가 많은 순서)를 출력하라
SELECT Fname, Lname, Salary, Bdate 
FROM EMPLOYEE 
ORDER BY Salary DESC, Bdate ASC;

-- 쿼리 8: 부양가족이 있는 사원들의 이름(Fname, Lname)과 부양가족의 이름을 출력하라
SELECT e.Fname, e.Lname, d.Dependent_name 
FROM EMPLOYEE e 
JOIN DEPENDENT d ON e.Ssn = d.Essn;

-- 쿼리 9: 프로젝트 번호 1,2,3에서 일하는 사원의 주민등록번호(Essn)를 출력하라
SELECT DISTINCT Essn 
FROM WORKS_ON 
WHERE Pno IN (1, 2, 3);

-- 쿼리 10: 사원의 급여의 합, 최고 급여, 최저 급여, 평균 급여를 출력하라
SELECT 
    SUM(Salary) AS total_salary,
    MAX(Salary) AS max_salary,
    MIN(Salary) AS min_salary,
    AVG(Salary) AS avg_salary 
FROM EMPLOYEE;

-- ============================================
-- Phase 3: 고급 SQL 쿼리 (11-17번)
-- ============================================

-- 쿼리 11: 'Newbenefits' 프로젝트에 참여하는 모든 사원의 급여를 10% 올린 경우의 급여를 출력하라 (Fname, Lname, Increased_sal)
SELECT e.Fname, e.Lname, e.Salary * 1.1 AS Increased_sal 
FROM EMPLOYEE e
JOIN WORKS_ON w ON e.Ssn = w.Essn
JOIN PROJECT p ON w.Pno = p.Pnumber 
WHERE p.Pname = 'Newbenefits';

-- 쿼리 12: 각 부서에서 근무하는 사원의 수를 출력하라 (부서이름과 소속 사원수를 출력)
SELECT d.Dname, COUNT(*) AS e_count
FROM DEPARTMENT d
JOIN EMPLOYEE e ON d.Dnumber = e.Dno
GROUP BY d.Dname;

-- 쿼리 13: 각 부서에 대해서 부서이름, 부서에 소속된 사원의 수와 최고급여와 평균 급여를 출력하라
SELECT 
    d.Dname, 
    COUNT(*) AS count_employee, 
    MAX(e.Salary) AS max_salary, 
    AVG(e.Salary) AS avg_salary
FROM DEPARTMENT d
LEFT JOIN EMPLOYEE e ON d.Dnumber = e.Dno
GROUP BY d.Dname;

-- 쿼리 14: 프로젝트에 대해서 프로젝트 번호, 프로젝트 이름, 그 프로젝트에서 근무하는 사원들의 이름을 출력하라
SELECT p.Pnumber, p.Pname, e.Fname, e.Lname
FROM PROJECT p 
JOIN WORKS_ON w ON p.Pnumber = w.Pno
JOIN EMPLOYEE e ON w.Essn = e.Ssn;

-- 쿼리 15: 세 명 이상의 사원이 근무하는 프로젝트에 대해서 프로젝트 번호, 프로젝트 이름, 그 프로젝트에서 근무하는 사원들의 수를 출력하라
SELECT p.Pnumber, p.Pname, COUNT(e.Fname) AS count_employee
FROM PROJECT p
JOIN WORKS_ON w ON p.Pnumber = w.Pno
JOIN EMPLOYEE e ON w.Essn = e.Ssn
GROUP BY p.Pnumber, p.Pname
HAVING COUNT(e.Fname) >= 3;

-- 쿼리 16: 프로젝트에 대해서 프로젝트 번호, 프로젝트 이름, 5번 부서에 속하면서 프로젝트에서 근무하는 사원의 수를 출력하라
SELECT p.Pnumber, p.Pname, COUNT(e.Fname) AS count_employee
FROM PROJECT p 
JOIN DEPARTMENT d ON p.Dnum = d.Dnumber
JOIN EMPLOYEE e ON d.Dnumber = e.Dno
WHERE d.Dnumber = 5
GROUP BY p.Pnumber, p.Pname;

-- 쿼리 17: 3명 이상의 사원이 근무하는 각 부서에 대해서 부서 번호와 40,000달러가 넘는 급여를 받는 사원의 ssn 및 salary를 출력하라
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
