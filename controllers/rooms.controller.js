const Joi = require("joi");

const joinRoomSchema = Joi.object({
  roomId: Joi.string().required(),
});

const roomService = require("../services/rooms.service");

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
    const { roomId } = value;
    const awayId = req.user.id;
    const joinRoom = await roomService.joinRoom(awayId, roomId);

    res.status(200).json({ data: joinRoom });
  } catch (err) {
    next(err);
  }
};

module.exports = { createRoom, joinRoom };
