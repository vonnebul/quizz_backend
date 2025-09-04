const express = require('express');
const router = express.Router();
const {
  createGame,
  getUserGames,
  getGameById,
  getAllGames
} = require('../controllers/gameController');
const { verifyToken } = require('../middlewares/authMiddleware');


router.post('/', verifyToken, createGame);
router.get('/user/:userId', verifyToken, getUserGames);
router.get('/:id', verifyToken, getGameById);
router.get('/', getAllGames);

module.exports = router;
