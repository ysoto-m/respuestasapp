const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['sistema', 'supervisor', 'agente']]
    }
  },
  gestionId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'activo',
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  tableName: 'Usuarios',
  indexes: [
    {
      unique: true,
      fields: ['username']
    }
  ]
});

module.exports = Usuario;
