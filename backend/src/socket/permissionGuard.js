import { getParticipantBySocketId } from '../services/room.service.js';

export const requireRole = (allowedRoles) => {
  return async (socket, next) => {
    try {
      const participant = await getParticipantBySocketId(socket.id);
      
      if (!participant) {
        return next(new Error('Participant not found'));
      }

      if (!allowedRoles.includes(participant.role)) {
        return next(new Error('Permission denied'));
      }
      
      next(); // authorized
    } catch (error) {
      next(new Error('Internal server error'));
    }
  };
};

// Check permissions inline inside socket handler
export const checkPermission = async (socketId, allowedRoles) => {
  const participant = await getParticipantBySocketId(socketId);
  if (!participant) return false;
  return allowedRoles.includes(participant.role);
};
