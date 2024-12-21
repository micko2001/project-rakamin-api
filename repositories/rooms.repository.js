const pool = require('../db/db');

const RoomRepository = {
  async createRoom(player1_id) {
    const query = `
      INSERT INTO rooms (player1_id, created_at)
      VALUES ($1, NOW())
      RETURNING id, created_at;
    `;
    const result = await pool.query(query, [player1_id]);
    return result.rows[0]; // Mengembalikan room yang baru dibuat
  },

  async updateCreatedAt(roomId) {
    const query = `
      UPDATE rooms
      SET created_at = NOW()
      WHERE id = $1;
    `;
    await pool.query(query, [roomId]);
    return true; // Mengembalikan status sukses
  }
};

module.exports = RoomRepository;