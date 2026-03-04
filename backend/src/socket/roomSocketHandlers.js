import { 
  updateParticipantSocket, 
  removeParticipantService,
  getParticipantBySocketId,
  assignRoleService,
  getRoomService
} from '../services/room.service.js';
import { checkPermission } from './permissionGuard.js';
import { broadcastToRoom } from '../utils/socketHelpers.js';

export const handleJoinRoom = (io, socket) => {
  return async (data) => {
    try {
      const { roomId, participantId } = data;
      
      // Update socket ID in DB
      const participant = await updateParticipantSocket(participantId, socket.id);
      
      // Join the actual socket.io room
      socket.join(roomId);
      
      // Get all current participants
      const room = await getRoomService(roomId);
      
      // Broadcast to room: user_joined
      broadcastToRoom(io, roomId, 'user_joined', participant);
      
      // Sync the initial state for the user
      io.to(socket.id).emit('sync_state', room);
    } catch (error) {
      console.error('Error joining room:', error.message);
    }
  };
};

export const handleAssignRole = (io, socket) => {
  return async (data) => {
    try {
      const { participantId, newRole } = data;
      
      // Check if current user is HOST
      const isHost = await checkPermission(socket.id, ['HOST']);
      if (!isHost) {
        return socket.emit('error_message', { message: 'Only HOST can assign roles' });
      }

      const me = await getParticipantBySocketId(socket.id);
      
      // Update role in DB
      const updatedParticipant = await assignRoleService(participantId, newRole);
      
      // Broadcast update
      broadcastToRoom(io, me.roomId, 'role_assigned', updatedParticipant);
    } catch (error) {
      console.error('Error assigning role:', error.message);
    }
  };
};

export const handleRemoveParticipant = (io, socket) => {
  return async (data) => {
    try {
      const { participantId } = data;
      
      // Check if current user is HOST
      const isHost = await checkPermission(socket.id, ['HOST']);
      if (!isHost) {
        return socket.emit('error_message', { message: 'Only HOST can remove participants' });
      }
      
      const me = await getParticipantBySocketId(socket.id);
      
      const removedParticipant = await removeParticipantService(participantId);
      
      // Broadcast update
      broadcastToRoom(io, me.roomId, 'participant_removed', { participantId });
      
      // Potentially kick their socket if we want
      if (removedParticipant.socketId) {
        const targetSocket = io.sockets.sockets.get(removedParticipant.socketId);
        if (targetSocket) {
          targetSocket.leave(me.roomId);
        }
      }
    } catch (error) {
      console.error('Error removing participant:', error.message);
    }
  };
};

export const handleDisconnect = (io, socket) => {
  return async () => {
    try {
      const participant = await getParticipantBySocketId(socket.id);
      if (participant) {
        // Remove from db (or just sync left status)
        // Based on req: "remove participant, broadcast user_left"
        await removeParticipantService(participant.id);
        broadcastToRoom(io, participant.roomId, 'user_left', { participantId: participant.id });
      }
    } catch (error) {
      console.error('Error handling disconnect:', error.message);
    }
  };
};

// --- YouTube Video Synchronization Placeholders Phase 4 ---
export const handleVideoSyncPlaceholders = (io, socket) => {
  socket.on('play', () => {
    // TODO: implement YouTube synchronization in Phase 4
    console.log('Phase 4 placeholder: play');
  });

  socket.on('pause', () => {
    // TODO: implement YouTube synchronization in Phase 4
    console.log('Phase 4 placeholder: pause');
  });

  socket.on('seek', (data) => {
    // TODO: implement YouTube synchronization in Phase 4
    console.log('Phase 4 placeholder: seek', data);
  });

  socket.on('change_video', (data) => {
    // TODO: implement YouTube synchronization in Phase 4
    console.log('Phase 4 placeholder: change_video', data);
  });
};
