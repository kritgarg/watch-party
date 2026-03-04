import React, { useRef, useEffect } from 'react';
import YouTube from 'react-youtube';

export default function VideoPlayer({ 
  room, 
  myRole, 
  onPlay, 
  onPause, 
  onSeek 
}) {
  const playerRef = useRef(null);
  const isInternalChangeUser = useRef(false);

  // Sync player to server state when room details change
  useEffect(() => {
    if (!playerRef.current || !room) return;

    const player = playerRef.current;
    
    // Set internal flag so we don't re-emit sockets resulting from programmatic changes
    isInternalChangeUser.current = true;
    
    // We only seek if the time difference is greater than 2 seconds (MVP drift tolerance)
    const playerTime = player.getCurrentTime();
    if (Math.abs(playerTime - room.currentTime) > 2) {
      player.seekTo(room.currentTime);
    }
    
    const playerState = player.getPlayerState();
    // 1 is Playing, 2 is Paused in YouTube IFrame API
    if (room.playState === 'playing' && playerState !== 1) {
      player.playVideo();
    } else if (room.playState === 'paused' && playerState === 1) {
      player.pauseVideo();
    }

    // Reset internal flag after a small delay
    setTimeout(() => {
      isInternalChangeUser.current = false;
    }, 500);
  }, [room?.playState, room?.currentTime, room?.videoId]);

  const _onReady = (event) => {
    playerRef.current = event.target;
    if (room?.currentTime > 0) {
      event.target.seekTo(room.currentTime);
    }
    if (room?.playState === 'playing') {
      event.target.playVideo();
    } else {
      event.target.pauseVideo();
    }
  };

  const _onStateChange = (event) => {
    if (isInternalChangeUser.current) return;
    
    const canControl = myRole === 'HOST' || myRole === 'MODERATOR';
    if (!canControl) {
      // Revert state if participant tries to play/pause
      if (room?.playState === 'paused') {
        event.target.pauseVideo();
      } else {
        event.target.playVideo();
      }
      return;
    }

    const playerState = event.data;
    const currentTime = event.target.getCurrentTime();

    // Player state 1 = playing, 2 = paused
    if (playerState === 1 && room?.playState !== 'playing') {
      onPlay(currentTime);
    } else if (playerState === 2 && room?.playState !== 'paused') {
      onPause(currentTime);
    }
  };

  const _onPlaybackRateChange = (event) => {
    // Only intercept seeking using playback rate heuristic or rely on controls component explicitly
  };

  if (!room?.videoId) {
    return (
      <div className="card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '390px', background: '#f8fafc', borderStyle: 'dashed' }}>
        <p style={{ color: '#64748b', fontWeight: '500', fontSize: '18px' }}>Paste a YouTube link below to start</p>
      </div>
    );
  }

  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 0,
      rel: 0,
      modestbranding: 1
    },
  };

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden', background: '#000' }}>
      <YouTube 
        videoId={room.videoId} 
        opts={opts} 
        onReady={_onReady} 
        onStateChange={_onStateChange} 
      />
    </div>
  );
}
