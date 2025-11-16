# MySQL Workbench EER Diagram 생성 가이드

## 📋 목차
1. [MySQL Workbench 실행](#1단계-mysql-workbench-실행)
2. [데이터베이스 연결 확인](#2단계-데이터베이스-연결-확인)
3. [Reverse Engineer 시작](#3단계-reverse-engineer-시작)
4. [연결 설정](#4단계-연결-설정-reverse-engineer-창에서)
5. [스키마 선택](#5단계-스키마-선택)
6. [객체 선택](#6단계-객체-선택)
7. [Reverse Engineer 실행](#7단계-reverse-engineer-실행)
8. [EER Diagram 확인](#8단계-eer-diagram-확인)
9. [EER Diagram 정리](#9단계-eer-diagram-정리-선택사항)
10. [스크린샷 촬영](#10단계-스크린샷-촬영)
11. [EER Diagram 저장](#11단계-eer-diagram-저장-선택사항)
12. [확인 사항](#확인-사항)
13. [문제 해결](#문제-해결)

---

## 1단계: MySQL Workbench 실행

1. **Mac에서 MySQL Workbench 실행**
   - Applications 폴더에서 `MySQLWorkbench.app` 실행
   - 또는 Spotlight에서 "MySQL Workbench" 검색 후 실행

---

## 2단계: 데이터베이스 연결 확인

1. **MySQL Workbench 메인 화면에서**
   - 좌측 "MySQL Connections" 섹션 확인
   - 기존 연결이 있으면 더블클릭하여 연결
   - 없으면 새 연결 생성:
     - `+` 버튼 클릭
     - Connection Name: `AIRLINE Connection` (또는 원하는 이름)
     - Hostname: `localhost`
     - Port: `3306`
     - Username: `dbuser`
     - Password: `c3409711!` (또는 `c3409711`)
     - `Store in Keychain` 체크 (선택사항)
     - `Test Connection` 클릭하여 연결 확인
     - `OK` 클릭

2. **연결 더블클릭하여 AIRLINE 데이터베이스에 접속**

---

## 3단계: Reverse Engineer 시작

1. **상단 메뉴에서 `Database` 클릭**
2. **`Reverse Engineer...` 선택**
   - 단축키: `Shift + Cmd + R` (Mac)
3. **"Reverse Engineer: Setup Connection" 창이 열림**

---

## 4단계: 연결 설정 (Reverse Engineer 창에서)

1. **"Stored Connection" 드롭다운에서 기존 연결 선택**
   - 없으면 "Manage Stored Connections..." 클릭하여 새로 만들기

2. **연결 정보 확인:**
   - Hostname: `localhost`
   - Port: `3306`
   - Username: `dbuser`
   - Password: `c3409711!` (또는 `c3409711`)
   - Default Schema: `AIRLINE` 선택

3. **`Test Connection` 클릭하여 연결 확인**

4. **`Next` 클릭**

---

## 5단계: 스키마 선택

1. **"Select Schemas to Reverse Engineer" 화면**
2. **`AIRLINE` 체크박스 선택**
   - 다른 스키마는 체크 해제
3. **`Next` 클릭**

---

## 6단계: 객체 선택

1. **"Select Objects to Reverse Engineer" 화면**
2. **"Select All" 클릭하여 모든 테이블 선택**
3. **선택된 테이블 확인 (10개):**
   - ✅ AIRPORT
   - ✅ AIRPLANE
   - ✅ AIRPLANE_TYPE
   - ✅ CAN_LAND
   - ✅ CUSTOMER
   - ✅ FARE
   - ✅ FLIGHT
   - ✅ FLIGHT_LEG
   - ✅ LEG_INSTANCE
   - ✅ SEAT_RESERVATION

4. **뷰(VIEW)는 체크 해제** (테이블만 선택)

5. **`Next` 클릭**

---

## 7단계: Reverse Engineer 실행

1. **"Reverse Engineer Options" 화면**
   - 기본 옵션 그대로 유지
2. **`Execute` 클릭**
3. **진행 상황 표시**
4. **완료되면 `Next` 클릭**

---

## 8단계: EER Diagram 확인

1. **"Reverse Engineer Results" 화면**
   - 생성된 객체 목록 확인
2. **`Finish` 클릭**
3. **EER Diagram 탭이 자동으로 열림**
   - 모든 테이블과 관계선이 표시됨

---

## 9단계: EER Diagram 정리 (선택사항)

1. **테이블 배치 조정**
   - 테이블을 드래그하여 배치
   - 관계선이 겹치지 않도록 정리

2. **확대/축소**
   - 마우스 휠로 확대/축소
   - 또는 우측 하단 슬라이더 사용

3. **전체 보기**
   - `View` > `Fit to Window` 또는 `Cmd + 0`

---

## 10단계: 스크린샷 촬영

1. **EER Diagram이 보이는 상태에서**

2. **Mac 스크린샷 방법:**
   - **방법 1: 전체 화면**
     - `Shift + Cmd + 3` (전체 화면)
     - 또는 `Shift + Cmd + 4` (영역 선택)
   - **방법 2: 특정 창**
     - `Shift + Cmd + 4` 후 `Space` 누르고 창 클릭

3. **파일 저장**
   - 기본 저장 위치: 데스크톱
   - 파일명: `10_eer_diagram.png`
   - `screenshots/` 폴더로 이동:
     ```bash
     mv ~/Desktop/10_eer_diagram.png "/Users/kimmireu/Desktop/Storage/Inha University/데이터베이스 설계/Database/assignments/final_project/screenshots/10_eer_diagram.png"
     ```

---

## 11단계: EER Diagram 저장 (선택사항)

1. **MySQL Workbench에서 EER Diagram 저장**
   - `File` > `Save Model` 또는 `Cmd + S`
   - 파일명: `airline_eer.mwb`
   - 저장 위치: 프로젝트 폴더

---

## 확인 사항

✅ **모든 테이블이 표시되는지 확인**
- AIRPORT, AIRPLANE, AIRPLANE_TYPE, CAN_LAND, CUSTOMER, FARE, FLIGHT, FLIGHT_LEG, LEG_INSTANCE, SEAT_RESERVATION (총 10개)

✅ **관계선(외래키)이 표시되는지 확인**
- 각 테이블 간의 관계선이 선으로 연결되어 있어야 함

✅ **카디널리티(1:N 등)가 표시되는지 확인**
- 관계선 끝에 1, N 등의 표시가 있어야 함

✅ **테이블 이름과 주요 컬럼이 보이는지 확인**
- 각 테이블 박스에 테이블명과 컬럼명이 표시되어야 함

✅ **스크린샷이 선명한지 확인**
- 모든 테이블과 관계선이 한 화면에 보이도록 확대/축소 조정

---

## 문제 해결

### ❌ 연결 실패 시
- MySQL 서버가 실행 중인지 확인
- 비밀번호 확인 (`c3409711!` 또는 `c3409711`)
- 포트 3306 확인

### ❌ 테이블이 안 보일 때
- AIRLINE 데이터베이스가 생성되어 있는지 확인
- `database/create_database.sql` 실행 여부 확인

### ❌ EER Diagram이 비어 있을 때
- 6단계에서 모든 테이블이 선택되었는지 확인
- Reverse Engineer를 다시 실행

---

## 📝 참고사항

- EER Diagram에서 모든 테이블과 관계선이 표시되어야 함
- 관계선의 카디널리티(1:N, N:M 등)가 표시되어야 함
- 테이블 이름과 주요 컬럼이 보여야 함
- 스크린샷은 보고서에 포함되므로 선명하게 촬영해야 함

---

## 🎯 최종 목표

`screenshots/10_eer_diagram.png` 파일이 생성되어 보고서에 포함될 수 있도록 함.
