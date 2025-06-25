const jwt = require('jsonwebtoken');


// console.log('JWT_SECRET desde tokenUtils:', process.env.JWT_SECRET);

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, type: user.type },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

module.exports = generateToken;

