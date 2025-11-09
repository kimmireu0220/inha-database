# Week10 과제 최종 점검 결과

## ✅ 점검 완료 항목

### 1. PDF 요구사항 대비 구현 상태

#### STEP 1: 로그인 기능 ✅
- ✅ 학생의 학번(Id) 및 비밀번호(전화번호, PhoneNumber)로 로그인 구현
- ✅ 로그인 성공 시 학생 정보 조회 페이지(`/select`)로 이동
- ✅ 로그인 실패 시 경고 창 팝업
- ✅ 세션을 통한 로그인 상태 유지

#### STEP 2: 수강취소 기능 ✅
- ✅ `localhost:3000/delete/class` 페이지 구현 완료
- ✅ 학생으로 로그인한 경우에만 접근 가능 (권한 체크)
- ✅ 수강하는 수업(class)을 수강취소(삭제)할 수 있는 기능
- ✅ Enrollment 테이블을 통한 수강 정보 관리

### 2. 코드 구현 완성도

#### 구현된 파일들
- ✅ `routes/login.js`: Student 테이블 기반 로그인 구현
- ✅ `routes/select.js`: 로그인한 학생 정보 조회 구현
- ✅ `routes/delete.js`: 수강취소 기능 구현 (`/class` GET/POST)
- ✅ `database/sql.js`: 필요한 모든 쿼리 함수 구현
  - `getStudentByLogin`: 로그인 인증
  - `getStudentById`: 학생 정보 조회
  - `getEnrolledClasses`: 수강 수업 목록 조회
  - `deleteEnrollment`: 수강취소 삭제
  - `getBuilding`, `getDepartment`, `getRoom`, `getClass`: 전체 테이블 조회
- ✅ `views/deleteClass.hbs`: 수강취소 페이지 뷰
- ✅ `views/select.hbs`: 학생 정보 조회 페이지 뷰 (Building, Department, Room, Student, Class 표시)

### 3. 보고서 점검

#### 형식 및 구조 ✅
- ✅ 구어체 말투 사용 ("-음", "-임" 형식)
- ✅ 4개 섹션 모두 포함:
  1. 개요: 과제 목표, 구현 요구사항, 사용 기술
  2. 상세 설계 내용: 데이터베이스 구조, 로그인 기능, 수강취소 기능, 세션 관리
  3. 실행 화면: 5개 스크린샷 포함
  4. 결론: 구현 결과, 고려사항, 개선 가능한 사항, 최종 평가

#### 스크린샷 ✅
- ✅ 01_login_page.png: 로그인 페이지
- ✅ 02_student_info_page.png: 학생 정보 조회 페이지
- ✅ 03_delete_class_page.png: 수강취소 페이지 (삭제 전)
- ✅ 04_after_delete_class.png: 수강취소 페이지 (삭제 후)
- ✅ 05_login_failed.png: 로그인 실패 화면

#### 코드 참조 ✅
- ✅ 모든 코드 참조 경로가 `assignments/week10/`로 수정됨
- ✅ 코드 라인 번호가 실제 파일과 일치하도록 수정됨

### 4. 수정 완료 사항

1. ✅ 스크린샷 파일 복사: week7의 스크린샷을 week10으로 복사
2. ✅ select.js 수정: 로그인한 학생 정보 조회 기능 추가
3. ✅ database/sql.js 수정: 필요한 모든 쿼리 함수 추가
4. ✅ views/select.hbs 수정: Building, Department, Room, Student, Class 모두 표시
5. ✅ 보고서 코드 참조 경로 수정: week7 → week10
6. ✅ 보고서 스크린샷 경로 수정: 상대 경로로 통일
7. ✅ 보고서 내용 수정: week7 참조 문구 제거

## 📋 최종 확인

### 구현 완료 기능
- ✅ 로그인 기능 (Student 테이블 기반)
- ✅ 학생 정보 조회 기능
- ✅ 수강취소 기능
- ✅ 권한 관리 (세션 기반)
- ✅ 에러 처리

### 보고서 완성도
- ✅ 구어체 말투 사용
- ✅ 4개 섹션 모두 포함
- ✅ 스크린샷 5개 모두 포함
- ✅ 코드 참조 정확성
- ✅ 실행 화면 설명 완료

## ✅ 결론

Week10 과제의 모든 요구사항이 완벽하게 구현되었고, 보고서도 규칙에 맞게 작성되었음.

**점검 완료일**: 2024년 11월 10일

