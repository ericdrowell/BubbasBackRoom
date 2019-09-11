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

// function music_playRange() {
// 	setTimeout(function() {
// 		music_playNote(0);
// 	}, 0);

// 	setTimeout(function() {
// 		music_playNote(0);
// 	}, 3000);

// 	setTimeout(function() {
// 		music_playNote(1);
// 	}, 6000);

// 	setTimeout(function() {
// 		music_playNote(2);
// 	}, 9000);
// }

// function music_start() {
//   if (!musicPlaying) {
		
//     music_playRange();
// 		setInterval(function() {
//       music_playRange();
// 		}, 12000);

// 		musicPlaying = true;
// 	}	
// }

// function music_playNote(index) {
// 	switch (index) {
// 		//case 0: ZZFX.z(66618,{randomness:0,frequency:100,attack:.9,slide:0,noise:3,modulation:0,modulationPhase:0}); break;
// 		// case 0: ZZFX.z(47274,{randomness:0,frequency:55,length:4,noise:0.5,modulation:0}); break;
// 		// case 1: ZZFX.z(47274,{randomness:0,frequency:85,length:4,noise:0.5,modulation:0}); break;
// 		// case 2: ZZFX.z(47274,{randomness:0,frequency:80,length:4,noise:0.5,modulation:0}); break;
// 		// case 0: ZZFX.z(33921,{randomness:0,frequency:100,length:3,slide:0,noise:2}); break;
// 		// case 1: ZZFX.z(33921,{randomness:0,frequency:300,length:3,slide:0,noise:2}); break;
// 		// case 2: ZZFX.z(33921,{randomness:0,frequency:250,length:3,slide:0,noise:2}); break;
// 		case 0: ZZFX.z(45384,{randomness:0,frequency:80,length:3}); break;
// 		case 1: ZZFX.z(45384,{randomness:0,frequency:120,length:3}); break;
// 		case 2: ZZFX.z(45384,{randomness:0,frequency:95,length:3}); break;
// 	}
// }