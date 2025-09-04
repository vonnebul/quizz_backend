const db = require('../config/db');

exports.createGame = (req, res) => {
  const { userId, quizId, answers } = req.body;

  if (!userId || !quizId)
    return res.status(400).json({ error: 'userId et quizId requis' });

  const date_played = new Date().toISOString();
  const total_questions = answers.length;
  const score = answers.filter(a => a.correct).length;

  db.run(
    'INSERT INTO games (user_id, quiz_id, score, total_questions, date_played) VALUES (?, ?, ?, ?, ?)',
    [userId, quizId, score, total_questions, date_played],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const gameId = this.lastID;

      if (Array.isArray(answers) && answers.length > 0) {
        let remaining = answers.length;
        answers.forEach(a => {
          db.run(
            'INSERT INTO game_answers (game_id, question_id, selected, correct) VALUES (?, ?, ?, ?)',
            [gameId, a.questionId, a.answer, a.correct ? 1 : 0],
            function (err2) {
              if (err2) console.error('Erreur insert answer:', err2.message);
              remaining--;
              if (remaining === 0) {
                db.get('SELECT * FROM games WHERE id = ?', [gameId], (err3, gameRow) => {
                  if (err3) return res.status(500).json({ error: err3.message });
                  res.json({ game: gameRow });
                });
              }
            }
          );
        });
      } else {
        db.get('SELECT * FROM games WHERE id = ?', [gameId], (err3, gameRow) => {
          if (err3) return res.status(500).json({ error: err3.message });
          res.json({ game: gameRow });
        });
      }
    }
  );
};

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

      db.all(
        `SELECT ga.question_id, ga.selected, ga.correct, qs.question, qs.choices
         FROM game_answers ga
         JOIN questions qs ON ga.question_id = qs.id
         WHERE ga.game_id = ?`,
        [id],
        (err2, answers) => {
          if (err2) return res.status(500).json({ error: err2.message });
          const ans = answers.map(a => ({
            question_id: a.question_id,
            question: a.question,
            choices: JSON.parse(a.choices),
            selected: a.selected,
            correct: !!a.correct
          }));
          res.json({ ...gameRow, answers: ans });
        }
      );
    }
  );
};

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
