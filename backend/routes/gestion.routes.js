const express = require('express');
const router = express.Router();
const { Gestion } = require('../models');
const auth = require('../middlewares/auth.middleware');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const gestiones = await Gestion.findAll({ attributes: ['id', 'nombre'] });
    res.json(gestiones);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener gestiones' });
  }
});

router.post('/', async (req, res) => {
  if (req.usuario.rol !== 'sistema') return res.status(403).json({ mensaje: 'No autorizado' });
  try {
    const { nombre } = req.body;
    const nueva = await Gestion.create({ nombre });
    res.status(201).json(nueva);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al crear gestion' });
  }
});

router.put('/:id', async (req, res) => {
  if (req.usuario.rol !== 'sistema') return res.status(403).json({ mensaje: 'No autorizado' });
  try {
    const { nombre } = req.body;
    await Gestion.update({ nombre }, { where: { id: req.params.id } });
    res.json({ mensaje: 'Actualizado' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar' });
  }
});

module.exports = router;
