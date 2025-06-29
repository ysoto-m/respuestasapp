module.exports = function (...rolesPermitidos) {
  return (req, res, next) => {
    try {
      if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }
      next();
    } catch (err) {
      console.error('Error en middleware de roles:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
  };
};
