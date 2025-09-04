const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(bodyParser.json());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const gameRoutes = require('./routes/gameRoutes');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/quizzes', quizRoutes);
app.use('/games', gameRoutes);

app.listen(PORT, () => {
  console.log(`API lancée sur http://localhost:${PORT}`);
});
