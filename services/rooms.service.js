// const RoomRepository = require('../repositories/roomRepository');
const RoomRepository = require('../repositories/rooms.repository')

const RoomService = {
  async createRoom(player1Id) {
    const newRoom = await RoomRepository.createRoom(player1Id);
    return newRoom; // Mengembalikan room yang baru dibuat
  },

  async openRoom(roomId) {
    const status = await RoomRepository.updateCreatedAt(roomId);
    return status; // Mengembalikan status sukses
  },
};

module.exports = RoomService;
