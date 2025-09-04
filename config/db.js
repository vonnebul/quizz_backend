const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) console.error('Erreur connexion BDD:', err.message);
  else console.log('Connecté à SQLite');
});

module.exports = db;
