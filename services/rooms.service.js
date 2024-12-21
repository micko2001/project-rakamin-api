//validation time in here
const roomRepository = require("../repositories/rooms.repository");
const { NotFoundError, ValidationError } = require("../dto/customErrors");

const createRoom = async (userId) => {
  if (!userId) {
    throw new NotFoundError("User not Found");
  }
  const roomData = await roomRepository.createRoom(userId);
  return roomData;
};

module.exports = { createRoom };
