import React, { useState, useRef, useEffect } from 'react';
import { Howl, Howler } from 'howler';

const playlists = {
  'Hip-Hop': [
    // Replace with your own or royalty-free tracks
    { title: 'Hip-Hop Beat 1', url: 'https://cdn.pixabay.com/audio/2022/10/16/audio_12b6b6b6b6.mp3' },
    { title: 'Hip-Hop Beat 2', url: 'https://cdn.pixabay.com/audio/2022/10/16/audio_12b6b6b6b7.mp3' },
  ],
  'R&B': [
    { title: 'R&B Groove 1', url: 'https://cdn.pixabay.com/audio/2022/10/16/audio_12b6b6b6b8.mp3' },
    { title: 'R&B Groove 2', url: 'https://cdn.pixabay.com/audio/2022/10/16/audio_12b6b6b6b9.mp3' },
  ],
  'Techno/Pregame': [
    { title: 'Techno Pulse 1', url: 'https://cdn.pixabay.com/audio/2022/10/16/audio_12b6b6b6c0.mp3' },
    { title: 'Techno Pulse 2', url: 'https://cdn.pixabay.com/audio/2022/10/16/audio_12b6b6b6c1.mp3' },
  ],
};

export default function MusicPlayerPanel({ open, onClose }) {
  const [currentPlaylist, setCurrentPlaylist] = useState('Hip-Hop');
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const soundRef = useRef(null);

  useEffect(() => {
    if (open) setIsPlaying(true);
  }, [open]);

  useEffect(() => {
    Howler.volume(volume);
  }, [volume]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.unload();
      soundRef.current = null;
    }
    if (isPlaying) {
      const track = playlists[currentPlaylist][currentTrack];
      soundRef.current = new Howl({ src: [track.url], volume });
      soundRef.current.play();
      soundRef.current.on('end', () => {
        setCurrentTrack((prev) => (prev + 1) % playlists[currentPlaylist].length);
      });
    }
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
        soundRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [currentPlaylist, currentTrack, isPlaying]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => {
      if (prev && soundRef.current) soundRef.current.pause();
      return !prev;
    });
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % playlists[currentPlaylist].length);
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + playlists[currentPlaylist].length) % playlists[currentPlaylist].length);
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: 40,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(30,30,40,0.97)',
      color: '#fff',
      borderRadius: 16,
      boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
      padding: 24,
      zIndex: 10000,
      minWidth: 320,
      maxWidth: 400,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'inherit',
    }}>
      <div style={{ marginBottom: 12, fontWeight: 700, fontSize: 18 }}>Set the Vibe 🎵</div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        {Object.keys(playlists).map((name) => (
          <button
            key={name}
            onClick={() => { setCurrentPlaylist(name); setCurrentTrack(0); setIsPlaying(false); }}
            style={{
              background: name === currentPlaylist ? '#ff69b4' : '#fff',
              color: name === currentPlaylist ? '#fff' : '#222',
              border: 'none',
              borderRadius: 8,
              padding: '6px 14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <div style={{ marginBottom: 10, fontSize: 16, fontWeight: 500 }}>
        {playlists[currentPlaylist][currentTrack].title}
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
        <button onClick={handlePrev} style={{ fontSize: 18, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>⏮️</button>
        <button onClick={handlePlayPause} style={{ fontSize: 22, background: '#ff69b4', color: '#fff', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer' }}>{isPlaying ? '⏸️' : '▶️'}</button>
        <button onClick={handleNext} style={{ fontSize: 18, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>⏭️</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 14 }}>🔊</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          style={{ width: 120 }}
        />
        <span style={{ fontSize: 14 }}>{Math.round(volume * 100)}%</span>
      </div>
      <button onClick={onClose} style={{ marginTop: 8, background: 'none', color: '#ff69b4', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Close</button>
    </div>
  );
} 