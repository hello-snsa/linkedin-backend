const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    message: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Conversation = mongoose.model('conversation', conversationSchema);

module.exports = Conversation;
