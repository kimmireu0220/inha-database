# MySQL Workbench EER Diagram 생성 가이드

## 단계별 가이드

1. **MySQL Workbench 실행**
   - Applications에서 MySQLWorkbench.app 실행

2. **Reverse Engineer 시작**
   - 상단 메뉴: `Database` > `Reverse Engineer...` 선택
   - 또는 `Shift + Cmd + R` 단축키

3. **데이터베이스 연결 설정**
   - Connection Name: `AIRLINE Connection`
   - Hostname: `localhost`
   - Port: `3306`
   - Username: `dbuser`
   - Password: `c3409711!`
   - Default Schema: `AIRLINE`
   - `Store in Keychain` 체크 (선택사항)
   - `Test Connection` 클릭하여 연결 확인
   - `Next` 클릭

4. **스키마 선택**
   - `AIRLINE` 스키마 선택
   - `Next` 클릭

5. **객체 선택**
   - 모든 테이블 선택 (뷰는 제외)
   - 선택할 테이블:
     - AIRPORT
     - AIRPLANE
     - AIRPLANE_TYPE
     - CAN_LAND
     - CUSTOMER
     - FARE
     - FLIGHT
     - FLIGHT_LEG
     - LEG_INSTANCE
     - SEAT_RESERVATION
   - `Next` 클릭

6. **EER Diagram 생성**
   - `Execute` 클릭
   - EER Diagram이 자동으로 생성됨

7. **스크린샷 촬영**
   - EER Diagram 화면이 표시되면
   - 전체 화면 캡처 또는 특정 영역 캡처
   - 파일명: `10_eer_diagram.png`
   - `screenshots/` 폴더에 저장

## 참고사항

- EER Diagram에서 모든 테이블과 관계선이 표시되어야 함
- 관계선의 카디널리티(1:N, N:M 등)가 표시되어야 함
- 테이블 이름과 주요 컬럼이 보여야 함

