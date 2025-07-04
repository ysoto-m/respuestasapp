// routes/usuario.routes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const authMiddleware = require('../middlewares/auth.middleware'); // ✅ Debe existir este archivo y ser una función
const roleMiddleware = require('../middlewares/role.middleware');

// Middleware para proteger las rutas
router.use(authMiddleware);

// Rutas
router.get('/', roleMiddleware('sistema', 'supervisor'), usuarioController.listarUsuarios);
router.post('/', roleMiddleware('sistema', 'supervisor'), usuarioController.crearUsuario);
router.put('/:id', roleMiddleware('sistema', 'supervisor'), usuarioController.actualizarUsuario);
router.patch('/:id/estado', roleMiddleware('sistema'), usuarioController.cambiarEstadoUsuario);


module.exports = router;
