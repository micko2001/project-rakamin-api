const express = require('express');
// const RoomController = require('../controllers/roomController');
const RoomController = require('../controllers/rooms.controller');

const router = express.Router();

// Route untuk membuat room baru
router.post('/createroom', RoomController.createRoom);

// Route untuk membuka room (update created_at)
router.put('/open/:roomId', RoomController.openRoom);

module.exports = router;
