const mongoose = require('mongoose');
const Likes = require('./like.model');
const Replies = require('./reply.model');

const commentSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'post', required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

commentSchema.pre('findOneAndRemove', async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  try {
    const replies = await Replies.deleteMany({ comment: doc._id });
    const likes = await Likes.deleteMany({ comment: doc._id });
    console.log('deleted comment (pre): ', replies, likes);
    next();
  } catch (e) {
    console.log('error while deleting comment (pre)...');
    next();
  }
});

const Comments = mongoose.model('comment', commentSchema);

module.exports = Comments;
