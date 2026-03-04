export const broadcastToRoom = (io, roomId, event, data) => {
  io.to(roomId).emit(event, data);
};

export const emitToSocket = (io, socketId, event, data) => {
  io.to(socketId).emit(event, data);
};
