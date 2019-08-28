function textures_createRandom(colors) {
  let canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  let context = canvas.getContext('2d');

  for (let x=0; x<16; x++) {
    for (let y=0; y<16; y++) {
      context.save();
      context.fillStyle = '#' + u_getRandomElement(colors);
      context.fillRect(x, y, 2, 2);
      context.restore();
    }
  }

  return canvas.toDataURL();
}

function textures_createTile(colors) {
  let canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  let context = canvas.getContext('2d');

  for (let x=0; x<16; x++) {
    for (let y=0; y<16; y++) {
      context.save();
      context.fillStyle = '#' + u_getRandomElement(colors);
      context.fillRect(x, y, 2, 2);
      context.restore();
    }
  }

  // tile outline
  context.fillStyle = '#' + colors[0];
  context.fillRect(0, 0, 16, 1);
  context.fillRect(0, 0, 1, 15);

  context.fillStyle = '#' + colors[colors.length-1];
  context.fillRect(0, 15, 16, 1);
  context.fillRect(15, 1, 1, 16);

  return canvas.toDataURL();
}

function textures_init(callback) {
  textures = {
    'dirt': {
      encoding: textures_createRandom([
        '3d3527', 
        '4a493b', 
        '534e3e', 
        '524534', 
        '46433b', 
        '443e2b', 
        '271c10'
      ])
    },
    'mossy-stone': {
      encoding: textures_createTile([
        '464339',
        '282e26',
        '303e1a',
        '444b31',
        '393c2c',
        '33352f',
        '333435',
        '2c2e23',
        '3d3f36',
        '3d3a30',
        '514938',
        '6a6554',
        '2c2e20'
      ])
    },
    'burned-stone': {
      encoding: textures_createRandom([
        '434343', 
        '2f2f2f', 
        '232323', 
        '131313', 
        '272727', 
        '1b1b1b', 
        '0b0b0b'
      ])
    },
    'blood-stone': {
      encoding: textures_createRandom([
        'f6a675', 
        '170503', 
        'a41800', 
        'ac300e', 
        'dbbaa7', 
        '7d1e18', 
        '621a0e'
      ])
    },
    'stone': {
      encoding: textures_createTile([
        '6c6a69',
        '6a5a4b',
        '665f5f',
        '3b3534',
        '645444',
        '292322'  
      ])
    },
    'rotting-wood': {
      encoding: textures_createTile([
        '4f4131',
        '2c2822',
        '353636',
        '4a443a',
        '2d2d2c',
        '4a3c26',
        '31271f',
        '120c09'  
      ])
    },
    'red': {
      encoding: textures_createRandom(['ff0000'])
    },
    'black': {
      encoding: textures_createRandom(['000000'])
    },
    'orange': {
      encoding: textures_createRandom(['ffcc00'])
    },
    'white': {
      encoding: textures_createRandom(['ffffff'])
    }
  };

  let loadedImages = 0;
  let numImages = 0;
  for (let key in textures) {
    (function() {
      numImages++;
      let texture = textures[key];
      let glTexture = texture.glTexture = sceneContext.createTexture();
      let image = texture.image = new Image();
      image.onload = function() {
        scene_initTexture(glTexture, image);
        if (++loadedImages >= numImages) {
          callback();
        }
      };
      
      image.src = texture.encoding;
    })();
  }
};

