# Quiz API – Node.js / SQLite / Express

> ⚠️ Projet à but éducatif pour apprendre VueJS / NodeJS / SQLite / Express.
> La sécurité n’est pas complète : pas de variable d’environnement pour le JWT ou le port, à ne pas utiliser en production.

---

## 1️⃣ Installation et lancement

1. Cloner le projet :

```bash
git clone <URL_DU_REPO>
cd quiz-api
```

2. Installer les dépendances :

```bash
npm install
```

3. Créer la base SQLite et insérer les données d’exemple :

```bash
sqlite3 db.sqlite
.read ./init.sql
```

4. Lancer le serveur :

```bash
node index.js
```

> Le serveur écoute par défaut sur `http://localhost:8000`

---

## 2️⃣ Architecture du projet

```
quiz-api/
 ├─ config/
 │   └─ db.js               # Connexion unique à SQLite
 ├─ controllers/            # Logique métier
 │   ├─ authController.js
 │   ├─ userController.js
 │   ├─ quizController.js
 │   └─ gameController.js
 ├─ routes/                 # Définition des routes
 │   ├─ authRoutes.js
 │   ├─ userRoutes.js
 │   ├─ quizRoutes.js
 │   └─ gameRoutes.js
 ├─ middlewares/
 │   └─ authMiddleware.js   # Vérification JWT
 ├─ db.sqlite
 ├─ init.sql
 ├─ index.js
 └─ package.json
```

---

## 3️⃣ Informations importantes

* Les mots de passe sont **hashés avec bcrypt**.
* L’authentification se fait avec **JWT** : les routes sensibles nécessitent un token dans l’en-tête `Authorization: Bearer <token>`.
* ⚠️ Sécurité minimale : le secret JWT et le port sont codés en dur. Pour une utilisation réelle, utiliser des **variables d’environnement**.

---

## 4️⃣ Routes disponibles

### 4.1 Authentification

| Route          | Méthode | Description                                        | Body                                         |
| -------------- | ------- | -------------------------------------------------- | -------------------------------------------- |
| /auth/register | POST    | Inscription d’un utilisateur, renvoie le token JWT | `{ "username": "user", "password": "pass" }` |
| /auth/login    | POST    | Connexion d’un utilisateur, renvoie le token JWT   | `{ "username": "user", "password": "pass" }` |

---

### 4.2 Utilisateurs

| Route             | Méthode | Description                             | Protégé |
| ----------------- | ------- | --------------------------------------- | ------- |
| /users/\:id       | GET     | Récupérer un utilisateur                | ✅       |

---

### 4.3 Quiz

| Route         | Méthode | Description                                                | Protégé |
| ------------- | ------- | ---------------------------------------------------------- | ------- |
| /quizzes      | GET     | Liste des quizzes disponibles                              | ❌       |
| /quizzes/\:id | GET     | Détails d’un quiz et ses questions (sans la bonne réponse) | ❌       |

---

### 4.4 Parties / Games

| Route                | Méthode | Description                                   | Protégé |
| -------------------- | ------- | --------------------------------------------- | ------- |
| /games               | POST    | Enregistrer une partie avec score et réponses | ✅       |
| /games               | GET     | Classement global (top 100)                   | ❌       |
| /games/\:id          | GET     | Détail d’une partie (questions + réponses)    | ✅       |
| /games/user/\:userId | GET     | Historique des parties d’un utilisateur       | ✅       |

> ✅ Protégé signifie que la route nécessite un **token JWT** valide dans l’en-tête `Authorization: Bearer <token>`.

---

### 4.5 Exemple d’en-tête pour JWT

```
Authorization: Bearer <votre_token>
```

---

## 5️⃣ Remarques

* La base SQLite contient quelques quizzes et questions pour tester.
* Projet **100% éducatif**, ne pas utiliser en production tel quel.
* Pour plus de sécurité : ajouter **variables d’environnement** pour le port et le secret JWT, et validation côté front.
