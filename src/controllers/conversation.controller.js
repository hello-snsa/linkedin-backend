const express = require('express');
const protect = require('../middlewares/protect');
const Conversation = require('../models/conversation.model');
const User = require('../models/user.model');
const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate(['sender', 'receiver'])
      .lean()
      .exec();

    return res.status(200).json({ messages: conversations });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/connections', protect, async (req, res) => {
  try {
    const messages = {};
    const users = await User.find().lean().exec();
    const messagedUsers = [];
    for await (const user of users) {
      if (user._id !== req.user.id) {
        const conversations = await Conversation.find({
          $or: [
            { $and: [{ sender: req.user.id, receiver: user._id }] },
            { $and: [{ sender: user._id, receiver: req.user.id }] },
          ],
        })
          .populate([
            { path: 'sender', select: { first_name: 1, last_name: 1, profile_img: 1 } },
            { path: 'receiver', select: { first_name: 1, last_name: 1, profile_img: 1 } },
          ])
          .select(['-password'])
          .sort('createdAt')
          .lean()
          .exec();
        if (conversations && conversations.length > 0) {
          if (!messages[user._id]) {
            messages[user._id] = [];
          }
          messages[user._id].push(...conversations);
          messagedUsers.push(user);
        }
      }
    }
    return res.status(200).json({ messages: messages, users: messagedUsers });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('sending: ', req.body);
    const { sender, receiver, message } = req.body;

    if (sender === receiver) {
      throw new Error('Cannot send message to yourself');
    }

    // Check if receiver exists
    const senderData = await User.findById(sender).lean().exec();
    const receiverData = await User.findById(receiver).lean().exec();

    if (!senderData || !receiverData) {
      throw new Error('Please check emails!');
    }

    let conversation = await Conversation.create({
      sender: senderData._id,
      receiver: receiverData._id,
      message: message,
    });

    const convo = await Conversation.findById(conversation._id)
      .populate(['sender', 'receiver'])
      .lean()
      .exec();

    return res
      .status(201)
      .json({
        conversation: convo,
        toID: receiverData?.socketId,
        fromID: senderData?.socketId,
      });
  } catch (err) {
    return res.status(400).json({ err: err.message });
  }
});

router.delete('/all', async (req, res) => {
  try {
    await Conversation.deleteMany({});
    return res.status(201).json({ success: 'done' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndRemove({
      _id: req.params.id,
    });
    return res.status(201).json({ conversation });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/send-message', async (req, res) => {
  try {
    // Check if receiver exists
    const { _id: sender } = await User.findOne({ email: sender }).lean().exec();
    const { _id: receiver } = await User.findOne({ email: receiver })
      .lean()
      .exec();

    if (!senderData || !receiverData) {
      throw new Error('Please check emails!');
    }

    const conversation = await Conversation.find({
      $or: [
        { $and: [{ sender: sender, receiver: receiver }] },
        { $and: [{ sender: receiver, receiver: sender }] },
      ],
    })
      .sort({ createdAt: 'asc' })
      .populate('sender');
    return res.status(200).json({ conversation });
  } catch (e) {
    return res.status(400).json({ e: e.message });
  }
});

module.exports = router;
