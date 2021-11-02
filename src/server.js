require('dotenv').config();
const express = require('express');

const connect = require('./configs/db');

const app = express();

//middleware express.json()
app.use(express.json());


const userController = require("./controllers/user.controller");



//Routing

//USER routing
app.use("/user", userController);



//for 404 routing *note: put this as the last route
app.use(function (req, res, next) {
  return res.status(404).send('No route found');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  try {
    await connect();
    console.log('Server started at port: ', PORT);
  } catch (err) {
    console.log('Error while starting server... ' + err);
  }
});
