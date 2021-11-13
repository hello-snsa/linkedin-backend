const express = require('express');
const router = express.Router();

const protect = require('../middlewares/protect');
const User = require('../models/user.model');

router.patch('/', protect, async (req, res) => {
  try {
    const profile = await User.findByIdAndUpdate(
      req.user.id,
      { ...req.body },
      { new: true }
    );
    return res.status(201).json({ profile: profile });
  } catch (e) {
    return res
      .status(500)
      .json({ error: e, message: 'Something went wrong while creating post!' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const profile = await User.findById(req.params.userId).lean().exec();
    return res.status(200).json({ profile: profile });
  } catch (e) {
    return res.status(400).json({ error: e, message: 'Something went wrong!' });
  }
});

module.exports = router;
