import { createRoomService, joinRoomService, getRoomService } from '../services/room.service.js';

export const createRoom = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const roomData = await createRoomService(username);
    res.status(201).json(roomData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const roomData = await joinRoomService(roomId, username);
    res.status(200).json(roomData);
  } catch (error) {
    if (error.message === 'Room not found') {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.status(500).json({ error: 'Failed to join room' });
  }
};

export const getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await getRoomService(roomId);
    res.status(200).json(room);
  } catch (error) {
    if (error.message === 'Room not found') {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.status(500).json({ error: 'Failed to get room info' });
  }
};
