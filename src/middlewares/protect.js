require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
  return new Promise((res, rej) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
      if (err) return rej(err);
      res(payload);
    });
  });
};

const protect = async (req, res, next) => {
  // get the token
  const bearer = req?.headers?.authorization;
  if (!bearer || !bearer.startsWith('Bearer')) {
    return res.status(401).json({ message: 'No token present' });
  }

  // check the token
  const token = bearer.trim().split(' ')[1];

  // get the payload
  let payload;
  try {
    payload = await verifyToken(token);
  } catch (e) {
    return res.status(400).json({ message: 'Check your email and password!' });
  }

  if (!payload || !payload.user) {
    return res.status(401).json({ message: 'Check your email and password' });
  }
  req.user = payload.user;
  next();
};

module.exports = protect;
