import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'dbuser',
    password: 'c3409711!',
    database: 'week3_company',
})

const promisePool = pool.promise();

const sql = {
    // 1. 'Corporate' branch에 해당하는 모든 사원의 이름, 기존 급여, 10% 증가된 급여를 출력
    getCorporateEmployees: async()=>{
        const results = await promisePool.query(`
        SELECT e.first_name, e.last_name, e.salary, 
               ROUND(e.salary * 1.1, 2) as increased_salary
        FROM employee e
        JOIN branch b ON e.branch_id = b.branch_id
        WHERE b.branch_name = 'Corporate'
        `)
        return results;
    },

    // 2. 급여가 60,000에서 80,000 사이에 있는 모든 남자 사원의 이름, 급여를 출력
    getMaleEmployeesBySalary: async()=>{
        const results = await promisePool.query(`
        SELECT first_name, last_name, salary
        FROM employee
        WHERE sex = 'M' AND salary BETWEEN 60000 AND 80000
        `)
        return results;
    },

    // 3. 모든 사원을 1. branch_id(내림차순) 2. 급여(오름차순)으로 정렬하고, 이름, branch_id, 급여를 출력
    getAllEmployeesSorted: async()=>{
        const results = await promisePool.query(`
        SELECT first_name, last_name, branch_id, salary
        FROM employee
        ORDER BY branch_id DESC, salary ASC
        `)
        return results;
    },

    // 4. 'FedEx'와 일하는 급여 60,000 이상의 모든 사원의 이름, total_sales를 출력
    getFedExEmployees: async()=>{
        const results = await promisePool.query(`
        SELECT e.first_name, e.last_name, w.total_sales
        FROM employee e
        JOIN works_with w ON e.emp_id = w.emp_id
        JOIN client c ON w.client_id = c.client_id
        WHERE c.client_name = 'FedEx' AND e.salary >= 60000
        `)
        return results;
    },

    // 5. 사원의 급여의 합, 최고 급여, 최저 급여, 평균 급여를 출력
    getSalaryStatistics: async()=>{
        const results = await promisePool.query(`
        SELECT 
            SUM(salary) as total_salary,
            MAX(salary) as max_salary,
            MIN(salary) as min_salary,
            ROUND(AVG(salary), 2) as avg_salary
        FROM employee
        `)
        return results;
    },

    // 6. 회사의 총 사원수를 제시
    getTotalEmployeeCount: async()=>{
        const results = await promisePool.query(`
        SELECT COUNT(*) as total_employees
        FROM employee
        `)
        return results;
    },

    // 7. 각 branch별 근무하는 사원의 수를 검색하여 branch 이름과 소속 사원수를 출력
    getEmployeeCountByBranch: async()=>{
        const results = await promisePool.query(`
        SELECT b.branch_name, COUNT(e.emp_id) as employee_count
        FROM branch b
        LEFT JOIN employee e ON b.branch_id = e.branch_id
        GROUP BY b.branch_id, b.branch_name
        ORDER BY b.branch_id
        `)
        return results;
    },

    getEmployee: async()=>{
        const results = await promisePool.query(`
        select * from employee
        `)
        return results;
    },
};

export default sql;
