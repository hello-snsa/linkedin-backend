require('dotenv').config();
const axios = require('axios');

module.exports = (io, socket) => {
  const API_URI = process.env.API_URI + (process.env.PORT || 8080);
  socket.on('send-message', (sender, receiver, message) => {
    axios
      .post(`${API_URI}/conversation`, {
        sender,
        receiver,
        message,
      })
      .then(({ data }) => {
        console.log("data: ", data);
        io.to(data.fromID).emit('receive-message', data?.conversation);
        io.to(data.toID).emit('receive-message', data?.conversation);
      })
      .catch((err) => console.log(err.message));
  });
};
