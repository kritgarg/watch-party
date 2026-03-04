import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  console.warn('NEXT_PUBLIC_API_URL is missing. API calls may fail.');
}

export const api = axios.create({
  baseURL: API_URL,
});

export const createRoom = async (username) => {
  const response = await api.post('/rooms', { username });
  return response.data; // { roomId, participantId, role }
};

export const joinRoom = async (roomId, username) => {
  const response = await api.post(`/rooms/${roomId}/join`, { username });
  return response.data; // { participantId, role }
};

export const getRoom = async (roomId) => {
  const response = await api.get(`/rooms/${roomId}`);
  return response.data; // Room with participants
};
