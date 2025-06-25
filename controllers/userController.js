const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { sendInvitationEmail } = require('../utils/email');
const { generateToken } = require('../utils/tokenUtils'); // Ajusta la ruta si es necesario

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

exports.inviteUser = async (req, res) => {
  const { fullName, email } = req.body;

  console.log("[INVITE BODY]", { fullName, email });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const token = jwt.sign({ fullName, email }, process.env.JWT_SECRET, { expiresIn: '24h' });

    await sendInvitationEmail(fullName, email, token);

    res.status(200).json({ message: `Invitación enviada a ${email}` });
  } catch (err) {
    console.error('[INVITE ERROR]', err);
    res.status(500).json({ message: 'Error al enviar invitación' });
  }
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('Usuario encontrado:', email);
console.log('Password hash:', password);
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Credenciales inválidas' });
    console.log("login user en controller")

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



exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña actual incorrecta' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Contraseña actualizada con éxito' });
  } catch (err) {
    res.status(500).json({ message: 'Error al cambiar contraseña' });
  }
};

exports.getAllUsers = async (req, res) => {
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

exports.getUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { fullName: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ]
      }
    : {};

  try {
    const users = await User.findOne(keyword).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};



