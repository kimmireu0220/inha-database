import mysql from "mysql2";
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool(
  process.env.JAWSDB_URL ?? {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_NAME || 'WEEK11_INHA_DB',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }
);

// async / await 사용
const promisePool = pool.promise();

// select query
export const selectSql = {
  getUsers: async () => {
    const [rows] = await promisePool.query(`select * from student`);
    return rows;
  },
  
  // StudentId로 Student의 ID 조회
  getStudentIdByStudentId: async (studentId) => {
    const [rows] = await promisePool.query(
      `select Id from Student where StudentId=${studentId}`
    );
    return rows[0] ? rows[0].Id : null;
  },
  
  // 이미 수강신청한 수업 목록 조회 (Course completion list)
  getEnrolledClasses: async (studentId) => {
    const [rows] = await promisePool.query(`
      select 
        c.ID,
        c.Name as Course,
        c.Professor,
        d.Did as Opening_departments,
        c.Number_of_participant
      from Class c
      inner join class_student cs on c.ID = cs.Class_Id
      inner join Student s on cs.Student_Id = s.ID
      inner join Department d on c.Did = d.ID
      where s.StudentId = ${studentId}
    `);
    return rows;
  },
  
  // 모든 수업 목록 조회 (Remaining participants 포함)
  getAllClasses: async () => {
    const [rows] = await promisePool.query(`
      select 
        c.ID,
        c.Name as Course,
        c.Professor,
        d.Did as Opening_departments,
        c.Number_of_participant,
        (c.Number_of_participant - COALESCE(enrolled_count.count, 0)) as Remaining_participants
      from Class c
      inner join Department d on c.Did = d.ID
      left join (
        select Class_Id, COUNT(*) as count
        from class_student
        group by Class_Id
      ) enrolled_count on c.ID = enrolled_count.Class_Id
    `);
    return rows;
  },
  
  // 특정 수업의 Remaining participants 확인
  checkRemainingParticipants: async (classId) => {
    const [rows] = await promisePool.query(`
      select 
        c.Number_of_participant,
        (c.Number_of_participant - COALESCE(enrolled_count.count, 0)) as Remaining_participants
      from Class c
      left join (
        select Class_Id, COUNT(*) as count
        from class_student
        where Class_Id = ${classId}
        group by Class_Id
      ) enrolled_count on c.ID = enrolled_count.Class_Id
      where c.ID = ${classId}
    `);
    return rows[0] ? rows[0].Remaining_participants : 0;
  },
  
  // 이미 수강신청했는지 확인
  checkAlreadyEnrolled: async (studentId, classId) => {
    const studentDbId = await selectSql.getStudentIdByStudentId(studentId);
    if (!studentDbId) return false;
    
    const [rows] = await promisePool.query(`
      select * from class_student
      where Student_Id = ${studentDbId} and Class_Id = ${classId}
    `);
    return rows.length > 0;
  }
}

export const createSql = {
  // 수강신청 추가
  addClass: async (data) => {
    const studentDbId = await selectSql.getStudentIdByStudentId(data.sId);
    if (!studentDbId) {
      throw new Error('Student not found');
    }
    
    const [results] = await promisePool.query(
      `insert into class_student (Student_Id, Class_Id) values (${studentDbId}, ${data.cId})`
    );
    return results;
  }
}

