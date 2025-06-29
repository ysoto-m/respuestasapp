const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
// Aquí podrías agregar otras rutas como:
// const usuariosRoutes = require('./usuarios.routes');

router.use('/auth', authRoutes);
// router.use('/usuarios', usuariosRoutes);

module.exports = router;
