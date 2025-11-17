-- MySQL 사용자 생성 및 데이터베이스 설정 스크립트
-- 실행 방법: mysql -u root -p < setup_mysql_user.sql

-- 기존 사용자 삭제 (있는 경우)
DROP USER IF EXISTS 'dbuser'@'localhost';

-- 사용자 생성
CREATE USER 'dbuser'@'localhost' IDENTIFIED BY 'c3409711!';

-- 권한 부여
GRANT ALL PRIVILEGES ON *.* TO 'dbuser'@'localhost' WITH GRANT OPTION;

-- 권한 새로고침
FLUSH PRIVILEGES;

-- 데이터베이스 생성
DROP DATABASE IF EXISTS AIRLINE;
CREATE DATABASE AIRLINE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 사용자에게 데이터베이스 권한 부여
GRANT ALL PRIVILEGES ON AIRLINE.* TO 'dbuser'@'localhost';

-- 권한 새로고침
FLUSH PRIVILEGES;

SELECT 'MySQL 사용자 및 데이터베이스 생성 완료!' AS Result;

