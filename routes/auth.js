const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWTSECRET; // cámbialo en producción

router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({ email, password: hashedPassword, role });
    await user.save();
    res.send({ message: 'Usuario registrado' });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send({ error: 'Usuario no encontrado' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send({ error: 'Contraseña incorrecta' });

  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);
  res.send({ token });
});

module.exports = router;
