const roomService = require("../services/rooms.service.js");
const Joi = require("joi");

const joinRoomSchema = Joi.object({
  roomId: Joi.number().integer().required(),
});

const createRoom = async (req, res, next) => {
  try {
    const homeId = req.user.id;
    const roomData = await roomService.createRoom(homeId);
    res.status(201).json({ data: roomData });
  } catch (err) {
    next(err);
  }
};

const joinRoom = async (req, res, next) => {
  try {
    const { error, value } = joinRoomSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    const awayId = req.user.id;
    console.log(awayId)
    const joinRoom = await roomService.joinRoom(awayId, roomId);

    res.status(200).json({ data: joinRoom });
  } catch (err) {
    next(err);
  }
};

const joinRoomForPlayAgain = async (req, res, next) => {
    try {
      console.log("Request Body:", req.body); // Debug isi body
  
      const { error, roomId } = joinRoomSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }
  
      console.log("roomId from Request Body:", roomId); // Debug roomId
  
      const awayId = req.user.id; // Ambil ID user dari token
      console.log("User ID (awayId):", awayId); // Debug user ID
  
      const joinRoom = await roomService.joinRoom(awayId, roomId);
  
      res.status(200).json({ data: joinRoom });
    } catch (err) {
      console.error(err); // Log error untuk debugging
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
    next(err);
  }
};

// const playAgain = async (req, res, next) => {
//     try {
//         const { error, value } = joinRoomSchema.validate(req.body);
//         if (error) {
//           return res.status(400).json({ error: error.message });
//         }
//         const { roomId } = value;
//         const userId = req.user.id;
//         const roomInfo = await roomService.roomInfo(userId, roomId);
//         res.status(200).json({ data: roomInfo });
//       } catch (err) {
//         next(err);
//       }
//   }

module.exports = { createRoom, joinRoom, roomInfo, joinRoomForPlayAgain };