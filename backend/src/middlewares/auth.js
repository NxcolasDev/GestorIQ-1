const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token ausente.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret');
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalido.' });
  }
}

module.exports = {
  authenticate,
};
