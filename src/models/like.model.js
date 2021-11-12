const mongoose = require('mongoose');

const likeSchema = mongoose.Schema(
  {
    form: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'post' },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'comment' },
    reply: { type: mongoose.Schema.Types.ObjectId, ref: 'reply' },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Likes = mongoose.model('like', likeSchema);

module.exports = Likes;
