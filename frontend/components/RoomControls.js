import { useState } from 'react';

export default function RoomControls({ room, myRole, onPlay, onPause, onSeek, onChangeVideo }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [loadingAction, setLoadingAction] = useState(null);
  const canControl = myRole === 'HOST' || myRole === 'MODERATOR';

  const handleAction = (actionName, actionFn) => {
    setLoadingAction(actionName);
    actionFn();
    setTimeout(() => setLoadingAction(null), 800);
  };

  if (!canControl) {
    return (
      <div className="card" style={{ marginTop: '24px', background: '#f1f5f9', borderColor: '#94a3b8', borderStyle: 'dashed' }}>
        <p style={{ margin: 0, color: '#475569', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '500' }}>
          <span style={{ fontSize: '24px' }}>🔒</span> Playback controls are restricted to the Host.
        </p>
      </div>
    );
  }

  const handleChangeVideo = () => {
    let videoId = videoUrl;
    try {
      if (videoUrl.includes('v=')) {
        videoId = videoUrl.split('v=')[1].split('&')[0];
      } else if (videoUrl.includes('youtu.be/')) {
        videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
      }
    } catch (e) {
      console.error(e);
    }
    if (videoId) onChangeVideo(videoId);
    setVideoUrl('');
  };

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '20px' }}>Playback Controls</h3>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input 
          type="text" 
          placeholder="Paste YouTube URL or Video ID" 
          value={videoUrl}
          onChange={e => setVideoUrl(e.target.value)}
          style={{ marginBottom: 0, flex: 1 }}
        />
        <button className="primary" onClick={() => handleAction('change', handleChangeVideo)} disabled={loadingAction === 'change' || !videoUrl} style={{ whiteSpace: 'nowrap', padding: '12px 24px' }}>
          {loadingAction === 'change' ? 'Syncing...' : 'Change Video'}
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button onClick={() => handleAction('play', () => onPlay())} disabled={loadingAction === 'play'}>
          {loadingAction === 'play' ? '...' : '▶ Play'}
        </button>
        <button onClick={() => handleAction('pause', () => onPause())} disabled={loadingAction === 'pause'}>
          {loadingAction === 'pause' ? '...' : '⏸ Pause'}
        </button>
        <button onClick={() => handleAction('seek', () => onSeek(room?.currentTime ? room.currentTime + 10 : 10))} disabled={loadingAction === 'seek'} style={{ marginLeft: 'auto' }}>
          {loadingAction === 'seek' ? '...' : '⏭ Forward 10s'}
        </button>
      </div>
    </div>
  );
}
