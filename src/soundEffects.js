//http://zzfx.3d2k.com/

let soundEffectsMap = {
  'start': 31963,
  'reload-start': 32987, //33977,
  'run': 45902,
  'monster-die': 73712, //45350, //98111,
  'reload': 40892,
  'dialog': 68219, //65613, //72316,
  'dismiss': 68219,
  'jump': 97356, //62106
  'shoot': [9372, 78981],
  'empty-gun': 77166,
  'hit': 63716,
  'story-start': 19443,
  'monster-spawn': 15311,
  'monster-walk': 78628, //4181
  'health': 5171
}

function soundEffects_play(str, volume) {
  let seed = soundEffectsMap[str];

  if (!volume || volume <= 0) {
    volume = 1;
  }
  if (volume > 1) {
    volume = 1;
  }

  //console.log(str, seed)
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



/*

60780
87147
65570
31278
54077
84538*
91585
14212
42816
11993
15311
7537
35772

ring - 28322
possible music pieces
77115
*/

