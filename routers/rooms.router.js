const express = require("express");
const router = express.Router();

const roomController = require("../controllers/rooms.controller");
const authenticateToken = require("../middlewares/auth.middleware");

//post createRoom
router.post("/create-room", authenticateToken, roomController.createRoom);
//post joinRoom
router.post("/join-room", authenticateToken, roomController.joinRoom);

//get roomInfo

//post finishGame
//get gameInfo

module.exports = router;
