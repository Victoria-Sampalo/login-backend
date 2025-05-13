const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado ✅'))
  .catch(err => console.error('Error al conectar MongoDB', err));

app.use('/auth', authRoutes);

app.get('/', (req, res) => res.send('Backend working 🚀'));

// manejador de errores (opcional, solo si defines resError antes)
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  res.status(statusCode).send({ error: message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
