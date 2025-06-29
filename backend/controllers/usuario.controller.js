const { Usuario, Gestion } = require('../models');
const { hashPassword } = require('../utils/hash');

exports.listarUsuarios = async (req, res) => {
  try {
    const include = [{ model: Gestion, through: { attributes: [] } }];
    let usuarios;

    if (req.usuario.rol === 'supervisor') {
      const supervisor = await Usuario.findByPk(req.usuario.id, {
        include: [{ model: Gestion }]
      });
      const gestionIds = supervisor.Gestions.map(g => g.id);
      usuarios = await Usuario.findAll({
        include,
        where: {
          '$Gestions.id$': gestionIds
        },
        distinct: true
      });
    } else {
      usuarios = await Usuario.findAll({ include });
    }

    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al listar usuarios' });
  }
};

exports.crearUsuario = async (req, res) => {
  try {
    let { username, password, rol, nombre, apellido, gestiones = [] } = req.body;

    if (req.usuario.rol === 'supervisor') {
      if (rol !== 'agente') {
        return res.status(403).json({ mensaje: 'Supervisores solo pueden crear usuarios con rol agente' });
      }
      const supervisor = await Usuario.findByPk(req.usuario.id, { include: [{ model: Gestion }] });
      const allowedIds = supervisor.Gestions.map(g => g.id);
      gestiones = gestiones.filter(id => allowedIds.includes(id));
    }

    const password_hash = await hashPassword(password);
    const nuevo = await Usuario.create({ username, password_hash, rol, nombre, apellido, estado: 'activo' });
    if (gestiones.length) {
      await nuevo.setGestions(gestiones);
    }
    const usuario = await Usuario.findByPk(nuevo.id, { include: [{ model: Gestion }] });
    res.status(201).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear usuario' });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    let { password, gestiones, rol, ...resto } = req.body;

    if (req.usuario.rol === 'supervisor') {
      if (rol && rol !== 'agente') {
        return res.status(403).json({ mensaje: 'Supervisores solo pueden asignar rol agente' });
      }
      const supervisor = await Usuario.findByPk(req.usuario.id, { include: [{ model: Gestion }] });
      const allowedIds = supervisor.Gestions.map(g => g.id);
      if (gestiones) {
        gestiones = gestiones.filter(idG => allowedIds.includes(idG));
      }
      rol = 'agente';
    }

    if (password) {
      resto.password_hash = await hashPassword(password);
    }
    if (rol) {
      resto.rol = rol;
    }

    await Usuario.update(resto, { where: { id } });
    const usuario = await Usuario.findByPk(id);
    if (gestiones) {
      await usuario.setGestions(gestiones);
    }
    const actualizado = await Usuario.findByPk(id, { include: [{ model: Gestion }] });
    res.json(actualizado);
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
