const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Comments = require('./comment.model');
const Likes = require('./like.model');
const Notification = require('./notification.model');
const Posts = require('./post.model');

const userSchema = mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    password: { type: String },
    profile_img: { type: String },
    socketId: { type: String },
    pendingSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    pendingReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    recommendations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    organization: { type: String },
    description: { type: String },
    cover_img: {type: String}
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

userSchema.pre('findOneAndRemove', async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  try {
    const posts = await Posts.deleteMany({ user: doc._id });
    const comments = await Comments.deleteMany({ user: doc._id });
    const likes = await Likes.deleteMany({ user: doc._id });
    const notifications = await Notification.deleteMany({ user: doc._id });
    console.log('deleted user: ', posts, comments, likes, notifications);
    next();
  } catch (e) {
    console.log('error while deleting user activities...');
    next();
  }
});

userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((res, rej) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) return rej(err);
      res(same);
    });
  });
};

const User = mongoose.model('user', userSchema);

module.exports = User;
