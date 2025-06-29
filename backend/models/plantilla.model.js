// models/plantilla.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Plantilla = sequelize.define('Plantilla', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  icono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  creadoPor: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Plantillas'
});

module.exports = Plantilla;


// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

function verificarToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Token requerido' });

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido' });
  }
}

function soloRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    next();
  };
}

module.exports = { verificarToken, soloRoles };


// routes/plantilla.routes.js
const express = require('express');
const router = express.Router();
const Plantilla = require('../models/plantilla.model');
const { verificarToken, soloRoles } = require('../middleware/auth.middleware');

// Crear plantilla (supervisor)
router.post('/', verificarToken, soloRoles('supervisor'), async (req, res) => {
  try {
    const { titulo, mensaje, icono } = req.body;
    const plantilla = await Plantilla.create({
      titulo,
      mensaje,
      icono,
      creadoPor: req.user.id
    });
    res.status(201).json(plantilla);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear plantilla' });
  }
});

// Obtener todas (agentes y supervisores)
router.get('/', verificarToken, async (req, res) => {
  try {
    const plantillas = await Plantilla.findAll();
    res.json(plantillas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener plantillas' });
  }
});

// Eliminar plantilla (supervisor)
router.delete('/:id', verificarToken, soloRoles('supervisor'), async (req, res) => {
  try {
    await Plantilla.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

// Actualizar plantilla (supervisor)
router.put('/:id', verificarToken, soloRoles('supervisor'), async (req, res) => {
  try {
    const { titulo, mensaje, icono } = req.body;
    await Plantilla.update({ titulo, mensaje, icono }, { where: { id: req.params.id } });
    res.json({ message: 'Actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

module.exports = router;
