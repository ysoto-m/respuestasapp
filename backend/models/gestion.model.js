const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Gestion = sequelize.define('Gestion', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Gestiones'
});

module.exports = Gestion;
