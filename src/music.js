/*
  C     C#    D     Eb    E     F     F#    G     G#    A     Bb    B
0 16.35 17.32 18.35 19.45 20.60 21.83 23.12 24.50 25.96 27.50 29.14 30.87
1 32.70 34.65 36.71 38.89 41.20 43.65 46.25 49.00 51.91 55.00 58.27 61.74
2 65.41 69.30 73.42 77.78 82.41 87.31 92.50 98.00 103.8 110.0 116.5 123.5
3 130.8 138.6 146.8 155.6 164.8 174.6 185.0 196.0 207.7 220.0 233.1 246.9
4 261.6 277.2 293.7 311.1 329.6 349.2 370.0 392.0 415.3 440.0 466.2 493.9
5 523.3 554.4 587.3 622.3 659.3 698.5 740.0 784.0 830.6 880.0 932.3 987.8
6 1047  1109  1175  1245  1319  1397  1480  1568  1661  1760  1865  1976
7 2093  2217  2349  2489  2637  2794  2960  3136  3322  3520  3729  3951
8 4186  4435  4699  4978  5274  5588  5920  6272  6645  7040  7459  7902
*/
var musicTimeout = null;

var MUSIC = {
  menu: {
    notes: [
      [61.74, 0.13, 0.15],
      [61.74, 0.13, 0.30],
      [61.74, 0.13, 0.30],
      [61.74, 0.13, 0.15],
      [61.74, 0.13, 0.15],
      [61.74, 0.13, 0.15],
      [61.74, 0.13, 0.30],
      [61.74, 0.13, 0.30],
      [61.74, 0.13, 0.60],

      [51.91, 0.13, 0.15],
      [51.91, 0.13, 0.30],
      [51.91, 0.13, 0.30],
      [51.91, 0.13, 0.15],
      [51.91, 0.13, 0.15],
      [51.91, 0.13, 0.15],
      [51.91, 0.13, 0.30],
      [51.91, 0.13, 0.30],
      [51.91, 0.13, 0.60],

      [41.20, 0.13, 0.15],
      [41.20, 0.13, 0.30],
      [41.20, 0.13, 0.30],
      [41.20, 0.13, 0.15],
      [41.20, 0.13, 0.15],
      [41.20, 0.13, 0.15],
      [41.20, 0.13, 0.30],
      [41.20, 0.13, 0.30],
      [41.20, 0.13, 0.60],

      [61.74, 0.13, 0.15],
      [61.74, 0.13, 0.30],
      [61.74, 0.13, 0.30],
      [61.74, 0.13, 0.15],
      [61.74, 0.13, 0.15],
      [61.74, 0.13, 0.15],
      [61.74, 0.13, 0.30],
      [61.74, 0.13, 0.30],
      [61.74, 0.13, 0.60],
    ]
  },
  play: {
    notes: [
      [65.41, 0.3, 0.5],
      [65.41, 0.3, 0.5],
      [65.41, 0.15, 0.25],
      [69.30, 0.15, 0.25],
      [65.41, 0.3, 0.5],
      [65.41, 0.15, 0.25],
      [69.30, 0.15, 0.25],
      [65.41, 0.15, 0.25],
      [61.74, 0.15, 0.25],
      [65.41, 0.3, 1],
    ]
  }
};


var songAudioContext;
var songGain;
var soundEffectAudioContext;
var soundEffectGain;

function a_init() {
  soundEffectAudioContext = new AudioContext()
}

function a_initAudioContext() {
  if (songAudioContext) {
    songAudioContext.close();
  }
  songAudioContext = new AudioContext()
}

function a_stopMusic() {
  if (musicTimeout) {
    clearTimeout(musicTimeout);
  }
  a_initAudioContext();
}

function a_playMusic(music, volume) {
  var time = 0;
  var loops = [];

  if (musicTimeout) {
    clearTimeout(musicTimeout);
  }

  a_initAudioContext();


  for (var n=0; n<1; n++) {
    loops = loops.concat(MUSIC[music].notes);
  }

  loops.forEach(function(note, n) {
    var freq = note[0];
    var duration = note[1];
    var wait = note[2];

    a_playSound(freq, time, duration, volume, songAudioContext);
    time+=wait;
  });

  musicTimeout = setTimeout(function() {
    a_playMusic(music, volume);
  }, time * 1000);
}


function a_playSound(freq, start, duration, volume, audioContext, easing, type) {
  var oscillator = audioContext.createOscillator();

  var gain = audioContext.createGain();
  gain.connect(audioContext.destination);

  oscillator.connect(gain);
  oscillator.frequency.value = freq;
  oscillator.type = type || 'square';
  gain.gain.value = volume;

  if (easing === 'ease-in') {
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(volume, audioContext.currentTime + start + duration);
  }
  else if (easing === 'ease-out') {
    gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + start + duration);
  }
  else if (easing === 'ease-in-out') {
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(volume, audioContext.currentTime + start + duration*0.5);
    gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + start + duration);
  }

  // if (attack !== start) {
  //   gain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + start + attack);
  // }

  // if (decay !== duration) {
  //   gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + start + decay);
  // }

  oscillator.start(audioContext.currentTime + start);
  oscillator.stop(audioContext.currentTime + start + duration);
}