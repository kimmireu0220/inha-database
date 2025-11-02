# Week 9 SQL 실습 과제 계획서

## 📋 과제 개요
- **과제명**: SQL (Structured Query Language) 실습
- **목표**: COMPANY 데이터베이스를 활용한 SQL 쿼리 작성 및 실행
- **데이터베이스**: Week9_company (MySQL)

## 🗂️ 파일 구조 계획

```
week9/
├── COMPANY_Database_Schema.sql      # 데이터베이스 스키마 및 데이터
├── DB_ICE4016_2024_9_sql_ kor.pdf   # 과제 요구사항 PDF
├── output_week9.txt                  # PDF 텍스트 변환본
├── Week9_계획.md                    # 본 계획서
├── week9_queries.sql                 # 작성할 SQL 쿼리 파일 (생성 예정)
├── week9_results.md                  # 쿼리 실행 결과 정리 (생성 예정)
└── screenshots/                      # 실행 결과 스크린샷 (생성 예정)
    ├── 01_all_employees.png
    ├── 02_total_employees.png
    ├── ...
    └── 17_department_high_salary.png
```

## 📊 데이터베이스 스키마 분석

### 테이블 구조
1. **EMPLOYEE**: 사원 정보
   - 컬럼: Fname, Minit, Lname, Ssn, Bdate, Address, Sex, Salary, Super_ssn, Dno
   - 총 8명의 사원 데이터

2. **DEPARTMENT**: 부서 정보
   - 컬럼: Dname, Dnumber, Mgr_ssn, Mgr_start_date
   - 총 3개 부서 (Research=5, Administration=4, Headquarters=1)

3. **PROJECT**: 프로젝트 정보
   - 컬럼: Pname, Pnumber, Plocation, Dnum
   - 총 6개 프로젝트 (1,2,3,10,20,30)

4. **WORKS_ON**: 사원-프로젝트 작업 관계
   - 컬럼: Essn, Pno, Hours

5. **DEPENDENT**: 부양가족 정보
   - 컬럼: Essn, Dependent_name, Sex, Bdate, Relationship

6. **DEPT_LOCATIONS**: 부서 위치 정보
   - 컬럼: Dnumber, Dlocation

## 📝 과제 요구사항 분석

### 1단계: 기본 SQL 쿼리 (10개)

#### 쿼리 1: 모든 사원의 이름, 주소, 급여 출력
- **테이블**: EMPLOYEE
- **컬럼**: Fname, Lname, Address, Salary
- **난이도**: ⭐ (쉬움)

#### 쿼리 2: 회사의 총 사원수 출력
- **함수**: COUNT(*)
- **난이도**: ⭐ (쉬움)

#### 쿼리 3: 3만 이상의 급여를 받는 사원들의 이름과 급여 출력
- **조건**: WHERE Salary >= 30000
- **난이도**: ⭐ (쉬움)

#### 쿼리 4: 3만 이상, 5만 이하의 급여를 받는 사람들의 이름과 급여 출력
- **조건**: WHERE Salary BETWEEN 30000 AND 50000
- **난이도**: ⭐ (쉬움)

#### 쿼리 5: Houston에서 진행중인 프로젝트의 이름과 번호 출력
- **테이블**: PROJECT
- **조건**: WHERE Plocation = 'Houston'
- **난이도**: ⭐ (쉬움)

#### 쿼리 6: 급여가 30,000달러에서 40,000달러 사이에 있는 5번 부서의 모든 사원의 이름과 급여 출력
- **조건**: WHERE Salary BETWEEN 30000 AND 40000 AND Dno = 5
- **난이도**: ⭐⭐ (보통)

#### 쿼리 7: 모든 사원을 1) 급여(높은 순서) 2) 생년월일(나이가 많은 순서)로 출력
- **정렬**: ORDER BY Salary DESC, Bdate ASC
- **난이도**: ⭐⭐ (보통)

#### 쿼리 8: 부양가족이 있는 사원들의 이름(Fname, Lname)과 부양가족의 이름 출력
- **JOIN**: EMPLOYEE와 DEPENDENT 조인
- **난이도**: ⭐⭐ (보통)

#### 쿼리 9: 프로젝트 번호 1,2,3에서 일하는 사원의 주민등록번호(Essn) 출력
- **조건**: WHERE Pno IN (1, 2, 3)
- **난이도**: ⭐⭐ (보통)

#### 쿼리 10: 사원의 급여의 합, 최고 급여, 최저 급여, 평균 급여 출력
- **집계함수**: SUM, MAX, MIN, AVG
- **난이도**: ⭐⭐ (보통)

### 2단계: 고급 SQL 쿼리 (7개)

#### 쿼리 11: 'Newbenefits' 프로젝트에 참여하는 모든 사원의 급여를 10% 올린 경우의 급여 출력
- **JOIN**: EMPLOYEE, WORKS_ON, PROJECT
- **계산**: Salary * 1.1
- **별칭**: AS Increased_sal
- **난이도**: ⭐⭐⭐ (어려움)
- **PDF 해답 참고 가능**

#### 쿼리 12: 각 부서에서 근무하는 사원의 수 출력 (부서이름과 소속 사원수)
- **JOIN**: DEPARTMENT, EMPLOYEE
- **집계**: COUNT(*) AS e_count
- **GROUP BY**: Dname
- **난이도**: ⭐⭐⭐ (어려움)
- **PDF 해답 참고 가능**

#### 쿼리 13: 각 부서에 대해서 부서이름, 부서에 소속된 사원의 수와 최고급여와 평균 급여 출력
- **JOIN**: DEPARTMENT LEFT JOIN EMPLOYEE
- **집계**: COUNT(*), MAX(Salary), AVG(Salary)
- **GROUP BY**: Dname
- **난이도**: ⭐⭐⭐ (어려움)
- **PDF 해답 참고 가능**

#### 쿼리 14: 프로젝트에 대해서 프로젝트 번호, 프로젝트 이름, 그 프로젝트에서 근무하는 사원들의 이름 출력
- **JOIN**: PROJECT, WORKS_ON, EMPLOYEE
- **난이도**: ⭐⭐⭐ (어려움)
- **PDF 해답 참고 가능**

#### 쿼리 15: 세 명 이상의 사원이 근무하는 프로젝트에 대해서 프로젝트 번호, 프로젝트 이름, 그 프로젝트에서 근무하는 사원들의 수 출력
- **JOIN**: PROJECT, WORKS_ON, EMPLOYEE
- **집계**: COUNT(e.Fname)
- **GROUP BY**: Pname
- **HAVING**: COUNT(e.Fname) >= 3
- **난이도**: ⭐⭐⭐⭐ (매우 어려움)
- **PDF 해답 참고 가능**

#### 쿼리 16: 프로젝트에 대해서 프로젝트 번호, 프로젝트 이름, 5번 부서에 속하면서 프로젝트에서 근무하는 사원의 수 출력
- **JOIN**: PROJECT, DEPARTMENT, EMPLOYEE
- **조건**: WHERE Dnumber = 5
- **GROUP BY**: Pname
- **난이도**: ⭐⭐⭐⭐ (매우 어려움)
- **PDF 해답 참고 가능**

#### 쿼리 17: 3명 이상의 사원이 근무하는 각 부서에 대해서 부서 번호와 40,000달러가 넘는 급여를 받는 사원의 ssn 및 salary 출력
- **JOIN**: DEPARTMENT, EMPLOYEE
- **서브쿼리**: IN (SELECT Dno FROM employee GROUP BY Dno HAVING count(*) >= 3)
- **조건**: WHERE Salary >= 40000
- **난이도**: ⭐⭐⭐⭐⭐ (최고 난이도)
- **PDF 해답 참고 가능**

## 🔧 구현 계획

### Phase 1: 환경 설정
1. ✅ Week9 폴더 생성
2. ✅ 필요한 파일 복사 (스키마, PDF)
3. ⏳ 데이터베이스 생성 (`Week9_company`)
4. ⏳ 스키마 실행 (`COMPANY_Database_Schema.sql`)
5. ⏳ 데이터 확인

### Phase 2: 기본 쿼리 작성 (1-10번)
1. ⏳ 각 쿼리별 SQL 작성
2. ⏳ 쿼리 실행 및 결과 확인
3. ⏳ 결과 스크린샷 캡처
4. ⏳ 결과 문서화

### Phase 3: 고급 쿼리 작성 (11-17번)
1. ⏳ PDF 해답 참고하여 쿼리 작성
2. ⏳ JOIN 복잡도 높은 쿼리 검증
3. ⏳ GROUP BY, HAVING 사용 쿼리 검증
4. ⏳ 서브쿼리 사용 쿼리 검증
5. ⏳ 결과 스크린샷 캡처
6. ⏳ 결과 문서화

### Phase 4: 검증 및 정리
1. ⏳ 모든 쿼리 재실행 및 검증
2. ⏳ 결과 정리 문서 작성
3. ⏳ 스크린샷 정리
4. ⏳ 최종 확인

## 📌 주의사항

### 데이터베이스 연결
- MySQL 서버 실행 확인
- 비밀번호: `c3409711!` (기존 설정 사용)
- 데이터베이스명: `Week9_company` (새로 생성)

### 쿼리 작성 시 주의점
- 컬럼명 대소문자 확인 (MySQL은 대소문자 구분)
- 테이블명 확인 (EMPLOYEE vs employee)
- 문자열 값은 작은따옴표 사용 ('Houston', 'Newbenefits')
- 숫자 값은 따옴표 없이 사용 (30000, 5)

### PDF 해답 참고
- 쿼리 11-17번은 PDF에 예시 해답이 있음
- 하지만 직접 작성 후 비교하는 것을 권장
- MySQL 문법에 맞게 수정 필요할 수 있음

## 📋 체크리스트

### 환경 설정
- [ ] 데이터베이스 생성
- [ ] 스키마 실행
- [ ] 데이터 확인

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
- [ ] 모든 쿼리 통합 파일 작성
- [ ] 결과 문서화
- [ ] 스크린샷 정리
- [ ] 최종 검증

## 🎯 예상 소요 시간
- 환경 설정: 10분
- 기본 쿼리 (1-10번): 1시간
- 고급 쿼리 (11-17번): 2시간
- 검증 및 정리: 30분
- **총 예상 시간: 약 3시간 40분**

---
**작성일**: 2024년 10월 27일  
**상태**: 계획 완료, 구현 대기 중
