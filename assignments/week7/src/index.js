import express from 'express';
import logger from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import expressSession from 'express-session';
import homeRouter from '../routes/home.js';
import selectRouter from '../routes/select.js';
import updateRouter from '../routes/update.js';
import loginRouter from '../routes/login.js';
import deleteRouter from '../routes/delete.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();

app.use(express.static(path.join(__dirname, '/src')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
    expressSession({
        secret: "my key",
        resave: true,
        saveUninitialized: true,
    })
);

// UTF-8 인코딩 설정
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  next();
});

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use('/', loginRouter);
app.use('/home', homeRouter);
app.use('/select', selectRouter);
app.use('/update', updateRouter);
app.use('/delete', deleteRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
