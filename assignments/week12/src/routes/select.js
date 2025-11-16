import express from "express";
import { selectSql, createSql } from "../database/sql";

const router = express.Router();

// 수강신청 페이지 (GET)
router.get('/', async function (req, res) {
    // 로그인 체크
    if (!req.cookies.user) {
        return res.redirect('/');
    }
    
    try {
        const studentId = req.cookies.user;
        
        // 이미 수강신청한 수업 목록 (Course completion list)
        const enrolledClasses = await selectSql.getEnrolledClasses(studentId);
        
        // 모든 수업 목록 (Remaining participants 포함)
        const allClasses = await selectSql.getAllClasses();
        
        res.render('select', { 
            user: studentId,
            title: "Course completion list",
            title2: "Available courses",
            classes: enrolledClasses,
            allClass: allClasses
        });
    } catch (error) {
        console.error('Error in select GET:', error);
        res.send(`<script>
                    alert('수강신청 페이지를 불러오는 중 오류가 발생했습니다.');
                    location.href='/';
                </script>`);
    }
});

// 수강신청 처리 (POST)
router.post('/', async(req, res) => {
    // 로그인 체크
    if (!req.cookies.user) {
        return res.redirect('/');
    }
    
    try {
        const studentId = req.cookies.user;
        const classId = req.body.applyBtn;
        
        if (!classId) {
            return res.send(`<script>
                        alert('수업 정보가 올바르지 않습니다.');
                        location.href='/sugang';
                    </script>`);
        }
        
        // 제약 조건 1: 이미 수강신청한 수업인지 확인
        const alreadyEnrolled = await selectSql.checkAlreadyEnrolled(studentId, classId);
        if (alreadyEnrolled) {
            return res.send(`<script>
                        alert('이미 수강신청한 수업입니다.');
                        location.href='/sugang';
                    </script>`);
        }
        
        // 제약 조건 2: Remaining participants가 0인지 확인
        const remainingParticipants = await selectSql.checkRemainingParticipants(classId);
        if (remainingParticipants <= 0) {
            return res.send(`<script>
                        alert('수강 인원이 마감되었습니다.');
                        location.href='/sugang';
                    </script>`);
        }
        
        // 수강신청 처리
        const data = {
            cId: classId,
            sId: studentId,
        };
        
        await createSql.addClass(data);
        
        // 성공 시 수강신청 페이지로 리다이렉트
        res.redirect('/sugang');
    } catch (error) {
        console.error('Error in select POST:', error);
        res.send(`<script>
                    alert('수강신청 중 오류가 발생했습니다: ${error.message}');
                    location.href='/sugang';
                </script>`);
    }
});

module.exports = router;