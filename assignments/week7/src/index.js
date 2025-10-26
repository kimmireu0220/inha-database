import express from 'express';
import logger from 'morgan';
import path from 'path';
import homeRouter from '../routes/home';
import selectRouter from '../routes/select';
import updateRouter from '../routes/update';

const PORT = 3000;
const app = express();

app.use(express.static(path.join(__dirname, '/src')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// UTF-8 인코딩 설정
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  next();
});

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use('/', homeRouter);
app.use('/select', selectRouter);
app.use('/update', updateRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
