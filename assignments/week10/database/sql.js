import mysql from 'mysql2';

require("dotenv").config();

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'c3409711!',
    database: 'InhaDB',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
});

const promisePool = pool.promise();

export const selectSql = {
    getUser: async () => {
        const sql = `select * from user`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getDepartment: async () => {
        const sql = `select * from department`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getBuilding: async () => {
        const sql = `select * from building`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getRoom: async () => {
        const sql = `select * from room`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getClass: async () => {
        const sql = `select * from Class`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getStudentById: async (id) => {
        const sql = `select * from Student where Id = ${id}`;
        const [result] = await promisePool.query(sql);
        return result[0];
    },
    getStudentByLogin: async (id, phoneNumber) => {
        const sql = `select * from Student where Id = ${id} and PhoneNumber = "${phoneNumber}"`;
        const [result] = await promisePool.query(sql);
        return result[0];
    },
    getEnrolledClasses: async (studentId) => {
        const sql = `
            select c.Id, c.Name, c.Professor, c.Number_of_participants, c.Department_Id, c.Room_Id
            from Class c
            inner join Enrollment e on c.Id = e.Class_Id
            where e.Student_Id = ${studentId}
        `;
        const [result] = await promisePool.query(sql);
        return result;
    },
}

export const deleteSql = {
    deleteDepartment: async (departmentId) => {
        console.log('delete department Id =', departmentId);
        
        // 관련 데이터 먼저 삭제 (CASCADE 삭제)
        // 1. 관련 Enrollment 삭제 (Class를 삭제하기 전에)
        const deleteEnrollmentSql = `
            DELETE e FROM Enrollment e
            INNER JOIN Class c ON e.Class_Id = c.Id
            WHERE c.Department_Id = ${departmentId}
        `;
        await promisePool.query(deleteEnrollmentSql);
        console.log('Deleted related enrollments');
        
        // 2. 관련 Class 삭제
        const deleteClassSql = `DELETE FROM Class WHERE Department_Id = ${departmentId}`;
        await promisePool.query(deleteClassSql);
        console.log('Deleted related classes');
        
        // 3. 관련 Room 삭제
        const deleteRoomSql = `DELETE FROM Room WHERE Department_Id = ${departmentId}`;
        await promisePool.query(deleteRoomSql);
        console.log('Deleted related rooms');
        
        // 4. 마지막으로 Department 삭제
        const sql = `DELETE FROM Department WHERE Id = ${departmentId}`;
        console.log(sql);
        await promisePool.query(sql);
    },
    deleteEnrollment: async (studentId, classId) => {
        const sql = `delete from Enrollment where Student_Id = ${studentId} and Class_Id = ${classId}`;
        console.log(sql);
        await promisePool.query(sql);
    },
};
