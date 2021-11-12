const express = require('express');
const router = express.Router();

const Likes = require('../models/like.model');
const Posts = require('../models/post.model');

/* Get All Likes */
router.get('/', async (req, res) => {
  try {
    const likes = await Likes.find()
      .populate('user', 'first_name')
      .populate('comment', 'title')
      .lean()
      .exec();
    return res.status(200).json({ likes: likes });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

/* Create A New Like */
router.post('/', async (req, res) => {
  try {
    const likes = await Likes.create(req.body);
    return res.status(201).json({ likes: likes });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

/* Delete A Like */
router.delete('/:id', async (req, res) => {
  try {
    const like = await Likes.findByIdAndRemove(req.params.id);
    return res.status(201).json({ like: like });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

module.exports = router;
