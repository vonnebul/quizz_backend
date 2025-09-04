const db = require('../config/db');

exports.getAllQuizzes = (req, res) => {
  db.all('SELECT id, title, description FROM quizzes', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getQuizById = (req, res) => {
  const { id } = req.params;

  db.get('SELECT id, title, description FROM quizzes WHERE id = ?', [id], (err, quiz) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!quiz) return res.status(404).json({ error: 'Quiz non trouvé' });

    db.all('SELECT id, question, choices FROM questions WHERE quiz_id = ?', [id], (err2, questions) => {
      if (err2) return res.status(500).json({ error: err2.message });
      const qs = questions.map(q => ({ ...q, choices: JSON.parse(q.choices) }));
      res.json({ ...quiz, questions: qs });
    });
  });
};
