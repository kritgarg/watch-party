'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRoom, joinRoom } from '../lib/api.js';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [loadingAction, setLoadingAction] = useState(null);
  const router = useRouter();

  const handleCreateRoom = async () => {
    if (!username) return alert('Enter a username');
    setLoadingAction('create');
    try {
      const data = await createRoom(username);
      localStorage.setItem(`_wp_user_${data.roomId}`, JSON.stringify({
        participantId: data.participantId,
        username,
        role: data.role
      }));
      router.push(`/room/${data.roomId}`);
    } catch (err) {
      alert('Error creating room');
      setLoadingAction(null);
    }
  };

  const handleJoinRoom = async () => {
    if (!username || !roomId) return alert('Enter a username and room ID');
    setLoadingAction('join');
    try {
      const data = await joinRoom(roomId, username);
      localStorage.setItem(`_wp_user_${roomId}`, JSON.stringify({
        participantId: data.participantId,
        username,
        role: data.role
      }));
      router.push(`/room/${roomId}`);
    } catch (err) {
      alert('Error joining room');
      setLoadingAction(null);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <span style={{ fontSize: '28px' }}>📺</span> WatchParty.
        </div>
      </nav>

      <div className="container" style={{ marginTop: '40px' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="highlight-badge">Real-Time Video Sync Copilot</div>
          <h1 className="hero-title">
            Watch Videos.<br/>
            Together.
          </h1>
          <p className="hero-subtitle">
            Create a room, invite your friends, and watch YouTube videos in perfect synchronization. No guessing, no latency.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', marginTop: '80px', flexWrap: 'wrap' }}>
          <div className="card" style={{ flex: '1', minWidth: '320px', maxWidth: '420px' }}>
            <h2 style={{ marginTop: 0, fontSize: '24px' }}>Host a Party</h2>
            <p style={{ color: '#4b5563', fontSize: '15px', marginBottom: '24px' }}>Create a room and invite others. You will be assigned the Host role.</p>
            <input 
              type="text" 
              placeholder="Your Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
            <button className="primary" style={{ width: '100%', marginTop: '12px', fontSize: '16px', padding: '14px' }} onClick={handleCreateRoom} disabled={loadingAction === 'create'}>
              {loadingAction === 'create' ? 'Creating...' : 'Get Started →'}
            </button>
          </div>

          <div className="card" style={{ flex: '1', minWidth: '320px', maxWidth: '420px', background: '#f8fafc' }}>
            <h2 style={{ marginTop: 0, fontSize: '24px' }}>Join a Room</h2>
            <p style={{ color: '#4b5563', fontSize: '15px', marginBottom: '24px' }}>Enter the room ID shared by your friends to join.</p>
            <input 
              type="text" 
              placeholder="Your Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
              type="text" 
              placeholder="Room ID" 
              value={roomId} 
              onChange={(e) => setRoomId(e.target.value)} 
            />
            <button style={{ width: '100%', marginTop: '12px', fontSize: '16px', padding: '14px' }} onClick={handleJoinRoom} disabled={loadingAction === 'join'}>
              {loadingAction === 'join' ? 'Joining...' : 'Enter Room →'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
