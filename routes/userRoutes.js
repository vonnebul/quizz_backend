const express = require('express');
const router = express.Router();
const {
  getUserById,
} = require('../controllers/userController');
const { verifyToken } = require ('../middlewares/authMiddleware')

router.get('/:id', verifyToken, getUserById);


module.exports = router;
