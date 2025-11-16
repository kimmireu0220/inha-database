# EER Diagram 생성 가이드

## MySQL Workbench에서 EER Diagram 생성 방법

1. MySQL Workbench 실행
2. `File` > `New Model` 선택
3. `Database` > `Reverse Engineer` 선택
4. 연결 정보 입력:
   - Host: localhost
   - Port: 3306
   - Username: dbuser
   - Password: c3409711!
   - Database: AIRLINE
5. `Next` 클릭하여 진행
6. `AIRLINE` 데이터베이스 선택
7. 모든 테이블 선택
8. `Execute` 클릭하여 EER Diagram 생성
9. `File` > `Export` > `Export as PNG` 또는 `Export as PDF`로 저장

## 생성된 파일 위치

- EER Diagram 파일: `AIRLINE_EER.mwb` (MySQL Workbench 파일)
- EER Diagram 이미지: `AIRLINE_EER.png` (보고서에 포함용)

## 보고서에 포함

보고서의 "2.1.1 ERD 설계" 섹션에 EER Diagram 이미지를 포함해야 함.

