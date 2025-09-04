const jwt = require('jsonwebtoken');
const { SECRET } = require('../config/jwt');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token manquant' });
  // Ici on utilise la forme: Bearer <token>
  const token = authHeader.split(' ')[1]; 
  if (!token) return res.status(401).json({ error: 'Token invalide' });
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token invalide ou expiré' });
    req.user = decoded; 
    next();
  });
};
