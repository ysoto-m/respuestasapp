const sequelize = require('../config/db');
const Usuario = require('./usuario.model');
const Gestion = require('./gestion.model');
const Plantilla = require('./plantilla.model');
const UsuarioGestion = require('./usuarioGestion.model');

// Relaciones
Usuario.belongsToMany(Gestion, { through: UsuarioGestion, foreignKey: 'usuarioId' });
Gestion.belongsToMany(Usuario, { through: UsuarioGestion, foreignKey: 'gestionId' });
Gestion.hasMany(Plantilla, { foreignKey: 'gestionId' });
Plantilla.belongsTo(Gestion, { foreignKey: 'gestionId' });

module.exports = {
  sequelize,
  Usuario,
  Gestion,
  Plantilla,
  UsuarioGestion
};
