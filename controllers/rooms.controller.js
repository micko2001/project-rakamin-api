//const Joi = require("joi");
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

module.exports = { createRoom };
