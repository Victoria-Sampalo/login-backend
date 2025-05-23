const { body } = require('express-validator');

exports.registerValidation = [
  body('fullName')
    .notEmpty().withMessage('El nombre completo es obligatorio'),

  body('email')
    .isEmail().withMessage('Email inválido'),

  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

exports.loginValidation = [
  body('email')
    .isEmail().withMessage('Email inválido'),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
];


exports.updateRoleValidation = [
  body('type')
    .isIn(['admin', 'normal'])
    .withMessage('Tipo debe ser admin o normal')
];

exports.changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Debes ingresar tu contraseña actual'),

  body('newPassword')
    .isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres')
];
