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

router.post(
  "/player1-play-again",
  authenticateToken,
  roomController.createRoom
);

router.post(
  "/player2-join-room",
  authenticateToken,
  roomController.joinRoomForPlayAgain
);

router.post("/play/again", authenticateToken, roomController.playAgain);

module.exports = router;