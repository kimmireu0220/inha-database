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
