import express from 'express';
import { selectSql } from '../database/sql.js';

const router = express.Router();

router.get('/', async (req, res) => {
    // 권한 체크: 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    if (!req.session.user || !req.session.user.checkLogin) {
        return res.redirect('/');
    }

    // 로그인한 학생의 정보만 조회
    const studentId = req.session.user.id;
    const Student = await selectSql.getStudentById(studentId);
    
    // 전체 테이블 정보도 조회 (기존 기능 유지)
    const Building = await selectSql.getBuilding();
    const Department = await selectSql.getDepartment();
    const Room = await selectSql.getRoom();
    const Class = await selectSql.getClass();

    // 학생 정보를 배열로 변환 (템플릿 호환성)
    const StudentArray = Student ? [Student] : [];

    res.render('select', {
        main_title: "Tables in InhaDB",
        title1: "Building",
        title2: "Department",
        title3: "Room",
        title4: "Student (내 정보)",
        title5: "Class",
        Building,
        Department,
        Room,
        Student: StudentArray,
        Class,
    })
})

export default router;
