// routes/gestion.routes.js
const express = require('express');
const router = express.Router();
const { Gestion } = require('../models/gestion.model');

router.get('/', async (req, res) => {
  try {
    const gestiones = await Gestion.findAll({ attributes: ['id', 'nombre'] });
    res.json(gestiones);
  } catch (err) {
    console.error('Error al listar gestiones:', err);
    res.status(500).json({ mensaje: 'Error al obtener gestiones' });
  }
});
// routes/gestion.routes.js
router.post('/', async (req, res) => {
  const { nombre } = req.body;
  const nueva = await Gestion.create({ nombre });
  res.status(201).json(nueva);
});

router.put('/:id', async (req, res) => {
  const { nombre } = req.body;
  await Gestion.update({ nombre }, { where: { id: req.params.id } });
  res.json({ mensaje: 'Actualizado' });
});

router.delete('/:id', async (req, res) => {
  await Gestion.destroy({ where: { id: req.params.id } });
  res.json({ mensaje: 'Eliminado' });
});


module.exports = router;
