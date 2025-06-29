const express = require('express');
const router = express.Router();
const { Plantilla } = require('../models');
const auth = require('../middlewares/auth.middleware');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const plantillas = await Plantilla.findAll();
    res.json(plantillas);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener plantillas' });
  }
});

router.post('/', async (req, res) => {
  if (req.usuario.rol !== 'sistema') return res.status(403).json({ mensaje: 'No autorizado' });
  try {
    const { texto } = req.body;
    const nueva = await Plantilla.create({ texto, visible: true });
    res.status(201).json(nueva);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al crear plantilla' });
  }
});

router.put('/:id/visible', async (req, res) => {
  if (req.usuario.rol !== 'sistema') return res.status(403).json({ mensaje: 'No autorizado' });
  try {
    const plantilla = await Plantilla.findByPk(req.params.id);
    if (!plantilla) return res.status(404).json({ mensaje: 'No encontrada' });
    plantilla.visible = req.body.visible;
    await plantilla.save();
    res.json(plantilla);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar' });
  }
});

module.exports = router;
