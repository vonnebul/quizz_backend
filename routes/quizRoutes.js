const express = require('express');
const router = express.Router();
const { getAllQuizzes, getQuizById } = require('../controllers/quizController');

router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);

module.exports = router;
