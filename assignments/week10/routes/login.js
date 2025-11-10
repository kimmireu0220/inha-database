import express from "express";
import { selectSql } from "../database/sql";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', async (req, res) => {
    const vars = req.body;
    
    try {
        // Student 테이블에서 Id(학번)와 PhoneNumber(비밀번호)로 검증
        const student = await selectSql.getStudentByLogin(vars.id, vars.password);
        
        if (student) {
            console.log('login success!');
            req.session.user = { 
                id: student.Id, 
                role: 'student', 
                checkLogin: true 
            };
            res.redirect('/select');
        } else {
            console.log('login failed!');
            res.send(`<script>
                        alert('login failed!');
                        location.href='/';
                    </script>`);
        }
    } catch (error) {
        console.error('Login error:', error);
        res.send(`<script>
                    alert('로그인 중 오류가 발생했습니다.');
                    location.href='/';
                </script>`);
    }
});

// 로그아웃
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});

module.exports = router;
