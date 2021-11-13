require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user.model');

const generateToken = ({ _id, email }) => {
  const user = { id: _id, email: email };
  return jwt.sign({ user }, process.env.JWT_SECRET_KEY);
};

router.post('/register', async (req, res) => {
  try {
    let user = await User.create(req.body);
    user = user.toJSON();
    delete user.password;
    const token = await generateToken(user);
    return res
      .status(201)
      .json({ token: token, email: user?.email, id: user?._id });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

router.post('/login', async (req, res) => {
  let user;
  try {
    user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Your email or password is not correct' });
    }
  } catch (e) {
    return res.status(400).json({ message: 'Something went wrong' });
  }

  let match;
  try {
    match = await user.checkPassword(req.body.password);
    if (!match) {
      console.log('password dekh bhai');
      return res
        .status(401)
        .json({ message: 'Your email or password is not correct' });
    }
  } catch (e) {
    return res.status(400).json({ message: 'Something went wrong' });
  }

  const token = generateToken(user);
  return res
    .status(201)
    .json({ token: token, email: user?.email, id: user?._id });
});

module.exports = router;
