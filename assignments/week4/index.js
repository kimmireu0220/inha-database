import express from "express";
import bodyParser from "body-parser";
import path from 'path';
import sql from './sql';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 기본 라우트 - 모든 사원 정보
app.get("/", async (req, res)=>{
    const employee = await sql.getEmployee();
    res.json({"Employee": employee})
});

// 1. Corporate branch 사원들의 급여 정보 (10% 증가)
app.get("/corporate", async (req, res)=>{
    const result = await sql.getCorporateEmployees();
    res.json({"Corporate Employees with 10% Salary Increase": result[0]})
});

// 2. 급여 60,000-80,000 사이의 남자 사원들
app.get("/male-salary", async (req, res)=>{
    const result = await sql.getMaleEmployeesBySalary();
    res.json({"Male Employees with Salary 60,000-80,000": result[0]})
});

// 3. branch_id 내림차순, 급여 오름차순으로 정렬된 모든 사원
app.get("/sorted", async (req, res)=>{
    const result = await sql.getAllEmployeesSorted();
    res.json({"All Employees Sorted by Branch ID (DESC) and Salary (ASC)": result[0]})
});

// 4. FedEx와 일하는 급여 60,000 이상 사원들
app.get("/fedex", async (req, res)=>{
    const result = await sql.getFedExEmployees();
    res.json({"FedEx Employees with Salary >= 60,000": result[0]})
});

// 5. 급여 통계 (합계, 최고, 최저, 평균)
app.get("/salary-stats", async (req, res)=>{
    const result = await sql.getSalaryStatistics();
    res.json({"Salary Statistics": result[0]})
});

// 6. 총 사원수
app.get("/total-count", async (req, res)=>{
    const result = await sql.getTotalEmployeeCount();
    res.json({"Total Employee Count": result[0]})
});

// 7. branch별 사원수
app.get("/branch-count", async (req, res)=>{
    const result = await sql.getEmployeeCountByBranch();
    res.json({"Employee Count by Branch": result[0]})
});

app.listen(3000, ()=>{
    console.log("Server is running on port 3000.");
})
