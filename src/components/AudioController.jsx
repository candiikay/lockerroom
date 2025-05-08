import { Howl } from 'howler';

class AudioController {
  constructor() {
    // Background music
    this.music = new Howl({
      src: ['/audio/background-music.mp3'],
      loop: true,
      volume: 0.4,
      html5: true
    });

    // Ambient stadium sounds
    this.ambientSound = new Howl({
      src: ['/audio/stadium-ambient.mp3'],
      loop: true,
      volume: 0.2,
      html5: true
    });

    this.isPlaying = false;
  }

  toggle() {
    if (this.isPlaying) {
      this.music.fade(0.4, 0, 1000);
      this.ambientSound.fade(0.2, 0, 1000);
      setTimeout(() => {
        this.music.pause();
        this.ambientSound.pause();
      }, 1000);
    } else {
      this.music.play();
      this.ambientSound.play();
      this.music.fade(0, 0.4, 1000);
      this.ambientSound.fade(0, 0.2, 1000);
    }
    this.isPlaying = !this.isPlaying;
  }

  setVolume(volume) {
    this.music.volume(volume * 0.4);
    this.ambientSound.volume(volume * 0.2);
  }
}

export const audioController = new AudioController(); 