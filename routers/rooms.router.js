const express = require("express");
const router = express.Router();

const userController = require("../controllers/users.controller");
const roomController = require("../controllers/rooms.controller")
const authenticateToken = require("../middlewares/auth.middleware");

//post createRoom
router.post("/create-room", authenticateToken, roomController.createRoom);
//post joinRoom
router.post("/join-room", authenticateToken, roomController.joinRoom);

//get roomInfo
router.post("/room-info", authenticateToken, roomController.roomInfo);

router.post("/player1-play-again", authenticateToken, roomController.createRoom)

router.post("/player2-join-room", authenticateToken, roomController.joinRoomForPlayAgain)

module.exports = router;