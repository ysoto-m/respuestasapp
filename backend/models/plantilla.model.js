const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Plantilla = sequelize.define('Plantilla', {
  texto: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  visible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'Plantillas'
});

module.exports = Plantilla;
