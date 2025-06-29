const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');

router.get('/me', verifyToken, (req, res) => {
  res.json({
    message: 'Token válido',
    user: req.usuario
  });
});

module.exports = router;
