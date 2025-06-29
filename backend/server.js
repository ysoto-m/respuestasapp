require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const gestionRoutes = require('./routes/gestion.routes');
const plantillaRoutes = require('./routes/plantilla.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/gestiones', gestionRoutes);
app.use('/api/plantillas', plantillaRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log('✅ Conectado a la base de datos');
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ Error al conectar:', err);
});
