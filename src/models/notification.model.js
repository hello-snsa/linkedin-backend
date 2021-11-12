const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  title: { type: String, required: true },
});

const Notification = mongoose.model('notification', notificationSchema);

module.exports = Notification;
