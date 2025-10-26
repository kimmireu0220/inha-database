# Week 7 핵심 코드 스니펫

## 1. 데이터베이스 연결 설정 (database/sql.js)

```javascript
import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'c3409711',
    database: 'InhaDB',
    charset: 'utf8mb4',
    connectionLimit: 10
});

const promisePool = pool.promise();
```

## 2. SELECT 쿼리 함수들

```javascript
export const selectSql = {
    getBuilding: async () => {
        const sql = `select * from building`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getDepartment: async () => {
        const sql = `select * from department`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getRoom: async () => {
        const sql = `select * from room`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getStudent: async () => {
        const sql = `select * from Student`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getClass: async () => {
        const sql = `select * from Class`;
        const [result] = await promisePool.query(sql);
        return result;
    }
};
```

## 3. INSERT 쿼리 함수

```javascript
export const insertSql = {
    setStudent: async (data) => {
        const sql = `insert into student (Id, Name, Email, Phone_number, Major) values (
            ${data.Id}, "${data.Name}", "${data.Email}", 
            "${data.PhoneNumber}", "${data.Major}"
        )`;
        console.log(data);
        await promisePool.query(sql);
    }
};
```

## 4. UPDATE 쿼리 함수들

```javascript
export const updateSql = {
    updateStudent: async (data) => {
        console.log(data);
        const sql = `
            UPDATE Student 
            SET Id = ${data.Id}, Name = "${data.Name}", 
                Email = "${data.Email}", PhoneNumber = "${data.PhoneNumber}",
                Major = "${data.Major}"
            WHERE Id = ${data.Id}`;
        console.log(sql);
        await promisePool.query(sql);
    },
    updateDepartment: async (data) => {
        console.log(data);
        const sql = `
            UPDATE Department 
            SET Id = ${data.Id}, Name = "${data.Name}", 
                Email = "${data.Email}", Phone_number = "${data.PhoneNumber}"
            WHERE Id = ${data.Id}`;
        console.log(sql);
        await promisePool.query(sql);
    }
};
```

## 5. Express 서버 설정 (src/index.js)

```javascript
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
```

## 6. 라우터 예시 (routes/home.js)

```javascript
import express from 'express';
import { insertSql } from '../database/sql';

const router = express.Router();

router.get('/', (_req, res) => {
    res.render('home', {
        main_title: "INSERT 'Student' table",
    });
});

router.post('/', async (req, res) => {
    const vars = req.body;
    const data = {
        Id: vars.id,
        Name: vars.name,
        Email: vars.email,
        PhoneNumber: vars.phonenumber,
        Major: vars.major,
    }
    await insertSql.setStudent(data);

    res.redirect('/');
})

module.exports = router;
```

## 7. Handlebars 템플릿 예시 (views/home.hbs)

```html
<h1>{{main_title}}</h1>

<form method="post">
    <div>
        <label for="id">Id:</label>
        <input type="number" id="id" name="id" required>
    </div>
    <div>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
    </div>
    <div>
        <label for="email">E-mail:</label>
        <input type="email" id="email" name="email" required>
    </div>
    <div>
        <label for="phonenumber">Phone Number:</label>
        <input type="text" id="phonenumber" name="phonenumber" required>
    </div>
    <div>
        <label for="major">Major:</label>
        <input type="text" id="major" name="major" required>
    </div>
    <div>
        <input type="submit" value="insert">
    </div>
</form>
```
