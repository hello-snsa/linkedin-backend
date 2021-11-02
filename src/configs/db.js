require('dotenv').config();

const mongoose = require('mongoose');

const connect = () => {
  const dbUrl =
    process.env.NODE_ENV === 'development'
      ? 'mongodb://127.0.0.1:27017/linkedin'
      : `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@cluster0.husuw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  //uncomment the below code for production purpose.
  // return mongoose.connect(dbUrl);

  //below code is for testing on developer's laptop. Comment it at the time of deployment. 
  return mongoose.connect("mongodb://127.0.0.1:27017/linkedinbackendtest");
};

module.exports = connect;
