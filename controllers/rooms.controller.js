const Joi = require("joi");

const roomService = require("../services/rooms.service");
const {
  UserAlreadyExistsError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  DatabaseError,
} = require("../dto/customErrors");
const joinRoomSchema = Joi.object({
  roomId: Joi.string().required(),
});

const gameFinishedSchema = Joi.object({
  roomId: Joi.string().required(),
  handPosition: Joi.string()
    .valid("rock", "paper", "scissors", "unsubmit")
    .required(),
});

const createRoom = async (req, res, next) => {
  try {
    const homeId = req.user.id;

    const roomData = await roomService.createRoom(homeId);
    res.status(201).json({ data: roomData });
  } catch (error) {
    if (error instanceof DatabaseError) {
      return res.status(error.status).json({ error: error.message });
    }
    next(error);
  }
};

const joinRoom = async (req, res, next) => {
  try {
    const { error, value } = joinRoomSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    const { roomId } = value;
    const awayId = req.user.id;
    const joinRoom = await roomService.joinRoom(awayId, roomId);

    res.status(200).json({ data: joinRoom });
  } catch (err) {
    if (err instanceof DatabaseError) {
      return res.status(err.status).json({ error: err.message });
    }
    if (err instanceof NotFoundError) {
      return res.status(err.status).json({ error: err.message });
    }
    if (err instanceof ValidationError) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
};
const roomInfo = async (req, res, next) => {
  try {
    const { error, value } = joinRoomSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    const { roomId } = value;
    const userId = req.user.id;
    const roomInfo = await roomService.roomInfo(userId, roomId);
    res.status(200).json({ data: roomInfo });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
};
const gameFinished = async (req, res, next) => {
  try {
    const { error, value } = gameFinishedSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    const { handPosition, roomId } = value;
    const userId = req.user.id;
    const gameFinished = await roomService.gameFinished(
      roomId,
      userId,
      handPosition
    );
    res.status(200).json({ data: gameFinished });
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(err.status).json({ error: err.message });
    }
    if (err instanceof DatabaseError) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
};
const joinRoomForPlayAgain = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body);
    const { error, value } = joinRoomSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    const roomId = value.roomId;
    const awayId = req.user.id;

    const joinRoom = await roomService.joinRoom(awayId, roomId);
    res.status(200).json({ data: joinRoom });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
};

const playAgain = async (req, res, next) => {
  try {
    const { error, value } = joinRoomSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    const { roomId } = value;
    const userId = req.user.id;

    const playingGameAgain = await roomService.playAgain(userId, roomId);
    res.status(200).json({ data: playingGameAgain });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(err.status).json({ error: error.message });
    }
    if (err instanceof ValidationError) {
      return res.status(err.status).json({ error: err.message });
    }
    if (err instanceof DatabaseError) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
};

module.exports = {
  createRoom,
  joinRoom,
  roomInfo,
  gameFinished,
  joinRoomForPlayAgain,
  playAgain,
};
