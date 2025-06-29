const express = require('express');
const router = express.Router();
const { Plantilla, UsuarioGestion } = require('../models');
const auth = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const { rol, id } = req.usuario;
    let where = {};

    if (rol === 'sistema') {
      // no additional filters
    } else {
      const gestiones = await UsuarioGestion.findAll({ where: { usuarioId: id } });
      const gestionIds = gestiones.map(g => g.gestionId);
      if (!gestionIds.length) return res.json([]);
      where.gestionId = gestionIds;
      if (rol === 'agente') {
        where.visible = true;
      }
    }

    const plantillas = await Plantilla.findAll({ where });
    res.json(plantillas);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener plantillas' });
  }
});

router.post('/', roleMiddleware('sistema', 'supervisor'), async (req, res) => {
  try {
    const { texto, gestionId } = req.body;
    if (!gestionId) return res.status(400).json({ mensaje: 'gestionId requerido' });

    if (req.usuario.rol === 'supervisor') {
      const relacion = await UsuarioGestion.findOne({ where: { usuarioId: req.usuario.id, gestionId } });
      if (!relacion) return res.status(403).json({ mensaje: 'No pertenece a la gestión' });
    }

    const nueva = await Plantilla.create({ texto, gestionId, visible: true });
    res.status(201).json(nueva);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al crear plantilla' });
  }
});

router.put('/:id/visible', roleMiddleware('sistema', 'supervisor'), async (req, res) => {
  try {
    const plantilla = await Plantilla.findByPk(req.params.id);
    if (!plantilla) return res.status(404).json({ mensaje: 'No encontrada' });

    if (req.usuario.rol === 'supervisor') {
      const relacion = await UsuarioGestion.findOne({ where: { usuarioId: req.usuario.id, gestionId: plantilla.gestionId } });
      if (!relacion) return res.status(403).json({ mensaje: 'No autorizado' });
    }

    plantilla.visible = req.body.visible;
    await plantilla.save();
    res.json(plantilla);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar' });
  }
});

module.exports = router;
