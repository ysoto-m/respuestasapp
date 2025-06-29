const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Plantilla = sequelize.define('Plantilla', {
  texto: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  gestionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Gestiones',
      key: 'id'
    }
  },
  visible: {
    type: DataTypes.BOOLEAN,
    // default removed; routes must set value explicitly
  }
}, {
  tableName: 'Plantillas'
});

module.exports = Plantilla;
