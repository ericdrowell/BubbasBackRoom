let songGen;

function music_init(callback) {
  songGen = new MusicGenerator(song);

  songGen.getAudioGenerator(function(audioGenerator) {
    audio = audioGenerator.getAudio();
    audio.loop = true;
    
    callback();
  });
};

function music_start() {
  audio.play();
}

