require('dotenv').config();
const mongoose = require('mongoose');

module.exports = () => {
  const LINK =
    process.env.NODE_ENV === 'production'
      ? process.env.DATABASE_URI
      : 'mongodb://127.0.0.1:27017/linkedin-clone';
  return mongoose.connect(LINK);
};
