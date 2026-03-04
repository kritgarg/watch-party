import express from 'express';
import { createRoom, joinRoom, getRoom } from '../controllers/room.controller.js';

const router = express.Router();

// POST /rooms - Create a room
router.post('/', createRoom);

// POST /rooms/:roomId/join - Join an existing room
router.post('/:roomId/join', joinRoom);

// GET /rooms/:roomId - Returns room info and participant list
router.get('/:roomId', getRoom);

export default router;
