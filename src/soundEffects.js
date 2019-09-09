//http://zzfx.3d2k.com/

let soundEffectsMap = [
  31963, // 0 - start
  32987, // 1 - reload start
  45902, // 2 - run
  73712, // 3 - monster die
  40892, // 4 - reload
  68219, // 5 - dialog
  97356, // 6 - jump
  [9372, 78981], // 7 - shoot
  77166, // 8 - empty gun
  63716, // 9 - hit
  15311, // 10 - monster spawn
  78628, // 11 - monster walk
  5171 // 12 - health
];

let SOUND_EFFECTS_START = 0;
let SOUND_EFFECTS_RELOAD_START = 1;
let SOUND_EFFECTS_RUN = 2;
let SOUND_EFFECTS_MONSTER_DIE = 3;
let SOUND_EFFECTS_RELOAD = 4;
let SOUND_EFFECTS_DIALOG = 5;
let SOUND_EFFECTS_JUMP = 6;
let SOUND_EFFECTS_SHOOT = 7;
let SOUND_EFFECTS_EMPTY_GUN = 8;
let SOUND_EFFECTS_HIT = 9;
let SOUND_EFFECTS_MONSTER_SPAWN = 10;
let SOUND_EFFECTS_MONSTER_WALK = 11;
let SOUND_EFFECTS_HEALTH = 12;


function soundEffects_play(str, volume) {
  let seed = soundEffectsMap[str];

  if (!volume || volume <= 0) {
    volume = 1;
  }
  if (volume > 1) {
    volume = 1;
  }

  if (seed) {
    if (Array.isArray(seed)) {
      for (let n=0; n<seed.length; n++) {
        ZZFX.z(seed[n], {volume:volume});
      }
    }
    else {
      ZZFX.z(seed, {volume:volume});
    } 
  }
}
