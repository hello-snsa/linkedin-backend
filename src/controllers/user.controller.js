const express = require('express');
const router = express.Router();

const User = require('../models/user.model');
const Posts = require('../models/post.model');

const protect = require('../middlewares/protect');
const generateRecommendations = require('../utils/generateRecommendations');

const ObjectId = require('mongoose').Types.ObjectId;

/* Getting all users */
router.get('/', async (req, res) => {
  try {
    const users = await User.find(
      {},
      { phone: 0, password: 0, createdAt: 0, updatedAt: 0 }
    )
      .lean()
      .exec();
    return res.status(200).json({ users: users });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

/* Creating new user */
// router.post('/', async (req, res) => {
//   try {
//     const user = await User.create(req.body);
//     return res.status(201).json({ user: user });
//   } catch (e) {
//     return res.status(400).json({ error: e });
//   }
// });

/* Getting all posts of a user */
router.get('/posts', protect, async (req, res) => {
  try {
    const posts = await Posts.find({ user: req.user.id }).lean().exec();
    return res.status(200).json({ posts: posts });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

/* For changing socketID using email address */
router.patch('/changeSocket', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      { socketId: req.body.socketId },
      { new: true }
    );
    return res.status(200).json({ user: user });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/* Get All Connections */
router.get('/connections', protect, async (req, res) => {
  try {
    const { connections } = await User.findById(req.user.id, {
      _id: 0,
      connections: 1,
    })
      .lean()
      .exec();
    return res
      .status(200)
      .json({ connections: connections, count: connections.length });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

/* Removing a connection */
router.patch('/connections', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { connections: req.body.id },
      },
      { new: true }
    )
      .lean()
      .exec();
    return res.status(200).json({ user: user });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

/* Getting all pending requests */
router.get('/pending-requests', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, {
      password: 0,
    })
      .populate(['pendingReceived', 'pendingSent'])
      .lean()
      .exec();
    console.log('pending: ', user);
    return res.status(200).json({ user: user });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

/* Sending request to a user */
router.post('/send-request', protect, async (req, res) => {
  try {
    // Don't send if both id's are same
    if (req.user.id === req.body.id) {
      return res.status(400).json({ error: "Can't send request to yourself" });
    }
    /* Check if user exists */
    let receiver = await User.findById(req.body.id, { _id: 1 }).lean();
    if (!receiver) {
      return res.status(400).json({ error: "User doesn't exists" });
    }

    /* Add to your pending list */
    const sender = await User.findByIdAndUpdate(
      req.user.id,
      {
        $addToSet: { pendingSent: receiver },
      },
      { new: true }
    ).select(['-createdAt', '-updatedAt', '-password', '-phone']);

    receiver = await User.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { pendingReceived: sender },
      },
      { new: true }
    ).select(['-createdAt', '-updatedAt', '-password', '-phone']);

    return res.status(201).json({
      sender: sender,
      receiver: receiver,
      message: 'Request sent successfully!',
    });
  } catch (e) {
    return res
      .status(400)
      .json({ error: e, message: 'Error while sending request!' });
  }
});

/* Accept connection request */
router.patch('/accept-request', protect, async (req, res) => {
  try {
    const me = await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { pendingReceived: req.body.id },
        $addToSet: { connections: req.body.id },
      },
      { new: true }
    );

    let connection = await User.findByIdAndUpdate(
      req.body.id,
      {
        $pull: { pendingSent: req.user.id },
        $addToSet: { connections: req.user.id },
      },
      { new: true }
    );

    // Generating new connections recommendations
    try {
      const newRecommendations = Array.from(
        await generateRecommendations(me, connection)
      );
      let receiver = await User.findByIdAndUpdate(
        req.user.id,
        {
          $addToSet: { recommendations: newRecommendations },
        },
        { new: true }
      );
      return res.status(200).json({
        sender: connection,
        receiver: receiver,
        message: 'Accepted Request!',
      });
    } catch (e) {
      return res
        .status(400)
        .json({ error: 'Error while getting recommendation' });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ error: e, message: 'Error while accepting request' });
  }
});

/* Get recommendations */
router.get('/recommendations', protect, async (req, res) => {
  try {
    let user = await User.findById(req.user.id, {
      email: 1,
      connections: 1,
      recommendations: 1,
    })
      .lean()
      .exec();

    const newRecommendations = Array.from(await generateRecommendations(user));
    const users = await User.find(
      { _id: { $in: newRecommendations } },
      { password: 0 }
    )
      .lean()
      .exec();
    // await generateRecommendations(user);
    return res.status(200).json({ recommendations: users });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

/* Getting single user */
router.get('/email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email })
      .populate(['connections', 'pendingReceived', 'pendingSent'])
      .lean()
      .exec();
    return res.status(200).json({ user: user });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

/* Getting single user */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec();
    return res.status(200).json({ user: user });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

/* Updating single user */
router.patch('/:id', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select('-password');

    return res.status(200).json({ user: user });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

/* Deleting a user */
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id).select(
      '-password'
    );
    return res.status(201).json({ user: user });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

module.exports = router;
