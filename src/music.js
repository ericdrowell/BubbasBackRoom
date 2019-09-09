function music_init(callback) {
	audio_ctx = new (window.webkitAudioContext||window.AudioContext)();
  sonantxr_generate_song(audio_ctx, song, function(buffer){
    musicBuffer = buffer;
  	callback();
  });
}

function music_play(buffer, loop) {
	var source = audio_ctx.createBufferSource();
	source.buffer = buffer;
	source.loop = loop;
	source.connect(audio_ctx.destination);
	source.start();
	musicPlaying = true;
};

function music_start() {
	if (!musicPlaying) {
    music_play(musicBuffer, true);
	}
}