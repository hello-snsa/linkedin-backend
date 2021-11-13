require('dotenv').config();

const { Server } = require('socket.io');
const express = require('express');
const http = require('http');
const cors = require('cors');
const { cloudinary } = require('./configs/cloudinary.config');

const app = express();
const server = http.createServer(app);

/* Configuration Files */
const connect = require('./configs/db.config');

/* Middlewares */
app.use(express.static('public'));
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use(express.text({ limit: '200mb' }));

/* Enable cors for socket io */
app.use(cors());

/* Controllers */
const authController = require('./controllers/auth.controller');
const userController = require('./controllers/user.controller');
const postController = require('./controllers/post.controller');
const commentController = require('./controllers/comment.controller');
const likeController = require('./controllers/like.controller');
const replyController = require('./controllers/reply.controller');
const notificationController = require('./controllers/notification.controller');
const conversationController = require('./controllers/conversation.controller');
const profileController = require('./controllers/profile.controller');

/* Utility files */
const messengerSocket = require('./utils/messenger.socket');

/* Configuring socket io */
const io = new Server(server, {
  cors: {
    origin: ['*', 'http://localhost:3000', 'http://localhost:8080'], // add routes where cors should be enabled
  },
});

app.post('/api/upload', async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr);
    console.log(uploadResponse);
    res.status(201).json({ msg: 'Success', url: uploadResponse.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

/* Routes */
app.use('/auth', authController);
app.use('/users', userController);
app.use('/posts', postController);
app.use('/comments', commentController);
app.use('/likes', likeController);
app.use('/replies', replyController);
app.use('/notification', notificationController);
app.use('/conversation', conversationController);
app.use('/profile', profileController);

/* 404 routing  */
app.use(function (req, res, next) {
  return res.status(404).send('No route found');
});

const onConnection = (socket) => {
  console.log('socket.io established', socket.id);
  messengerSocket(io, socket);
};

const PORT = process.env.PORT || 8080;

server.listen(PORT, async () => {
  try {
    await connect();

    /* Socket.io connection */
    io.on('connection', onConnection);

    console.log('Server started...', PORT);
  } catch (e) {
    console.log('Server disconnected!');
  }
});
