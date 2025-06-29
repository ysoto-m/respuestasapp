exports.cambiarEstadoUsuario = async (req, res) => {
    try {
      const { id } = req.params;
      const { activo } = req.body;
  
      const usuario = await Usuario.findByPk(id);
      if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  
      usuario.activo = activo;
      await usuario.save();
  
      res.json({ mensaje: 'Estado actualizado', usuario });
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      res.status(500).json({ mensaje: 'Error interno' });
    }
  };
  