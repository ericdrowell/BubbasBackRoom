let songGen;

function music_init() {
  songGen = new MusicGenerator(song);

  songGen.getAudioGenerator(function(audioGenerator) {
    var audio = audioGenerator.getAudio();
    audio.loop = true;
    audio.play();
  });
  
};

