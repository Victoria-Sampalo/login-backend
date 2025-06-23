const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllUsers,
  getUsers,
  updateUserRole,
  changePassword,
  inviteUser
} = require('../controllers/userController');

const { protect, adminOnly } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validationMiddleware');
const {
  registerValidation,
  loginValidation,
  updateRoleValidation,
  changePasswordValidation
} = require('../validators/userValidator');

// Registro y login
router.post('/register', registerValidation, validateRequest, registerUser);
router.post('/login', loginValidation, validateRequest, loginUser);

// Obtener usuarios
router.get('/all', protect, adminOnly, getAllUsers);
router.get('/search', protect, adminOnly, getUsers);

// Cambiar rol y contraseña
router.patch('/:id/role', protect, adminOnly, updateRoleValidation, validateRequest, updateUserRole);
router.post('/change-password', protect, changePasswordValidation, validateRequest, changePassword);

// Invitar usuario (admin)
router.post('/invite', protect, adminOnly, inviteUser);

module.exports = router;
