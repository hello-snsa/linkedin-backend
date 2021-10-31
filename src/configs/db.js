require('dotenv').config();

const mongoose = require('mongoose');

const connect = () => {
  const dbUrl =
    process.env.NODE_ENV === 'development'
      ? 'mongodb://127.0.0.1:27017/linkedin'
      : `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@cluster0.husuw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  return mongoose.connect(dbUrl);
};

module.exports = connect;
