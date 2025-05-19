const jwt = require('jsonwebtoken');
const JWTSECRET =process.env.JWTSECRET;

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send({ error: 'Token faltante' });

  try {
    const decoded = jwt.verify(token, JWTSECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).send({ error: 'Token inválido' });
  }
};

module.exports = auth;
