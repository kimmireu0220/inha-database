#!/bin/bash

# MySQL 데이터베이스 설정 스크립트

echo "=== AIRLINE 데이터베이스 설정 시작 ==="

# MySQL root 비밀번호 입력 요청
read -sp "MySQL root 비밀번호를 입력하세요: " ROOT_PASSWORD
echo ""

# MySQL 사용자 생성 (이미 존재하면 무시)
mysql -u root -p"$ROOT_PASSWORD" <<EOF 2>/dev/null || mysql -u root -p"$ROOT_PASSWORD" <<EOF
CREATE USER IF NOT EXISTS 'dbuser'@'localhost' IDENTIFIED BY 'c3409711!';
GRANT ALL PRIVILEGES ON *.* TO 'dbuser'@'localhost';
FLUSH PRIVILEGES;
EOF

# 데이터베이스 생성
echo "데이터베이스 생성 중..."
mysql -u dbuser -p'c3409711!' < database/create_database.sql

if [ $? -eq 0 ]; then
    echo "✅ 데이터베이스 생성 완료!"
else
    echo "❌ 데이터베이스 생성 실패. 수동으로 실행해주세요:"
    echo "mysql -u dbuser -p < database/create_database.sql"
fi

