import mysql from 'mysql2';

import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'c3409711',
    database: 'InhaDB',
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

// select query
export const selectSql = {
    getBuilding: async () => {
        const sql = `select * from building`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getDepartment: async () => {
        const sql = `select * from department`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getRoom: async () => {
        const sql = `select * from room`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getStudent: async () => {
        const sql = `select * from Student`;
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
        const sql = `select * from Student where Id = ${id} and Phone_number = "${phoneNumber}"`;
        const [result] = await promisePool.query(sql);
        return result[0];
    },
    getEnrolledClasses: async (studentId) => {
        const sql = `
            select c.Id, c.Name, c.Professor, c.Number_of_participants
            from Class c
            inner join Enrollment e on c.Id = e.Class_Id
            where e.Student_Id = ${studentId}
        `;
        const [result] = await promisePool.query(sql);
        return result;
    },
}

// insert query
export const insertSql = {
    setStudent: async (data) => {
        const sql = `insert into Student (Id, Name, Email, PhoneNumber, Major) values (
            ${data.Id}, "${data.Name}", "${data.Email}", 
            "${data.PhoneNumber}", "${data.Major}"
        )`
        console.log(data);
        await promisePool.query(sql);
    },
};

// update query
export const updateSql = {
    updateStudent: async (data) => {
        console.log(data);
        const sql = `
            UPDATE Student 
            SET Id = ${data.Id}, Name = "${data.Name}", 
                Email = "${data.Email}", PhoneNumber = "${data.PhoneNumber}",
                Major = "${data.Major}"
            WHERE Id = ${data.Id}`;
        console.log(sql);
        await promisePool.query(sql);
    },
    updateDepartment: async (data) => {
        console.log(data);
        const sql = `
            UPDATE Department 
            SET Id = ${data.Id}, Name = "${data.Name}", 
                Email = "${data.Email}", Phone_number = "${data.PhoneNumber}"
            WHERE Id = ${data.Id}`;
        console.log(sql);
        await promisePool.query(sql);
    },
};

// delete query
export const deleteSql = {
    deleteEnrollment: async (studentId, classId) => {
        const sql = `delete from Enrollment where Student_Id = ${studentId} and Class_Id = ${classId}`;
        console.log(sql);
        await promisePool.query(sql);
    },
};
