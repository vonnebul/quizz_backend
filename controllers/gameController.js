const db = require('../config/db');

exports.createGame = (req, res) => {
  const { userId, quizId, answers } = req.body;

  if (!userId || !quizId || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'userId, quizId et answers requis' });
  }

  db.all(
    'SELECT id, answer FROM questions WHERE quiz_id = ?',
    [quizId],
    (err, correctAnswers) => {
      if (err) return res.status(500).json({ error: err.message });

      const correctMap = {};
      correctAnswers.forEach(q => {
        correctMap[q.id] = q.answer;
      });

      let score = 0;
      answers.forEach(a => {
        if (correctMap[a.questionId] && correctMap[a.questionId] === a.answer) {
          score++;
        }
      });

      const total_questions = answers.length;
      const date_played = new Date().toISOString();

      db.run(
        'INSERT INTO games (user_id, quiz_id, score, total_questions, date_played) VALUES (?, ?, ?, ?, ?)',
        [userId, quizId, score, total_questions, date_played],
        function (err2) {
          if (err2) return res.status(500).json({ error: err2.message });

          const gameId = this.lastID;
          db.get('SELECT * FROM games WHERE id = ?', [gameId], (err3, gameRow) => {
            if (err3) return res.status(500).json({ error: err3.message });
            res.json({ game: gameRow });
          });
        }
      );
    }
  );
};

// Récupérer l’historique d’un utilisateur
exports.getUserGames = (req, res) => {
  const { userId } = req.params;
  db.all(
    `SELECT g.id, g.quiz_id, q.title AS quiz_title, g.score, g.total_questions, g.date_played
     FROM games g
     JOIN quizzes q ON g.quiz_id = q.id
     WHERE g.user_id = ?
     ORDER BY g.date_played DESC`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

// Récupérer une partie par son ID
exports.getGameById = (req, res) => {
  const { id } = req.params;

  db.get(
    `SELECT g.id, g.user_id, u.username, g.quiz_id, q.title AS quiz_title, g.score, g.total_questions, g.date_played
     FROM games g
     JOIN users u ON g.user_id = u.id
     JOIN quizzes q ON g.quiz_id = q.id
     WHERE g.id = ?`,
    [id],
    (err, gameRow) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!gameRow) return res.status(404).json({ error: 'Partie non trouvée' });
      res.json(gameRow);
    }
  );
};

// Classement global
exports.getAllGames = (req, res) => {
  db.all(
    `SELECT g.id, u.username, q.title AS quiz_title, g.score, g.total_questions, g.date_played
     FROM games g
     JOIN users u ON g.user_id = u.id
     JOIN quizzes q ON g.quiz_id = q.id
     ORDER BY g.score DESC, g.date_played DESC
     LIMIT 100`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};
