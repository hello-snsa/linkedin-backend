const express = require('express');
const router = express.Router();

const Posts = require('../models/post.model');
const Comments = require('../models/comment.model');
const Likes = require('../models/like.model');
const protect = require('../middlewares/protect');

/* Get All Posts */
router.get('/', async (req, res) => {
  try {
    const posts = await Posts.find()
      .populate('user')
      .lean()
      .exec();
    return res.status(200).json({ posts: posts });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

/* Create A New Post */
router.post('/', protect, async (req, res) => {
  try {
    const post = await Posts.create({ ...req.body, user: req.user.id }).populate('user');
    return res.status(201).json({ post: post });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

/* Get Single Post */
router.get('/:id', protect, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id).populate('user');
    return res.status(200).json({ post: post });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

/* Update A Post */
router.patch('/:id', protect, async (req, res) => {
  try {
    const post = await Posts.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({ post: post });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

/* Delete A Post */
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Posts.findByIdAndRemove(req.params.id);
    const comments = await Comments.deleteMany({ post: req.params.id });
    const likes = await Likes.deleteMany({ post: req.params.id });

    return res
      .status(201)
      .json({ post: post, comments: comments, likes: likes });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

module.exports = router;
