import express from 'express';
import { ApplyQuery } from '../database/sql';

const router = express.Router();

// GET: 초기 페이지
router.get('/', (_req, res) => {
  res.render('home', { data: [] });
});

// POST: 쿼리 실행
router.post('/', async (req, res) => {
  const vars = req.body;
  const data = { Query: vars.Query };
  let all_data = [];

  try {
    const result = await ApplyQuery.applyquery(data.Query);
    all_data.push('Query: ');
    all_data.push(data.Query);
    all_data.push('Result:');
    for (let i = 0; i < result.length; i++) {
      all_data.push(JSON.stringify(result[i]));
    }
  } catch (error) {
    all_data.push(`${data.Query} is not a query, or there is an error.`);
  }

  res.render('home', { data: all_data });
});

module.exports = router;

