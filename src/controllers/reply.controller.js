const express = require('express');
const protect = require('../middlewares/protect');
const Likes = require('../models/like.model');
const router = express.Router();

const Replies = require('../models/reply.model');

/* Getting all replies */
router.get('/', async (req, res) => {
  try {
    const replies = await Replies.find()
      .populate('user', 'first_name')
      .populate('reply', 'title')
      .lean()
      .exec();
    return res.status(200).json({ replies: replies });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

/* Creating a new reply */
router.post('/', protect, async (req, res) => {
  try {
    const reply = await Replies.create(req.body);
    return res.status(201).json({ reply: reply });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

/* Updating a reply */
router.patch('/:id', protect, async (req, res) => {
  try {
    const reply = await Replies.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({ reply: reply });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

/* Deleting a reply */
router.delete('/:id', protect, async (req, res) => {
  try {
    const reply = await Replies.findByIdAndRemove(req.params.id);
    return res.status(200).json({ reply: reply });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

module.exports = router;
