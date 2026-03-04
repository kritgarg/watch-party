import { useState } from 'react';

export default function RoomHeader({ roomId, isHost, room }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px' }}>
      <div>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: 0, fontSize: '28px' }}>
          📺 Watch Room
          <button 
            onClick={handleCopy} 
            className={copied ? "primary" : ""}
            style={{ fontSize: '13px', padding: '8px 16px', margin: 0 }}
          >
            {copied ? '✓ Copied ID' : 'Copy Room ID'}
          </button>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
          <span style={{ 
            color: '#475569', 
            fontSize: '14px', 
            fontFamily: 'monospace', 
            background: '#f1f5f9', 
            padding: '6px 10px', 
            borderRadius: '6px', 
            border: '2px solid #cbd5e1',
            boxShadow: '2px 2px 0px #cbd5e1'
          }}>
            {roomId}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '600' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: room.playState === 'playing' ? '#22c55e' : '#eab308', border: '2px solid #000' }} />
            {room.playState === 'playing' ? 'Playing' : 'Paused'}
          </span>
          <span style={{ 
            background: '#1e293b', 
            color: '#fff', 
            fontSize: '13px', 
            padding: '4px 10px', 
            borderRadius: '16px', 
            fontWeight: 'bold',
            border: '2px solid #000',
            boxShadow: '2px 2px 0px #000'
          }}>
            {isHost ? 'HOST' : 'PARTICIPANT'}
          </span>
        </div>
      </div>
      <div>
        <button 
          onClick={() => window.location.href = '/'} 
          style={{ fontSize: '15px', color: '#ef4444', borderColor: '#ef4444', background: '#fef2f2', boxShadow: '3px 3px 0px #ef4444' }}
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}
