#!/bin/bash

# 환경 변수에서 비밀번호 읽기
source .env

# MySQL 비밀번호를 환경 변수로 설정 (명령어에 노출되지 않음)
export MYSQL_PWD="$DB_PASSWORD"

echo "=========================================="
echo "쿼리 실행 시간 측정 (인덱스 적용 후)"
echo "=========================================="
echo ""

echo "=== 쿼리 1: StudentId 조회 ==="
time mysql -u "$DB_USER" "$DB_NAME" -e "SELECT * FROM Student WHERE StudentId = 12201560;" 2>&1 | grep -v "Warning"
echo ""

echo "=== 쿼리 2: Sname 조회 ==="
time mysql -u "$DB_USER" "$DB_NAME" -e "SELECT * FROM Student WHERE Sname = '김민준';" 2>&1 | grep -v "Warning"
echo ""

echo "=== 쿼리 3: Semail 조회 ==="
time mysql -u "$DB_USER" "$DB_NAME" -e "SELECT * FROM Student WHERE Semail = 'test@inha.ac.kr';" 2>&1 | grep -v "Warning"
echo ""

echo "=== 쿼리 4: Sphonenum 조회 ==="
time mysql -u "$DB_USER" "$DB_NAME" -e "SELECT * FROM Student WHERE Sphonenum = '01012345678';" 2>&1 | grep -v "Warning"
echo ""

echo "=== 쿼리 5: Did 조회 ==="
time mysql -u "$DB_USER" "$DB_NAME" -e "SELECT * FROM Student WHERE Did = 1 LIMIT 10;" 2>&1 | grep -v "Warning"
echo ""

echo "=========================================="
echo "측정 완료"
echo "=========================================="

