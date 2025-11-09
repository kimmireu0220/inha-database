import express from 'express';
import { selectSql, deleteSql } from '../database/sql.js';

const router = express.Router();

// 수강취소 페이지
router.get('/class', async (req, res) => {
    // 권한 체크: 학생으로 로그인한 경우에만 접근 가능
    if (!req.session.user || !req.session.user.checkLogin || req.session.user.role !== 'student') {
        return res.redirect('/');
    }

    try {
        const studentId = req.session.user.id;
        // 해당 학생이 수강하는 수업 목록 조회
        const enrolledClasses = await selectSql.getEnrolledClasses(studentId);
        
        res.render('deleteClass', {
            title: "수강취소",
            classes: enrolledClasses,
        });
    } catch (error) {
        console.error('Error fetching enrolled classes:', error);
        res.send(`<script>
                    alert('수강 정보를 불러오는 중 오류가 발생했습니다.');
                    location.href='/select';
                </script>`);
    }
});

// 수강취소 처리
router.post('/class', async (req, res) => {
    // 권한 체크
    if (!req.session.user || !req.session.user.checkLogin || req.session.user.role !== 'student') {
        return res.redirect('/');
    }

    try {
        const studentId = req.session.user.id;
        const classId = req.body.classId;
        
        console.log("수강취소 - Student_Id:", studentId, "Class_Id:", classId);
        
        await deleteSql.deleteEnrollment(studentId, classId);
        
        res.redirect('/delete/class');
    } catch (error) {
        console.error('Error deleting enrollment:', error);
        res.send(`<script>
                    alert('수강취소 중 오류가 발생했습니다.');
                    location.href='/delete/class';
                </script>`);
    }
});

export default router;

