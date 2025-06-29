function roleMiddleware(...rolesPermitidos) {
  return (req, res, next) => {
    try {
      const { usuario } = req;
      if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }
      next();
    } catch (err) {
      console.error('Error en middleware de roles:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
  };
}

module.exports = roleMiddleware;
