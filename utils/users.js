const users = [];

// join user to chat
const userJoin = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

//get the current user
const getCurrentUser = (id) => {
  //loop through the users array and find a user byyy the id given
  return users.find((user) => user.id === id);
};

//user leaves chat
const userLeave = (id) => {
  //remove the user from the users array
  const index = users.findIndex((user) => {
    user.id === id;
  });

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//get room users
const getRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = {
  getRoomUsers: getRoomUsers,
  userLeave: userLeave,
  userJoin: userJoin,
  getCurrentUser: getCurrentUser,
};
