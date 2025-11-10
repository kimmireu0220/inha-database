import express from 'express';
import { selectSql, deleteSql } from '../database/sql';

const router = express.Router();

// 학과 삭제 페이지 (모든 로그인 사용자 접근 가능)
router.get('/', async (req, res) => {
    // 권한 체크: 로그인만 확인
    if (!req.session.user || !req.session.user.checkLogin) {
        return res.redirect('/');
    }
    
    const department = await selectSql.getDepartment();
    res.render('delete', {
        title: "Delete",
        department,
    });
});

// 학과 삭제 처리 (모든 로그인 사용자 접근 가능)
router.post('/', async (req, res) => {
    // 권한 체크: 로그인만 확인
    if (!req.session.user || !req.session.user.checkLogin) {
        return res.redirect('/');
    }

    try {
        const departmentId = req.body.departmentId;
        console.log("delete department Id:", departmentId);
        
        await deleteSql.deleteDepartment(departmentId);
        
        res.redirect('/delete');
    } catch (error) {
        console.error('Error deleting department:', error);
        const errorMessage = error.message.includes('Cannot delete') 
            ? error.message 
            : '학과 삭제 중 오류가 발생했습니다. (관련된 수업이나 강의실이 있을 수 있습니다.)';
        res.send(`<script>
                    alert('${errorMessage}');
                    location.href='/delete';
                </script>`);
    }
});

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

module.exports = router;

