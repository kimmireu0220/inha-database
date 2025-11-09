# 데이터베이스 설계 (ICE4016)

> 인하대학교 데이터 인텔리전스 연구실 데이터베이스 설계 과목 실습 프로젝트

## 📋 프로젝트 개요

이 프로젝트는 데이터베이스 설계 과목(ICE4016)의 주차별 실습 과제들을 체계적으로 관리하기 위해 구성되었습니다. 
HTML, CSS, JavaScript, Node.js, Express.js, MySQL을 활용한 풀스택 웹 개발 과정을 학습합니다.

## 🏗️ 프로젝트 구조

```
Database/
├── 00_backup/           # 원본 파일들 백업
│   ├── week2/          # HTML/CSS/JavaScript 기초
│   ├── week2_2/        # Node.js 기초
│   ├── week3/          # 데이터베이스 스키마 설계
│   ├── week6/          # CRUD 웹 애플리케이션
│   ├── week10/         # 로그인/삭제 기능
│   └── week11/         # 완전한 웹 애플리케이션
├── assignments/         # 과제별 작업 폴더 (실제 작업 공간)
│   ├── week2/          # Week 2: HTML/CSS/JavaScript 기초
│   ├── week2_2/        # Week 2-2: Node.js 환경 구성
│   ├── week3/          # Week 3: 데이터베이스 스키마 설계
│   ├── week4/          # Week 4: Node.js 데이터베이스 조회
│   ├── week6/          # Week 6: Express.js CRUD 애플리케이션
│   ├── week7/          # Week 7: MySQL Express 연동 (INSERT/SELECT/UPDATE)
│   ├── week9/          # Week 9: SQL 쿼리 실습
│   ├── week10/         # Week 10: 학생 로그인 및 수강취소 기능
│   └── week11/         # Week 11: 통합 웹 애플리케이션
└── README.md
```

## 🛠️ 기술 스택

### Frontend
- **HTML5** - 웹 페이지 구조 및 시맨틱 마크업
- **CSS3** - 스타일링 및 레이아웃 (Box Model, Flexbox)
- **JavaScript (ES6+)** - 클라이언트 사이드 로직
  - DOM 조작
  - 이벤트 처리
  - 폼 검증

### Backend
- **Node.js** - 서버 사이드 JavaScript 런타임
- **Express.js** - 웹 애플리케이션 프레임워크
- **Handlebars** - 템플릿 엔진

### Database
- **MySQL** - 관계형 데이터베이스 관리 시스템

### Development Tools
- **NVM** - Node.js 버전 관리
- **Git** - 버전 관리 시스템
- **VS Code** - 통합 개발 환경

## 📚 주차별 학습 내용

### Week 2: HTML/CSS/JavaScript 기초
- **HTML 시맨틱 구조**: header, nav, section, footer
- **CSS Box Model**: margin, padding, border
- **JavaScript DOM 조작**: getElementById, querySelector
- **폼 처리**: input validation, event handling
- **과제**: 개인 프로필 페이지 및 Random Number Game

### Week 3: 데이터베이스 스키마 설계
- **관계형 데이터베이스 개념**
- **SQL DDL**: CREATE, ALTER, DROP
- **COMPANY 데이터베이스 스키마 설계**

### Week 4: Node.js 데이터베이스 조회
- **Node.js를 통한 MySQL 연결**
- **COMPANY 데이터베이스 조회**
- **동적 HTML 생성**

### Week 6: Express.js CRUD 애플리케이션
- **Express.js 기본 구조**
- **라우팅 및 미들웨어**
- **MySQL 연동**
- **CRUD 연산 구현**

### Week 7: MySQL Express 연동
- **데이터 삽입(INSERT) 기능**
- **데이터 조회(SELECT) 기능**
- **데이터 수정(UPDATE) 기능**
- **Handlebars 템플릿 엔진 활용**

### Week 9: SQL 쿼리 실습
- **COMPANY 데이터베이스 활용**
- **기본 SQL 쿼리 작성**
- **조인, 집계 함수, 서브쿼리 등 고급 SQL**

### Week 10: 학생 로그인 및 수강취소 기능
- **학생 로그인 시스템 구현**
- **세션 관리 (express-session)**
- **권한 기반 접근 제어**
- **수강취소(DELETE) 기능**

### Week 11: 통합 웹 애플리케이션
- **완전한 풀스택 애플리케이션**
- **사용자 인터페이스 개선**
- **반응형 디자인**

## 🚀 시작하기

### 필수 요구사항
- Node.js (v16.10.0)
- MySQL
- Git
- VS Code (권장)

### 설치 방법

1. **저장소 클론**
   ```bash
   git clone https://github.com/yourusername/database-design-course.git
   cd database-design-course
   ```

2. **Node.js 설치 (NVM 사용)**
   ```bash
   nvm install 16.10.0
   nvm use 16.10.0
   node -v
   ```

3. **의존성 설치** (각 주차별 폴더에서 실행)
   ```bash
   cd assignments/week6  # 또는 week4, week7, week10, week11
   npm install
   ```

4. **MySQL 설정**
   - MySQL 서버 설치 및 실행
   - 데이터베이스 생성 및 테이블 설정

### 실행 방법

각 주차별 과제는 독립적으로 실행됩니다:

```bash
# Week 2: HTML 파일을 브라우저에서 직접 열기
open assignments/week2/week2_1.html

# Week 4, 6, 7, 10, 11: Node.js 애플리케이션 실행
cd assignments/week6  # 또는 week4, week7, week10, week11
npm start             # nodemon을 사용한 자동 재시작
# 또는
node src/index.js     # 직접 실행
```

## 📝 사용 방법

1. **원본 파일 보존**: `00_backup/` 폴더에 모든 원본 파일들이 안전하게 보관됩니다.
2. **과제 작업**: `assignments/` 폴더 내의 해당 주차 폴더에서 과제를 진행합니다.
3. **독립적 작업**: 각 주차별로 독립적인 작업 환경을 제공합니다.
4. **버전 관리**: Git을 통해 변경사항을 추적할 수 있습니다.

## 📖 참고 자료

- [HTML MDN Documentation](https://developer.mozilla.org/ko/docs/Web/HTML)
- [CSS MDN Documentation](https://developer.mozilla.org/ko/docs/Web/CSS)
- [JavaScript MDN Documentation](https://developer.mozilla.org/ko/docs/Web/JavaScript)
- [Node.js 공식 문서](https://nodejs.org/ko/docs/)
- [Express.js 공식 문서](https://expressjs.com/ko/)
- [MySQL 공식 문서](https://dev.mysql.com/doc/)

## 🔧 개발 환경 설정 팁

### Windows 사용자
- **NVM 설치 시 한글 사용자명 문제**: 설치 경로를 영문 경로로 변경
- **MySQL 설치 시 PC명 한글 문제**: Windows 설정에서 PC명을 영문으로 변경

### 프로젝트별 상세 정보
각 과제 폴더의 `README.md` 파일에서 해당 과제의 상세한 내용과 작업 지침을 확인할 수 있습니다.

---

**Course**: 데이터베이스 설계 (ICE4016)  
**Instructor**: Prof. Wonik Choi  
**Institution**: 인하대학교 데이터 인텔리전스 연구실
