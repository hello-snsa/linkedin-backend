const User = require('../models/user.model');

const bfs = async (visited, newConnection, newRecommendations) => {
  visited.add(newConnection.email);
  const queue = [];
  queue.push(newConnection);

  // Now recommend newConnections friends also
  while (queue.length > 0) {
    const front = queue.shift();
    for (let i = 0; i < front?.connections.length; i++) {
      const userId = front?.connections?.[i];
      const foundUser = await User.findById(userId, {
        email: 1,
        connections: 1,
      })
        .lean()
        .exec();
      if (!visited.has(foundUser.email)) {
        queue.push(foundUser);
      }
    }
    if (!visited.has(front.email)) {
      newRecommendations.add(front._id);
    }
  }
};

const generateRecommendations = async (user, newConnection) => {
  const visited = new Set();
  let newRecommendations = new Set(user.recommendations);

  // Store own email
  if (user?.email) {
    visited.add(user.email);
  }

  // Store all current connections
  user?.connections.forEach(async (userId) => {
    const friend = await User.findById(userId, { email: 1 });
    if (friend?.email) {
      visited.add(friend.email);
    }
  });

  if (newConnection) {
    await bfs(visited, newConnection, newRecommendations);
  }

  // Get people from same organization
  // if (newRecommendations.size < 10 && user?.organization?.length > 0) {
  //   const organizationUsers = await User.find({
  //     organization: user.organization,
  //   })
  //     .lean()
  //     .exec();
  //   if (organizationUsers && organizationUsers.length > 0) {
  //     newRecommendations.add([...organizationUsers.slice(0, 10)]);
  //   }
  // }

  if (newRecommendations.size < 10) {
    const users = await User.find({}).lean().exec();
   
    users.forEach(({ _id, email }) => {
      if (!visited.has(email)) {
        newRecommendations.add(_id);
        visited.add(email);
      }
    });
  }

  return newRecommendations;
};

module.exports = generateRecommendations;
