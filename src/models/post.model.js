const mongoose = require('mongoose');
const Comments = require('./comment.model');
const Likes = require('./like.model');

const postSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    media: [{ type: String }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);


postSchema.pre('findOneAndRemove', async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  try {
    const comments = await Comments.deleteMany({ post: doc._id });
    const likes = await Likes.deleteMany({ post: doc._id });
    console.log('deleted post (pre): ', comments, likes);
    next();
  } catch (e) {
    console.log('error while deleting post (pre)...');
    next();
  }
});

const Posts = mongoose.model('post', postSchema);

module.exports = Posts;
