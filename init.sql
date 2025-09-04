PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS quizzes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_id INTEGER NOT NULL,
  question TEXT NOT NULL,
  choices TEXT NOT NULL, 
  answer TEXT NOT NULL,  
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  quiz_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  date_played TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

INSERT INTO quizzes (title, description) VALUES
('Quiz Culture Générale', 'Questions variées pour se chauffer les neurones'),
('Quiz Math & Logique', 'Exercices rapides de logique et maths');

INSERT INTO questions (quiz_id, question, choices, answer) VALUES
(1, 'Quelle est la capitale de la France ?', '["Paris","Londres","Berlin","Madrid"]', 'Paris'),
(1, 'Quel est l océan le plus vaste ?', '["Atlantique","Indien","Pacifique","Arctique"]', 'Pacifique'),
(1, 'Qui a peint La Joconde ?', '["Van Gogh","Picasso","Léonard de Vinci","Raphaël"]', 'Léonard de Vinci'),
(2, 'Combien font 7 × 8 ?', '["54","56","58","63"]', '56'),
(2, 'Quel nombre complète la suite : 2, 4, 8, 16, ?', '["18","24","32","34"]', '32'),
(2, 'Si f(x)=2x+1, f(3)=?', '["5","6","7","8"]', '7');
