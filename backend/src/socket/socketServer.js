import { Server } from 'socket.io';
import { 
  handleJoinRoom, 
  handleAssignRole, 
  handleRemoveParticipant, 
  handleDisconnect, 
} from './roomSocketHandlers.js';
import { handleVideoEvents } from './videoSocketHandlers.js';

let io; // Hold instance

export const initSocketServer = (httpServer) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  io = new Server(httpServer, {
    cors: {
      origin: frontendUrl,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join_room', handleJoinRoom(io, socket));
    socket.on('assign_role', handleAssignRole(io, socket));
    socket.on('remove_participant', handleRemoveParticipant(io, socket));

    // Phase 4 Video handlers
    handleVideoEvents(io, socket);

    socket.on('disconnect', handleDisconnect(io, socket));
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
