const express = require('express');
const router = express.Router();

const Notification = require('../models/notification.model');
const protect = require('../middlewares/protect');

router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .lean()
      .exec();
    return res.status(200).json({ notifications: notifications });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const notification = await Notification.create(req.body).lean().exec();
    return res.status(200).json({ notification: notification });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

router.patch('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .lean()
      .exec();
    return res.status(200).json({ notification: notification });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndRemove(req.params.id)
      .lean()
      .exec();
    return res.status(200).json({ notification: notification });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

module.exports = router;
