//validation time in here
const roomRepository = require("../repositories/rooms.repository");
const { NotFoundError, ValidationError } = require("../dto/customErrors");

const createRoom = async (userId) => {
  const roomData = await roomRepository.createRoom(userId, "waiting");
  return roomData;
};
const joinRoom = async (userId, roomId) => {
  const roomExist = await roomRepository.findRoomById(userId, roomId);

  if (!roomExist) {
    throw new NotFoundError("Room not found");
  }

  const createdAt = new Date(roomExist.created_at);
  const now = new Date();
  const diffMinutes = (now - createdAt) / (1000 * 60);

  if (diffMinutes > 5) {
    //update game_status to invalid
    const result = await roomRepository.invalidRoom(roomId);
    return result;
  }
  //update join
  const gameStart = await roomRepository.joinRoom(roomId, userId, "playing");

  return gameStart;
};

module.exports = { createRoom, joinRoom };
