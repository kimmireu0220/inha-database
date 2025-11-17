-- MySQL 사용자 생성 및 데이터베이스 설정
-- 실행: mysql -u root -p < create_db_and_user.sql

-- 사용자 생성 (이미 있으면 무시)
CREATE USER IF NOT EXISTS 'dbuser'@'localhost' IDENTIFIED BY 'c3409711!';
GRANT ALL PRIVILEGES ON *.* TO 'dbuser'@'localhost';
FLUSH PRIVILEGES;

-- 데이터베이스 생성
SOURCE database/create_database.sql;
