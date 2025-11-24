import mysql from 'mysql2/promise';
import fs from 'fs';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'c3409711!',
  database: 'WEEK11_INHA_DB'
});

let output = '';

async function runQuery(title, query) {
  try {
    output += `\n=== ${title} ===\n\n`;
    output += `${query}\n\n`;
    
    const [rows] = await connection.execute(query);
    
    if (Array.isArray(rows) && rows.length > 0) {
      // 테이블 형식으로 출력
      const keys = Object.keys(rows[0]);
      output += keys.join('\t') + '\n';
      output += '-'.repeat(80) + '\n';
      
      rows.slice(0, 20).forEach(row => {
        output += keys.map(k => row[k] || 'NULL').join('\t') + '\n';
      });
      
      if (rows.length > 20) {
        output += `... (총 ${rows.length}개 행)\n`;
      }
    } else {
      output += JSON.stringify(rows, null, 2) + '\n';
    }
    output += '\n';
  } catch (error) {
    output += `ERROR: ${error.message}\n\n`;
  }
}

try {
  // STEP 2: 인덱스 적용 전 조사
  output += '========================================\n';
  output += 'STEP 2: 인덱스 적용 전 조사\n';
  output += '========================================\n';
  
  await runQuery('1. 데이터 개수 확인', 'SELECT COUNT(*) AS total_students FROM Student');
  
  await runQuery('2. SHOW INDEX (인덱스 적용 전)', 'SHOW INDEX FROM Student');
  
  await runQuery('3. EXPLAIN - StudentId 조회', 'EXPLAIN SELECT * FROM Student WHERE StudentId = 12201560');
  
  await runQuery('4. EXPLAIN - Sname 조회', "EXPLAIN SELECT * FROM Student WHERE Sname = '김민준'");
  
  await runQuery('5. EXPLAIN - Semail 조회', "EXPLAIN SELECT * FROM Student WHERE Semail LIKE '%@inha.ac.kr' LIMIT 1");
  
  await runQuery('6. EXPLAIN - Did 조회', 'EXPLAIN SELECT * FROM Student WHERE Did = 1 LIMIT 10');
  
  // STEP 3: 인덱스 생성
  output += '\n========================================\n';
  output += 'STEP 3: 인덱스 생성\n';
  output += '========================================\n';
  
  try {
    await connection.execute('CREATE INDEX idx_sname ON Student(Sname) USING BTREE');
    output += '✓ idx_sname 인덱스 생성 완료\n';
  } catch (e) {
    output += `idx_sname: ${e.message}\n`;
  }
  
  try {
    await connection.execute('CREATE INDEX idx_semail ON Student(Semail) USING BTREE');
    output += '✓ idx_semail 인덱스 생성 완료\n';
  } catch (e) {
    output += `idx_semail: ${e.message}\n`;
  }
  
  try {
    await connection.execute('CREATE INDEX idx_sphonenum ON Student(Sphonenum) USING BTREE');
    output += '✓ idx_sphonenum 인덱스 생성 완료\n';
  } catch (e) {
    output += `idx_sphonenum: ${e.message}\n`;
  }
  
  try {
    await connection.execute('CREATE INDEX idx_did ON Student(Did) USING BTREE');
    output += '✓ idx_did 인덱스 생성 완료\n';
  } catch (e) {
    output += `idx_did: ${e.message}\n`;
  }
  
  try {
    await connection.execute('CREATE INDEX idx_did_sname ON Student(Did, Sname) USING BTREE');
    output += '✓ idx_did_sname 복합 인덱스 생성 완료\n';
  } catch (e) {
    output += `idx_did_sname: ${e.message}\n`;
  }
  
  try {
    await connection.execute('CREATE INDEX idx_studentid_email ON Student(StudentId, Semail) USING BTREE');
    output += '✓ idx_studentid_email 복합 인덱스 생성 완료\n';
  } catch (e) {
    output += `idx_studentid_email: ${e.message}\n`;
  }
  
  // STEP 3: 인덱스 적용 후 조사
  output += '\n========================================\n';
  output += 'STEP 3: 인덱스 적용 후 조사\n';
  output += '========================================\n';
  
  await runQuery('1. SHOW INDEX (인덱스 적용 후)', 'SHOW INDEX FROM Student');
  
  await runQuery('2. EXPLAIN - StudentId 조회 (인덱스 적용 후)', 'EXPLAIN SELECT * FROM Student WHERE StudentId = 12201560');
  
  await runQuery('3. EXPLAIN - Sname 조회 (인덱스 적용 후)', "EXPLAIN SELECT * FROM Student WHERE Sname = '김민준'");
  
  await runQuery('4. EXPLAIN - Semail 조회 (인덱스 적용 후)', "EXPLAIN SELECT * FROM Student WHERE Semail LIKE '%@inha.ac.kr' LIMIT 1");
  
  await runQuery('5. EXPLAIN - Did 조회 (인덱스 적용 후)', 'EXPLAIN SELECT * FROM Student WHERE Did = 1 LIMIT 10');
  
  await runQuery('6. EXPLAIN - 복합 조건 (Did + Sname)', "EXPLAIN SELECT * FROM Student WHERE Sname = '김민준' AND Did = 1");
  
  // 결과 저장
  fs.writeFileSync('query_results.txt', output);
  console.log('쿼리 실행 결과가 query_results.txt에 저장되었습니다.');
  
} catch (error) {
  console.error('Error:', error.message);
} finally {
  await connection.end();
}




