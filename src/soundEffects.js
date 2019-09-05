//http://zzfx.3d2k.com/

let soundEffectsMap = {
  'start': 31963,
  'reload-start': 32987, //33977,
  'run': 45902,
  'monster-die': 98111,
  'reload': 40892,
  'dialog': 72316, //72316,
  'dismiss': 79921, //72316,
  'jump': 97356, //62106
  'shoot': [9372, 78981],
  'empty-gun': 77166,
  'hit': 63716
}

function soundEffects_play(str) {
  let seed = soundEffectsMap[str];

  console.log(str, seed)
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

possible music pieces
77115
*/

