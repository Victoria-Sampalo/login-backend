const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getAllUsers, getUsers, updateUserRole , changePassword} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validationMiddleware');
const { registerValidation, loginValidation, updateRoleValidation, changePasswordValidation } = require('../validators/userValidator');
const { inviteUser } = require('../controllers/userController');

router.post('/register', registerValidation, validateRequest, registerUser);
router.post('/login', loginValidation, validateRequest, loginUser);
router.get('/', protect, adminOnly, getAllUsers);
router.get('/', protect, adminOnly, getUsers);

router.patch('/:id/role', protect, adminOnly, updateRoleValidation, validateRequest, updateUserRole);
router.post(
  '/change-password',
  protect,
  changePasswordValidation,
  validateRequest,
  changePassword
);

router.post('/invite', protect, adminOnly, inviteUser);


module.exports = router;
