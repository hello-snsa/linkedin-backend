const mongoose = require('mongoose');
const Likes = require('./like.model');

const replySchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment',
    },
    reply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'reply',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

replySchema.pre('findOneAndRemove', async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  try {
    const replies = await Replies.deleteMany({ reply: doc._id });
    const likes = await Likes.deleteMany({ reply: doc._id });
    console.log('deleted replies (pre): ', replies, likes);
  } catch (e) {
    console.log('error while deleting likes on reply (pre)');
  }
  next();
});

const Replies = mongoose.model('reply', replySchema);

module.exports = Replies;
