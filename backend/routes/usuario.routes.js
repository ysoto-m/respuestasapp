// routes/usuario.routes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const authMiddleware = require('../middlewares/auth.middleware'); // ✅ Debe existir este archivo y ser una función

// Middleware para proteger las rutas
router.use(authMiddleware);

// Rutas
router.get('/', usuarioController.listarUsuarios);
router.post('/', usuarioController.crearUsuario);
router.put('/:id', usuarioController.actualizarUsuario);
router.patch('/:id/estado', usuarioController.cambiarEstadoUsuario);


module.exports = router;
