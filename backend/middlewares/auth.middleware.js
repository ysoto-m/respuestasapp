// middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Token no enviado' });

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // ✅ importante: usar el mismo nombre esperado en los controladores
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
