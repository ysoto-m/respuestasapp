// controllers/plantilla.controller.js
const { Plantilla } = require('../models');

exports.crearPlantilla = async (req, res) => {
  try {
    const { titulo, contenido, icono } = req.body;
    const { id: usuarioId, rol } = req.user;

    if (rol !== 'supervisor') return res.status(403).json({ error: 'Solo supervisores pueden crear plantillas' });

    const plantilla = await Plantilla.create({ titulo, contenido, icono, supervisorId: usuarioId });
    res.status(201).json({ message: 'Plantilla creada', plantilla });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear plantilla' });
  }
};

exports.obtenerPlantillas = async (req, res) => {
  try {
    const plantillas = await Plantilla.findAll();
    res.json(plantillas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener plantillas' });
  }
};

exports.eliminarPlantilla = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol, id: userId } = req.user;

    const plantilla = await Plantilla.findByPk(id);
    if (!plantilla) return res.status(404).json({ error: 'Plantilla no encontrada' });

    if (rol !== 'supervisor' || plantilla.supervisorId !== userId) {
      return res.status(403).json({ error: 'No autorizado para eliminar esta plantilla' });
    }

    await plantilla.destroy();
    res.json({ message: 'Plantilla eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar plantilla' });
  }
};
