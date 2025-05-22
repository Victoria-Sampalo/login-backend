const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/tokenUtils');

exports.registerUser = async (req, res) => {
  const { fullName, email, password, type } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email ya registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      type
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      type: user.type
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear usuario', error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Credenciales inválidas' });

    const token = generateToken(user);

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      type: user.type,
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Error en login', error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};


exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    } 
    
    if (req.user._id.toString() === id) {
  return res.status(400).json({ message: 'No puedes cambiar tu propio rol' });
    }


    user.type = type;
    await user.save();

    res.json({ message: `Tipo de usuario actualizado a ${type}` });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el tipo de usuario', error: err.message });
  }
};


