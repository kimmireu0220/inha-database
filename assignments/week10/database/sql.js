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
    deleteDepartment: async (data) => {
        console.log('delete department Dnumber =', data);
        const sql = `delete from department where Dnumber=${data.Dnumber}`
        console.log(sql);
        await promisePool.query(sql);
    },
    deleteEnrollment: async (studentId, classId) => {
        const sql = `delete from Enrollment where Student_Id = ${studentId} and Class_Id = ${classId}`;
        console.log(sql);
        await promisePool.query(sql);
    },
};
