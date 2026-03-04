import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;
if (!SOCKET_URL) {
  console.warn('NEXT_PUBLIC_API_URL is not set. Using current host if in matching environment context.');
}

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
    });
  }
  return socket;
};
