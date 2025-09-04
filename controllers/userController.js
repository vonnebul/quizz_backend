const db = require('../config/db');

exports.getUserById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(row);
  });
};