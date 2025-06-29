// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/login', auth.login);
router.post('/register', authMiddleware, auth.register); // proteger si deseas que solo supervisor o sistema creen

module.exports = router;
