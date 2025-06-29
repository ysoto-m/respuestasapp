// ✅ controllers/usuario.controller.js
const Usuario = require('../models/usuario.model');

exports.listarUsuarios = async (req, res) => {
  try {
    const where = req.usuario.rol === 'supervisor' ? { gestionId: req.usuario.gestionId } : {};
    const usuarios = await Usuario.findAll({ where });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al listar usuarios' });
  }
};

exports.crearUsuario = async (req, res) => {
  try {
    const { username, password_hash, rol, nombre, apellido, gestionId } = req.body;
    const nuevo = await Usuario.create({ username, password_hash, rol, nombre, apellido, gestionId, estado: true });
    res.status(201).json(nuevo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear usuario' });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const campos = req.body;
    await Usuario.update(campos, { where: { id } });
    res.json({ mensaje: 'Usuario actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar usuario' });
  }
};

exports.cambiarEstadoUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    usuario.estado = usuario.estado === 'activo' ? 'inactivo' : 'activo';
    await usuario.save();

    res.json({ mensaje: 'Estado actualizado', usuario });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ mensaje: 'Error al cambiar estado del usuario' });
  }
};
