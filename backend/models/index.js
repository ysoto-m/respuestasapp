const sequelize = require('../config/db');
const Usuario = require('./usuario.model');
const Gestion = require('./gestion.model');

// Relaciones
Gestion.hasMany(Usuario, { foreignKey: 'gestionId' });
Usuario.belongsTo(Gestion, { foreignKey: 'gestionId' });

module.exports = {
  sequelize,
  Usuario,
  Gestion
};
