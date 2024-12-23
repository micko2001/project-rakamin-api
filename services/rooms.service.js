//validation time in here
const roomRepository = require("../repositories/rooms.repository")
const { NotFoundError, ValidationError } = require("../dto/customErrors");

const createRoom = async (userId) => {
  const roomData = await roomRepository.createRoom(userId, "waiting");
  return roomData;
};

const joinRoom = async (userId, roomId) => {
  const roomExist = await roomRepository.findRoomById(userId, roomId);

  if (!roomExist) {
    throw new NotFoundError("Room is not found");
  }

  const createdAt = new Date(roomExist.created_at);
  const now = new Date();
  const diffMinutes = (now - createdAt) / (1000 * 60);

  //buffer, FE only need 3 minutes. but dev U can increase it
  if (diffMinutes > 5) {
    //update game_status to invalid
    const result = await roomRepository.invalidRoom(roomId);
    return result;
  }
  //update join
  const gameStart = await roomRepository.joinRoom(roomId, userId, "playing");

  return gameStart;
};

const roomInfo = async (userId, roomId) => {
  const roomExist = await roomRepository.findRoomId(userId, roomId);

  console.log(roomExist);
  if (!roomExist) {
    throw new NotFoundError("Room is not found");
  }

  return roomExist;
};

const playersHand = ({ player1_id, player2_id }, userId) => {
  console.log(player1_id, player2_id);
  console.log(userId);
  if (player1_id === userId) {
    return { userId: userId, position: 1 };
  } else if (player2_id === userId) {
    return { userId: userId, position: 2 };
  } else {
    throw new NotFoundError("User is unknown");
  }
};
function determineWinner(hand1, hand2) {
  const outcomes = {
    rock: { scissors: "win", paper: "lose", rock: "draw" },
    paper: { rock: "win", scissors: "lose", paper: "draw" },
    scissors: { paper: "win", rock: "lose", scissors: "draw" },
  };

  if (!outcomes[hand1] || !outcomes[hand2]) {
    return { error: "Invalid hand positions. Use rock, paper, or scissors." };
  }

  const result = outcomes[hand1][hand2];

  if (result === "draw") return { draw: true };
  return { winner: result === "win" ? "player1" : "player2", draw: false };
}

const gameFinished = async (roomId, userId, handPosition) => {
  //I need a function that can determine whose hand it is

  const whoseHand = await roomRepository.findRoomId(userId, roomId);
  const playersData = playersHand(whoseHand, userId);
  console.log(whoseHand);
  console.log(playersData);

  //update row based on player's hand position

  if (playersData.position == 1 && whoseHand.hand_position_p1) {
    throw new Error("User already submit hand position data");
  }
  if (playersData.position == 2 && whoseHand.hand_position_p2) {
    throw new Error("User already submit hand position data");
  }
  const dataSent = await roomRepository.submitHand(
    handPosition,
    playersData.position,
    roomId
  );
  let result;
  //update game status if all player's hand position is full
  if (dataSent.position == 1 && whoseHand.hand_position_p2) {
    //update data gamestatus and determined the winner
    result = determineWinner(handPosition, whoseHand.hand_position_p2);
  } else if (dataSent.position == 2 && whoseHand.hand_position_p1) {
    result = determineWinner(whoseHand.hand_position_p1, handPosition);
  }
  console.log(result);
  return dataSent;
};
module.exports = { createRoom, joinRoom, roomInfo, gameFinished };