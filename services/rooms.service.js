//validation time in here
const roomRepository = require("../repositories/rooms.repository");
const {
  UserAlreadyExistsError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
} = require("../dto/customErrors");

const createRoom = async (userId) => {
  const roomData = await roomRepository.createRoom(userId, "waiting");
  return roomData;
};

const joinRoom = async (userId, roomId) => {
  const roomExist = await roomRepository.findRoomById(userId, roomId);

  if (!roomExist) {
    throw new NotFoundError("Room is not found");
  }
  if (roomExist.player2_id) {
    throw new ValidationError("Room is full");
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
    rock: { scissors: "win", paper: "lose", rock: "draw", unsubmit: "win" },
    paper: { rock: "win", scissors: "lose", paper: "draw", unsubmit: "win" },
    scissors: { paper: "win", rock: "lose", scissors: "draw", unsubmit: "win" },
    unsubmit: {
      rock: "lose",
      paper: "lose",
      scissors: "lose",
      unsubmit: "error",
    },
  };

  if (hand1 === "unsubmit" && hand2 === "unsubmit")
    return { error: "Both hands cannot be unsubmit." };

  const result = outcomes[hand1]?.[hand2];

  if (!result) return { error: "Invalid hand positions." };
  if (result === "error") return { error: "Both hands cannot be unsubmit." };

  if (result === "draw") return { draw: true };
  return { winner: result === "win" ? "player1" : "player2", draw: false };
}

const handlerWinner = async (result, roomId, roomInfo) => {
  const { draw } = result;

  if (draw) {
    return await roomRepository.setDraw(roomId, draw);
  } else {
    const { winner } = result;

    const gameEnd =
      winner === "player1"
        ? { winner: roomInfo.player1_id, loser: roomInfo.player2_id }
        : { winner: roomInfo.player2_id, loser: roomInfo.player1_id };

    return await roomRepository.setWinner(roomId, gameEnd);
  }
};

const gameFinished = async (roomId, userId, handPosition) => {
  //I need a function that can determine whose hand it is

  const whoseHand = await roomRepository.findRoomId(userId, roomId);
  const playersData = playersHand(whoseHand, userId);
  console.log(whoseHand);
  console.log(playersData);

  //update row based on player's hand position

  if (playersData.position == 1 && whoseHand.hand_position_p1) {
    throw new ValidationError("User already submit hand position data");
  }
  if (playersData.position == 2 && whoseHand.hand_position_p2) {
    throw new ValidationError("User already submit hand position data");
  }
  const dataSent = await roomRepository.submitHand(
    handPosition,
    playersData.position,
    roomId
  );

  //update game status if all player's hand position is full
  if (
    (dataSent.position === 1 && whoseHand.hand_position_p2 != null) ||
    (dataSent.position === 2 && whoseHand.hand_position_p1 != null)
  ) {
    // //time validation
    const startedAt = new Date(whoseHand.initialize_at);
    const now = new Date();
    const diffMinutes = (now - startedAt) / (1000 * 60);

    if (diffMinutes > 5) {
      //update game_status to invalid
      const result = await roomRepository.invalidRoom(roomId);
      return result;
    }

    // Tentukan posisi tangan berdasarkan pemain yang mengirim data
    const player1Hand =
      dataSent.position === 1 ? handPosition : whoseHand.hand_position_p1;
    const player2Hand =
      dataSent.position === 2 ? handPosition : whoseHand.hand_position_p2;

    // Tentukan pemenang dan log hasil
    const result = determineWinner(player1Hand, player2Hand);
    console.log(result, `way${dataSent.position}`);

    // Proses hasil pertandingan
    return await handlerWinner(result, roomId, whoseHand);
  }

  console.log(dataSent);
  return dataSent;
};
module.exports = { createRoom, joinRoom, roomInfo, gameFinished };
