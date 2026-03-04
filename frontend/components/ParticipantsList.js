export default function ParticipantsList({ participants, isHost, myId, onAssignRole, onRemove }) {
  return (
    <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
      <h3 style={{ margin: 0, borderBottom: '2px solid #000', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
        Participants 
        <span style={{ 
          background: '#fde047', 
          padding: '4px 12px', 
          borderRadius: '16px', 
          fontSize: '15px',
          border: '2px solid #000',
          boxShadow: '2px 2px 0px #000'
        }}>
          {participants.length}
        </span>
      </h3>
      <ul style={{ listStyle: 'none', padding: '24px', margin: 0 }}>
        {participants.map((p) => {
          const isMe = p.id === myId;
          return (
            <li key={p.id} style={{ 
              marginBottom: '16px', 
              padding: '16px', 
              background: isMe ? '#f8fafc' : '#fff', 
              border: '2px solid #000',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: isMe ? '4px 4px 0px #cbd5e1' : '4px 4px 0px #000'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '32px', height: '32px', background: '#bfdbfe', borderRadius: '50%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: '14px', border: '2px solid #000' 
                  }}>
                    {p.username.charAt(0).toUpperCase()}
                  </div>
                  {p.username} 
                  {isMe && <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '500' }}>(You)</span>}
                </span>
                <span style={{ 
                  fontSize: '11px', 
                  background: p.role === 'HOST' ? '#0f172a' : p.role === 'MODERATOR' ? '#3b82f6' : '#e2e8f0', 
                  color: p.role === 'PARTICIPANT' ? '#0f172a' : '#fff', 
                  padding: '4px 10px', 
                  borderRadius: '6px', 
                  fontWeight: '800',
                  border: p.role === 'PARTICIPANT' ? '1px solid #cbd5e1' : 'none',
                  letterSpacing: '1px'
                }}>
                  {p.role}
                </span>
              </div>

              {isHost && !isMe && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button onClick={() => onAssignRole(p.id, 'HOST')} style={{ fontSize: '11px', padding: '6px 12px' }}>Make Host</button>
                  <button onClick={() => onAssignRole(p.id, 'MODERATOR')} style={{ fontSize: '11px', padding: '6px 12px' }}>Make Mod</button>
                  <button onClick={() => onRemove(p.id)} style={{ fontSize: '11px', padding: '6px 12px', borderColor: '#ef4444', color: '#ef4444' }}>Kick</button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
