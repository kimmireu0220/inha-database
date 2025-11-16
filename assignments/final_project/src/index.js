import express from 'express';
import logger from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import expressSession from 'express-session';
import adminRouter from '../routes/admin.js';
import userRouter from '../routes/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();

// 미들웨어 설정
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
    expressSession({
        secret: "airline_secret_key",
        resave: true,
        saveUninitialized: true,
    })
);

// UTF-8 인코딩 설정
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    next();
});

// 뷰 엔진 설정
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));

// 라우터 설정
app.use('/admin', adminRouter);
app.use('/user', userRouter);

// 기본 라우트
app.get('/', (req, res) => {
    res.redirect('/user');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

