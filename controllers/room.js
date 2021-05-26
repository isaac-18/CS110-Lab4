// Controller handler to handle functionality in room page
const Room = require("../models/Rooms");

const roomGenerator = require("../util/roomIdGenerator.js");

// Example for handle a get request at '/:roomName' endpoint.
function getRoom(request, response) {
  // response.render('room', {title: 'chatroom', roomName: request.params.roomName, newRoomId: roomGenerator.roomIdGenerator()});
  Room.find({ name: request.params.roomName })
    .lean()
    .then((item) => {
      // console.log(item);
      response.render("room", {
        title: "chatroom",
        roomName: request.params.roomName,
        roomID: item[0].roomID,
      });
    });
}

function getMessages(request, response) {
  Room.find({ name: request.params.roomName })
    .lean()
    .then((item) => {
      response.render("room", {
        messages: item[0].messages,
      });
    });
}

module.exports = {
  getRoom,
  getMessages,
};
