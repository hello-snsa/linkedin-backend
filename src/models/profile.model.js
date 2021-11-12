const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  cover_img: { type: String },
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
});

const Profile = mongoose.model('profile', profileSchema);

module.exports = Profile;
