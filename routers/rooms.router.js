const express = require("express");
const router = express.Router();

const roomController = require("../controllers/rooms.controller");
const authenticateToken = require("../middlewares/auth.middleware");

//post createRoom
router.post("/rooms", authenticateToken, roomController.createRoom);
//post joinRoom
router.post("/rooms/join", authenticateToken, roomController.joinRoom);

//get roomInfo
router.post("/rooms/info", authenticateToken, roomController.roomInfo);

//post finishGame
router.post("/game/finish", authenticateToken, roomController.gameFinished);

module.exports = router;
