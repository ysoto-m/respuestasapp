const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UsuarioGestion = sequelize.define('UsuarioGestion', {}, {
  tableName: 'UsuarioGestiones'
});

module.exports = UsuarioGestion;
