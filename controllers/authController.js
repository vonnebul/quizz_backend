const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config/jwt');
const SALT_ROUNDS = 10;

exports.register = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username et password requis' });
  bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
    if (err) return res.status(500).json({ error: err.message });
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function(err2) {
      if (err2) {
        if (err2.message.includes('UNIQUE')) return res.status(400).json({ error: 'username déjà utilisé' });
        return res.status(500).json({ error: err2.message });
      }
      db.get('SELECT id, username FROM users WHERE id = ?', [this.lastID], (err3, row) => {
        if (err3) return res.status(500).json({ error: err3.message });
        const token = jwt.sign({ id: row.id, username: row.username }, SECRET, { expiresIn: '2h' });
        res.json({ user: row, token });
      });
    });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username et password requis' });
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    bcrypt.compare(password, user.password, (err2, result) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (!result) return res.status(401).json({ error: 'Mot de passe incorrect' });
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '2h' });
      res.json({ user: { id: user.id, username: user.username }, token });
    });
  });
};
