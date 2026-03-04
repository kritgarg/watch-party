'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useRoomSocket } from '../../../hooks/useRoomSocket.js';
import RoomHeader from '../../../components/RoomHeader.js';
import ParticipantsList from '../../../components/ParticipantsList.js';
import RoomControls from '../../../components/RoomControls.js';
import VideoPlayer from '../../../components/VideoPlayer.js';

export default function RoomPage({ params }) {
  const unwrappedParams = use(params);
  const roomId = unwrappedParams.roomId;
  
  const router = useRouter();
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    // get user ID from local storage
    const stored = localStorage.getItem(`_wp_user_${roomId}`);
    if (!stored) {
      alert("You need to enter a username first.");
      router.push('/');
      return;
    }
    setLocalUser(JSON.parse(stored));
  }, [roomId, router]);

  const { 
    room, 
    error, 
    assignRole, 
    removeParticipant,
    handlePlay,
    handlePause,
    handleSeek,
    handleChangeVideo
  } = useRoomSocket(roomId, localUser?.participantId);

  if (!room || !localUser) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ padding: '24px', background: '#fff', border: '2px solid #000', boxShadow: '4px 4px 0px #000', borderRadius: '12px', fontWeight: 'bold' }}>
          Loading Room {roomId}...
        </div>
      </div>
    );
  }

  const myParticipant = room.participants.find(p => p.id === localUser.participantId);
  const myRole = myParticipant?.role || 'PARTICIPANT';
  const isHost = myRole === 'HOST';

  return (
    <div className="container" style={{ maxWidth: '1200px' }}>
      {error && (
        <div style={{ background: '#fef2f2', color: '#ef4444', border: '2px solid #ef4444', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: 'bold', boxShadow: '2px 2px 0px #ef4444' }}>
          {error}
        </div>
      )}
      
      <RoomHeader roomId={roomId} isHost={isHost} room={room} />
      
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column' }}>
          <VideoPlayer 
            room={room} 
            myRole={myRole} 
            onPlay={handlePlay} 
            onPause={handlePause} 
            onSeek={handleSeek} 
          />
          <RoomControls 
            room={room}
            myRole={myRole} 
            onPlay={handlePlay} 
            onPause={handlePause} 
            onSeek={handleSeek} 
            onChangeVideo={handleChangeVideo} 
          />
        </div>

        <div style={{ flex: '1 1 300px' }}>
          <ParticipantsList 
            participants={room.participants} 
            isHost={isHost} 
            myId={localUser.participantId}
            onAssignRole={assignRole}
            onRemove={removeParticipant}
          />
        </div>
      </div>
    </div>
  );
}
