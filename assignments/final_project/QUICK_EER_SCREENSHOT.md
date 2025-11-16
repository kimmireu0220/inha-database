# MySQL Workbench EER Diagram 스크린샷 빠른 가이드

## 빠른 실행 방법

1. **MySQL Workbench 열기**
   ```bash
   open -a MySQLWorkbench
   ```

2. **Reverse Engineer 실행**
   - `Database` > `Reverse Engineer...` (또는 `Shift + Cmd + R`)
   - 연결 정보 입력:
     - Host: localhost
     - Port: 3306
     - Username: dbuser
     - Password: c3409711!
     - Schema: AIRLINE
   - 모든 테이블 선택
   - `Execute` 클릭

3. **EER Diagram 스크린샷 촬영**
   - EER Diagram이 표시되면
   - `Cmd + Shift + 4` (Mac 스크린샷 도구)
   - 또는 터미널에서:
     ```bash
     screencapture -x screenshots/10_eer_diagram.png
     ```

## 또는 자동화 스크립트 사용

터미널에서 다음 명령어 실행:
```bash
cd "/Users/kimmireu/Desktop/Storage/Inha University/데이터베이스 설계/Database/assignments/final_project"
open -a MySQLWorkbench
# MySQL Workbench에서 수동으로 Reverse Engineer 실행 후
# EER Diagram이 표시되면 스크린샷 촬영
```

