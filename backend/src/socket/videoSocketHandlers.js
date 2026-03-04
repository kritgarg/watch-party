import { getParticipantBySocketId, updateRoomStateService } from '../services/room.service.js';
import { checkPermission } from './permissionGuard.js';
import { broadcastToRoom } from '../utils/socketHelpers.js';

const canControlPlayback = async (socketId) => {
  return await checkPermission(socketId, ['HOST', 'MODERATOR']);
};

export const handleVideoEvents = (io, socket) => {
  socket.on('play', async ({ roomId, currentTime }) => {
    try {
      const isAllowed = await canControlPlayback(socket.id);
      if (!isAllowed) return;

      const updateData = { playState: 'playing' };
      if (typeof currentTime === 'number') {
        updateData.currentTime = currentTime; 
      }
      
      await updateRoomStateService(roomId, updateData);
      
      broadcastToRoom(io, roomId, 'play', { currentTime });
    } catch (error) {
      console.error('Error handling play:', error.message);
    }
  });

  socket.on('pause', async ({ roomId, currentTime }) => {
    try {
      const isAllowed = await canControlPlayback(socket.id);
      if (!isAllowed) return;

      const updateData = { playState: 'paused' };
      if (typeof currentTime === 'number') {
        updateData.currentTime = currentTime; 
      }

      await updateRoomStateService(roomId, updateData);
      
      broadcastToRoom(io, roomId, 'pause', { currentTime });
    } catch (error) {
      console.error('Error handling pause:', error.message);
    }
  });

  socket.on('seek', async ({ roomId, time }) => {
    try {
      const isAllowed = await canControlPlayback(socket.id);
      if (!isAllowed) return;

      await updateRoomStateService(roomId, { currentTime: time });
      
      broadcastToRoom(io, roomId, 'seek', { time });
    } catch (error) {
      console.error('Error handling seek:', error.message);
    }
  });

  socket.on('change_video', async ({ roomId, videoId }) => {
    try {
      const isAllowed = await canControlPlayback(socket.id);
      if (!isAllowed) return;

      await updateRoomStateService(roomId, { 
        videoId, 
        currentTime: 0, 
        playState: 'paused'
      });
      
      broadcastToRoom(io, roomId, 'change_video', { videoId });
    } catch (error) {
      console.error('Error handling change_video:', error.message);
    }
  });
};
