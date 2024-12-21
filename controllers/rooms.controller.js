// const RoomService = require('../services/roomService');
const RoomService = require('../services/rooms.service');

const RoomController = {
  async createRoom(req, res) {
    try {
      const { player1_id } = req.body; // Mendapatkan player1Id dari request body
      const newRoom = await RoomService.createRoom(player1_id);
      res.status(201).json({ message: 'Room created', room: newRoom });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create room', error: error.message });
    }
  },

  async openRoom(req, res) {
    try {
      const { roomId } = req.params; // Mendapatkan roomId dari URL parameter
      const status = await RoomService.openRoom(roomId);
      res.status(200).json({ message: 'Room opened', success: status });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to open room', error: error.message });
    }
  },
};

module.exports = RoomController;
