import { Howl } from 'howler';
import { create } from 'zustand';

// Create a store for managing audio state
export const useAudioStore = create((set) => ({
  isPlaying: false,
  volume: 0.5,
  setPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume })
}));

class AudioController {
  constructor() {
    this.sound = new Howl({
      src: ['/music/background.mp3'],
      loop: true,
      volume: 0.5,
      autoplay: false,
      onload: () => {
        console.log('Background music loaded');
      },
      onplay: () => {
        useAudioStore.getState().setPlaying(true);
      },
      onstop: () => {
        useAudioStore.getState().setPlaying(false);
      },
      onend: () => {
        useAudioStore.getState().setPlaying(false);
      }
    });
  }

  toggle() {
    if (this.sound.playing()) {
      this.sound.pause();
    } else {
      this.sound.play();
    }
  }

  setVolume(value) {
    this.sound.volume(value);
    useAudioStore.getState().setVolume(value);
  }

  cleanup() {
    this.sound.unload();
  }
}

// Singleton instance
export const audioController = new AudioController(); 