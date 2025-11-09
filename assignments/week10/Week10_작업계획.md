# 10주차 과제 작업 계획서

## 📋 작업 대상 폴더
**`assignments/week7/`** - 7주차 Inha DB 웹 프로젝트에 로그인 기능 통합

---

## 🎯 과제 요구사항 요약

### STEP 1: 로그인 기능 적용
- **로그인 방식**: 학생의 학번(Id) + 비밀번호(전화번호, PhoneNumber)
- **로그인 성공 시**: 학생 정보 조회 페이지로 이동
- **로그인 실패 시**: 경고 창 팝업

### STEP 2: 수강취소 기능 구현
- **경로**: `localhost:3000/delete/class`
- **권한**: 학생으로 로그인한 경우에만 접근 가능
- **기능**: 수강하는 수업(class)을 수강취소(삭제)

---

## 📊 현재 상태 분석

### MySQL 데이터베이스 (InhaDB)
- **테이블 구조**:
  - `Student`: Id(학번), Name, Email, PhoneNumber(비밀번호로 사용), Major
  - `Class`: Id, Name, Professor, Number_of_participants, Department_Id, Room_Id
  - `Building`, `Department`, `Room` (기존 테이블)
- **현재 데이터**:
  - Student: 5명 (Id: 1~5)
  - Class: 3개 (Id: 1~3)
- **⚠️ 문제점**: Student와 Class 간의 관계 테이블(Enrollment)이 없음

### Week7 프로젝트 구조
- **현재 라우팅**: `/` (home), `/select` (조회), `/update` (수정)
- **세션 관리**: 없음 (추가 필요)
- **로그인 기능**: 없음 (추가 필요)

### Week10 참고 구조
- **세션 관리**: `express-session` 사용
- **로그인 로직**: `routes/login.js` 참고
- **권한 체크**: `req.session.user.role` 사용

---

## 🔧 상세 작업 계획

### 1단계: 패키지 설치 및 설정

#### 1.1 package.json 수정
**파일**: `assignments/week7/package.json`
- `express-session` 패키지 추가
- 기존 패키지 유지

#### 1.2 src/index.js 수정
**파일**: `assignments/week7/src/index.js`
- `express-session` import 추가
- 세션 미들웨어 설정 추가
- Week10의 세션 설정 참고

---

### 2단계: 데이터베이스 구조 확장

#### 2.1 Enrollment 테이블 생성
**파일**: `assignments/week7/create_tables.sql` (또는 새 SQL 파일)
- Student와 Class 간의 관계를 나타내는 테이블 생성
- **구조**:
  ```sql
  CREATE TABLE IF NOT EXISTS Enrollment (
      Student_Id INT,
      Class_Id INT,
      PRIMARY KEY (Student_Id, Class_Id),
      FOREIGN KEY (Student_Id) REFERENCES Student(Id),
      FOREIGN KEY (Class_Id) REFERENCES Class(Id)
  );
  ```
- 샘플 데이터 삽입 (테스트용)

#### 2.2 database/sql.js 수정
**파일**: `assignments/week7/database/sql.js`
- `selectSql.getStudentById()`: 특정 학생 정보 조회
- `selectSql.getStudentByLogin()`: 로그인용 학생 조회 (Id, PhoneNumber)
- `selectSql.getEnrolledClasses()`: 학생이 수강하는 수업 조회
- `deleteSql.deleteEnrollment()`: 수강취소 기능

---

### 3단계: 로그인 기능 구현

#### 3.1 routes/login.js 생성
**파일**: `assignments/week7/routes/login.js` (새 파일)
- **GET `/`**: 로그인 페이지 렌더링
- **POST `/`**: 로그인 처리
  - Student 테이블에서 Id와 PhoneNumber로 검증
  - 성공 시: `req.session.user = { id: student.Id, role: 'student', checkLogin: true }`
  - 실패 시: 경고 창 팝업 후 `/`로 리다이렉트
  - 성공 시: `/select`로 리다이렉트

#### 3.2 views/login.hbs 생성
**파일**: `assignments/week7/views/login.hbs` (새 파일)
- Week10의 `login.hbs` 참고
- 학번(Id) 입력 필드
- 비밀번호(PhoneNumber) 입력 필드
- 로그인 버튼

#### 3.3 src/index.js 수정
**파일**: `assignments/week7/src/index.js`
- `loginRouter` import 및 등록
- 기존 `homeRouter`는 유지하되, 로그인 후 접근 제한 고려

---

### 4단계: 학생 정보 조회 페이지 수정

#### 4.1 routes/select.js 수정
**파일**: `assignments/week7/routes/select.js`
- **권한 체크 추가**: 로그인하지 않은 경우 `/`로 리다이렉트
- **학생 정보 필터링**: 로그인한 학생의 정보만 조회
  - `req.session.user.id`를 사용하여 해당 학생 정보만 가져오기
- **수정 전**: 모든 학생 정보 조회
- **수정 후**: 로그인한 학생의 정보만 조회

#### 4.2 views/select.hbs 수정 (선택사항)
**파일**: `assignments/week7/views/select.hbs`
- 로그인한 학생의 정보만 표시하도록 수정
- 또는 전체 테이블은 유지하되, 로그인한 학생 정보 강조

---

### 5단계: 수강취소 기능 구현

#### 5.1 routes/delete.js 생성
**파일**: `assignments/week7/routes/delete.js` (새 파일)
- **GET `/delete/class`**: 수강취소 페이지 렌더링
  - 권한 체크: 학생으로 로그인한 경우에만 접근
  - 로그인하지 않았거나 다른 권한: `/`로 리다이렉트
  - 해당 학생이 수강하는 수업 목록 조회 (Enrollment 테이블 사용)
- **POST `/delete/class`**: 수강취소 처리
  - Enrollment 테이블에서 해당 레코드 삭제
  - 삭제 후 `/delete/class`로 리다이렉트

#### 5.2 views/deleteClass.hbs 생성
**파일**: `assignments/week7/views/deleteClass.hbs` (새 파일)
- Week10의 `delete.hbs` 참고
- 수강 중인 수업 목록 표시
- 각 수업마다 삭제 버튼
- 삭제 버튼 클릭 시 해당 수업 수강취소

#### 5.3 src/index.js 수정
**파일**: `assignments/week7/src/index.js`
- `deleteRouter` import 및 등록
- `/delete/class` 경로 등록

---

## 📁 파일 변경 목록

### 새로 생성할 파일
1. `assignments/week7/routes/login.js`
2. `assignments/week7/views/login.hbs`
3. `assignments/week7/routes/delete.js`
4. `assignments/week7/views/deleteClass.hbs`
5. `assignments/week7/enrollment_table.sql` (또는 create_tables.sql에 추가)

### 수정할 파일
1. `assignments/week7/package.json` - express-session 추가
2. `assignments/week7/src/index.js` - 세션 설정, 라우터 등록
3. `assignments/week7/database/sql.js` - 새로운 SQL 쿼리 추가
4. `assignments/week7/routes/select.js` - 권한 체크 및 필터링 추가

---

## 🔍 구현 세부사항

### 로그인 로직
```javascript
// Student 테이블에서 Id와 PhoneNumber로 검증
const student = await selectSql.getStudentByLogin(vars.id, vars.password);
if (student) {
    req.session.user = { 
        id: student.Id, 
        role: 'student', 
        checkLogin: true 
    };
    res.redirect('/select');
} else {
    // 로그인 실패
}
```

### 권한 체크 미들웨어 (선택사항)
```javascript
const checkStudentLogin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'student') {
        next();
    } else {
        res.redirect('/');
    }
};
```

### 수강취소 로직
```javascript
// Enrollment 테이블에서 Student_Id와 Class_Id로 삭제
await deleteSql.deleteEnrollment(req.session.user.id, req.body.classId);
```

---

## ✅ 검증 체크리스트

### STEP 1 검증
- [ ] `localhost:3000/` 접속 시 로그인 페이지 표시
- [ ] 올바른 학번과 전화번호 입력 시 로그인 성공
- [ ] 로그인 성공 시 `/select`로 이동
- [ ] 잘못된 정보 입력 시 경고 창 팝업
- [ ] 로그인 후 학생 정보 조회 페이지에서 해당 학생 정보만 표시

### STEP 2 검증
- [ ] 로그인하지 않은 상태에서 `/delete/class` 접속 시 `/`로 리다이렉트
- [ ] 학생으로 로그인한 경우 `/delete/class` 접속 가능
- [ ] 수강 중인 수업 목록이 정상적으로 표시
- [ ] 삭제 버튼 클릭 시 해당 수업이 수강취소됨
- [ ] 수강취소 후 목록에서 해당 수업이 사라짐

---

## 🚀 실행 순서

1. **데이터베이스 설정**
   ```bash
   mysql -u root -p'c3409711!' < assignments/week7/enrollment_table.sql
   ```

2. **패키지 설치**
   ```bash
   cd assignments/week7
   npm install express-session
   ```

3. **서버 실행**
   ```bash
   npm run start
   ```

4. **테스트**
   - 브라우저에서 `localhost:3000` 접속
   - 로그인 테스트
   - 수강취소 기능 테스트

---

## 📝 참고사항

- Week10의 로그인 구조를 참고하되, Student 테이블 구조에 맞게 수정
- Enrollment 테이블이 없으면 수강취소 기능을 구현할 수 없으므로 반드시 생성 필요
- 세션 관리 시 보안을 고려하여 적절한 secret 키 사용
- 로그인 실패 시 사용자에게 명확한 피드백 제공

---

## 🎯 최종 목표

1. ✅ 7주차 Inha DB 웹에 로그인 기능 완전 통합
2. ✅ 학생의 학번과 전화번호로 로그인 가능
3. ✅ 로그인한 학생만 자신의 정보 조회 가능
4. ✅ 학생만 수강취소 페이지 접근 가능
5. ✅ 수강 중인 수업을 수강취소할 수 있음

