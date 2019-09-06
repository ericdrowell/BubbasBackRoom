//http://zzfx.3d2k.com/

let soundEffectsMap = {
  'start': 31963,
  'reload-start': 32987, //33977,
  'run': 45902,
  'monster-die': 45350, //98111,
  'reload': 40892,
  'dialog': 68219, //65613, //72316,
  'dismiss': 68219,
  'jump': 97356, //62106
  'shoot': [9372, 78981],
  'empty-gun': 77166,
  'hit': 63716,
  'story-start': 19443
}

function soundEffects_play(str) {
  let seed = soundEffectsMap[str];

  //console.log(str, seed)
  if (seed) {
    if (Array.isArray(seed)) {
      for (let n=0; n<seed.length; n++) {
        ZZFX.z(seed[n]);
      }
    }
    else {
      ZZFX.z(seed);
    }
    
  }
  
}



/*

60780
87147
65570
31278
54077
84538
91585
14212
42816
11993
15311
7537

possible music pieces
77115
*/

