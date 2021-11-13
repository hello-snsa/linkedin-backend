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

router.get('/post/:postID', async (req, res) => {
  try {
    const allLikes = await Likes.find({ post: req.params.postID })
      .populate('post')
      .lean()
      .exec();
    return res.status(200).json({ likes: allLikes, total: allLikes.length });
  } catch (e) {
    return res
      .status(500)
      .json({ error: e, message: 'Error while getting all likes of post' });
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

router.patch('/', async (req, res) => {
  try {
    const like = await Likes.findOneAndUpdate(
      { post: req.body.post, user: req.body.user },
      req.body
    ).populate(['user', 'post']);
    return res.status(200).json({ like: like });
  } catch (e) {
    return res
      .status(500)
      .json({ error: e, message: 'Error while updating like' });
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
