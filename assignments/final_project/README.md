# AIRLINE Reservation System

인하대학교 데이터베이스 설계 최종 프로젝트

## 프로젝트 개요

AIRLINE 데이터베이스를 기반으로 한 항공기 예약 시스템

## 기술 스택

- Node.js
- Express.js
- MySQL
- Handlebars (hbs)
- Babel

## 프로젝트 구조

```
final_project/
├── database/
│   └── sql.js          # 데이터베이스 연결 및 SQL 쿼리
├── routes/
│   ├── admin.js        # 관리자 페이지 라우터
│   └── user.js         # 사용자 페이지 라우터
├── views/
│   └── *.hbs           # Handlebars 템플릿
├── public/
│   ├── css/
│   └── js/
├── src/
│   └── index.js        # Express 서버 메인 파일
└── package.json
```

## 실행 방법

```bash
npm install
npm start
```

서버는 `http://localhost:3000`에서 실행됩니다.

## 데이터베이스

- 데이터베이스명: `AIRLINE`
- 사용자: `dbuser`
- 비밀번호: `c3409711!`

