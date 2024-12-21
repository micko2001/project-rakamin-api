const express = require("express");
const router = express.Router();

const roomController = require("../controllers/rooms.controller");
const authenticateToken = require("../middlewares/auth.middleware");

//post createRoom
router.post("/create-room", authenticateToken, roomController.createRoom);
//get roomInfo
//post joinRoom
//post finishGame
//get gameInfo

module.exports = router;
