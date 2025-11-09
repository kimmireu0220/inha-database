# 10주차 과제 구현 완료 검토서

## ✅ 구현 완료 항목

### 1. 패키지 설치
- ✅ `express-session` 패키지 추가 완료
- ✅ `npm install` 실행 완료

### 2. 데이터베이스 구조
- ✅ `Enrollment` 테이블 생성 완료
- ✅ 샘플 데이터 삽입 완료 (6개 레코드)
- ✅ 테이블 확인: Student_Id와 Class_Id 관계 정상

### 3. 데이터베이스 쿼리 함수
- ✅ `getStudentById()`: 특정 학생 정보 조회
- ✅ `getStudentByLogin()`: 로그인용 학생 조회 (Id, PhoneNumber)
- ✅ `getEnrolledClasses()`: 학생이 수강하는 수업 조회
- ✅ `deleteEnrollment()`: 수강취소 기능

### 4. 로그인 기능 (STEP 1)
- ✅ `routes/login.js` 생성 완료
- ✅ `views/login.hbs` 생성 완료
- ✅ Student 테이블의 Id(학번) + PhoneNumber(비밀번호)로 인증
- ✅ 로그인 성공 시 `/select`로 리다이렉트
- ✅ 로그인 실패 시 경고 창 팝업

### 5. 학생 정보 조회 페이지
- ✅ `routes/select.js` 수정 완료
- ✅ 권한 체크 추가 (로그인하지 않은 경우 `/`로 리다이렉트)
- ✅ 로그인한 학생의 정보만 조회하도록 수정

### 6. 수강취소 기능 (STEP 2)
- ✅ `routes/delete.js` 생성 완료
- ✅ `views/deleteClass.hbs` 생성 완료
- ✅ `/delete/class` 경로 구현
- ✅ 학생 권한 체크 (학생으로 로그인한 경우에만 접근)
- ✅ 수강 중인 수업 목록 조회
- ✅ 수강취소 버튼 및 삭제 기능

### 7. 서버 설정
- ✅ `src/index.js` 수정 완료
- ✅ 세션 미들웨어 설정 완료
- ✅ 라우터 등록 완료:
  - `/` → loginRouter (로그인)
  - `/home` → homeRouter (기존 홈)
  - `/select` → selectRouter (조회)
  - `/update` → updateRouter (수정)
  - `/delete` → deleteRouter (수강취소)

---

## 📋 파일 구조

### 새로 생성된 파일
1. `routes/login.js` - 로그인 라우터
2. `views/login.hbs` - 로그인 페이지
3. `routes/delete.js` - 수강취소 라우터
4. `views/deleteClass.hbs` - 수강취소 페이지
5. `enrollment_table.sql` - Enrollment 테이블 생성 SQL

### 수정된 파일
1. `package.json` - express-session 추가
2. `src/index.js` - 세션 설정 및 라우터 등록
3. `database/sql.js` - 로그인 및 수강취소 쿼리 추가
4. `routes/select.js` - 권한 체크 및 학생 정보 필터링

---

## 🧪 테스트 체크리스트

### STEP 1: 로그인 기능 테스트
- [ ] `localhost:3000/` 접속 시 로그인 페이지 표시
- [ ] 올바른 학번(Id)과 전화번호(PhoneNumber) 입력 시 로그인 성공
- [ ] 로그인 성공 시 `/select`로 이동
- [ ] 잘못된 정보 입력 시 경고 창 팝업
- [ ] 로그인 후 학생 정보 조회 페이지에서 해당 학생 정보만 표시

### STEP 2: 수강취소 기능 테스트
- [ ] 로그인하지 않은 상태에서 `/delete/class` 접속 시 `/`로 리다이렉트
- [ ] 학생으로 로그인한 경우 `/delete/class` 접속 가능
- [ ] 수강 중인 수업 목록이 정상적으로 표시
- [ ] 삭제 버튼 클릭 시 해당 수업이 수강취소됨
- [ ] 수강취소 후 목록에서 해당 수업이 사라짐

---

## 🔍 주요 구현 내용

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
}
```

### 권한 체크
```javascript
// 로그인하지 않은 경우 리다이렉트
if (!req.session.user || !req.session.user.checkLogin) {
    return res.redirect('/');
}

// 학생 권한 체크
if (req.session.user.role !== 'student') {
    return res.redirect('/');
}
```

### 수강취소 로직
```javascript
// Enrollment 테이블에서 Student_Id와 Class_Id로 삭제
await deleteSql.deleteEnrollment(studentId, classId);
```

---

## 📊 데이터베이스 상태

### Enrollment 테이블 데이터
- 학생 1번: 수업 1번, 2번 수강
- 학생 2번: 수업 1번, 3번 수강
- 학생 3번: 수업 2번, 3번 수강

### 테스트용 로그인 정보
- 학생 1번: Id=1, PhoneNumber='010-0000-0001'
- 학생 2번: Id=2, PhoneNumber='010-0000-0002'
- 학생 3번: Id=3, PhoneNumber='010-0000-0003'

---

## 🚀 실행 방법

1. **서버 실행**
   ```bash
   cd assignments/week7
   npm run start
   ```

2. **브라우저 접속**
   - 로그인 페이지: `http://localhost:3000/`
   - 학생 정보 조회: `http://localhost:3000/select` (로그인 필요)
   - 수강취소: `http://localhost:3000/delete/class` (로그인 필요)

---

## ✅ 최종 확인 사항

- [x] 모든 파일 생성 완료
- [x] 데이터베이스 테이블 생성 완료
- [x] 패키지 설치 완료
- [x] 린터 오류 없음
- [x] 코드 구조 정상
- [ ] 실제 서버 실행 테스트 필요
- [ ] 브라우저에서 기능 테스트 필요

---

## 📝 다음 단계

1. 서버 실행하여 기능 테스트
2. 각 기능별 화면 캡처 (보고서용)
3. 보고서 작성

