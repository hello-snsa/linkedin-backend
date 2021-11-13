const express = require('express');
const protect = require('../middlewares/protect');
const router = express.Router();

const Comments = require('../models/comment.model');
const Likes = require('../models/like.model');
const Replies = require('../models/reply.model');

/* Get All Comments */
router.get('/', async (req, res) => {
  try {
    const comments = await Comments.find()
      .populate('user', 'first_name')
      .lean()
      .exec();
    return res.status(200).json({ comments: comments });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

router.get('/posts/:postId', protect, async (req, res) => {
  try {
    const comments = await Comments.find({ post: req.params.postId })
      .lean()
      .exec();
    return res.status(200).json({ comments: comments });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

/* Create A New Comment */
router.post('/', protect, async (req, res) => {
  try {
    const comment = await Comments.create({
      ...req.body,
      user: req.user.id,
    });

    const newComment = await Comments.findById(comment._id).populate([
      'user',
      'post',
    ]);

    return res.status(201).json({ comment: newComment });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

/* Update A comment */
router.patch('/:id', protect, async (req, res) => {
  try {
    const comment = await Comments.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(201).json({ comment: comment });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

/* Delete A Comment */
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comments.findByIdAndRemove(req.params.id);
    return res.status(201).json({ comment: comment });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

module.exports = router;
