const Usuario = require('../models/usuario.model');
const { Gestion } = require('../models');
const { hashPassword, comparePasswords } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

// Registrar nuevo usuario
exports.register = async (req, res) => {
  try {
    const { username, password, rol, nombre, apellido } = req.body;

    const exists = await Usuario.findOne({ where: { username } });
    if (exists) return res.status(400).json({ error: 'Usuario ya existe' });

    const password_hash = await hashPassword(password);

    const user = await Usuario.create({
      username,
      password_hash,
      rol,
      nombre,
      apellido
    });

    res.status(201).json({
      message: 'Usuario creado correctamente',
      user: {
        id: user.id,
        username: user.username,
        rol: user.rol,
        nombre: user.nombre,
        apellido: user.apellido
      }
    });
  } catch (err) {
    console.error('🔥 Error en register:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Usuario.findOne({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const isValid = await comparePasswords(password, user.password_hash);
    if (!isValid) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = generateToken({
      id: user.id,
      username: user.username,
      rol: user.rol,
      nombre: user.nombre,
      apellido: user.apellido
    });

    const fullUser = await Usuario.findByPk(user.id, {
      include: [{ model: Gestion }]
    });
    const { password_hash, ...userData } = fullUser.toJSON();

    res.json({
      message: 'Login exitoso',
      token,
      user: userData
    });
  } catch (err) {
    console.error('🔥 Error en login:', err);
    res.status(500).json({ error: 'Error al hacer login' });
  }
};
