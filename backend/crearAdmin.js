require('dotenv').config();
const sequelize = require('./config/db');
const Usuario = require('./models/usuario.model');
const { hashPassword } = require('./utils/hash');

(async () => {
  try {
    await sequelize.sync({ force: true });

    const password_hash = await hashPassword('admin123');
    const admin = await Usuario.create({
      username: 'admin',
      password_hash,
      rol: 'sistema',
      nombre: 'Admin',
      apellido: 'Principal'
    });

    console.log('✅ Usuario admin creado:', admin.username);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error al crear admin:', err);
    process.exit(1);
  }
})();
