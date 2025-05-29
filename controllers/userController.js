const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      type: 'normal'
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

exports.createUser = async (req, res) => {
  const { fullName, password, token } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ message: 'Token de invitación requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      type: 'normal'
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario creado correctamente' });
  } catch (err) {
    console.error(err);
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'El token de invitación ha expirado' });
    }
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};
