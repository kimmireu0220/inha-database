import mysql from 'mysql2';
require("dotenv").config();

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'dbuser',
  password: 'c3409711!',
  database: 'inha_week5',
  charset: 'utf8mb4',
  collation: 'utf8mb4_unicode_ci',
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  multipleStatements: false,
  supportBigNumbers: true,
  bigNumberStrings: true,
});

const promisePool = pool.promise();

export const ApplyQuery = {
  applyquery: async (Query) => {
    try {
      // 문자셋 설정
      await promisePool.query('SET NAMES utf8mb4');
      const sql = Query;
      const [result] = await promisePool.query(sql);
      return result;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },
};