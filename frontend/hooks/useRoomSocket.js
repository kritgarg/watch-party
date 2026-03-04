import { useEffect, useState } from 'react';
import { getSocket } from '../lib/socket.js';

export const useRoomSocket = (roomId, participantId) => {
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!participantId) return;

    const socket = getSocket();
    socket.connect();

    // Emit join event
    socket.emit('join_room', { roomId, participantId });

    socket.on('sync_state', (data) => {
      setRoom(data);
    });

    socket.on('user_joined', (participant) => {
      setRoom((prev) => {
        if (!prev) return prev;
        // Don't duplicate if already in
        const exists = prev.participants.find(p => p.id === participant.id);
        if (exists) return prev;
        return { ...prev, participants: [...prev.participants, participant] };
      });
    });

    socket.on('role_assigned', (updatedParticipant) => {
      setRoom((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          participants: prev.participants.map(p => 
            p.id === updatedParticipant.id ? updatedParticipant : p
          )
        };
      });
    });

    socket.on('participant_removed', ({ participantId: removedId }) => {
      if (removedId === participantId) {
        alert('You have been kicked from the room.');
        window.location.href = '/';
        return;
      }
      setRoom((prev) => {
        if (!prev) return prev;
        return { ...prev, participants: prev.participants.filter(p => p.id !== removedId) };
      });
    });

    socket.on('user_left', ({ participantId: leftId }) => {
      setRoom((prev) => {
        if (!prev) return prev;
        return { ...prev, participants: prev.participants.filter(p => p.id !== leftId) };
      });
    });

    socket.on('error_message', ({ message }) => {
      setError(message);
      // Auto clear error
      setTimeout(() => setError(null), 3000);
    });

    socket.on('play', ({ currentTime }) => {
      setRoom((prev) => {
        if (!prev) return prev;
        const updates = { playState: 'playing' };
        if (typeof currentTime === 'number') updates.currentTime = currentTime;
        return { ...prev, ...updates };
      });
    });

    socket.on('pause', ({ currentTime }) => {
      setRoom((prev) => {
        if (!prev) return prev;
        const updates = { playState: 'paused' };
        if (typeof currentTime === 'number') updates.currentTime = currentTime;
        return { ...prev, ...updates };
      });
    });

    socket.on('seek', ({ time }) => {
      setRoom((prev) => {
        if (!prev) return prev;
        return { ...prev, currentTime: time };
      });
    });

    socket.on('change_video', ({ videoId }) => {
      setRoom((prev) => {
        if (!prev) return prev;
        return { ...prev, videoId, currentTime: 0, playState: 'paused' };
      });
    });

    return () => {
      socket.off('sync_state');
      socket.off('user_joined');
      socket.off('role_assigned');
      socket.off('participant_removed');
      socket.off('user_left');
      socket.off('error_message');
      socket.off('play');
      socket.off('pause');
      socket.off('seek');
      socket.off('change_video');
      socket.disconnect();
    };
  }, [roomId, participantId]);

  const assignRole = (targetParticipantId, newRole) => {
    getSocket().emit('assign_role', { participantId: targetParticipantId, newRole });
  };

  const removeParticipant = (targetParticipantId) => {
    getSocket().emit('remove_participant', { participantId: targetParticipantId });
  };

  const handlePlay = (currentTime) => getSocket().emit('play', { roomId, currentTime });
  const handlePause = (currentTime) => getSocket().emit('pause', { roomId, currentTime });
  const handleSeek = (time) => getSocket().emit('seek', { roomId, time });
  const handleChangeVideo = (videoId) => getSocket().emit('change_video', { roomId, videoId });

  return { 
    room, 
    error, 
    assignRole, 
    removeParticipant,
    handlePlay,
    handlePause,
    handleSeek,
    handleChangeVideo
  };
};
