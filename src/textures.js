function textures_create(colors) {
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

function textures_load(callback) {
  textures = {
    'wood': {
      encoding: textures_create([
        '4a493b', 
        '534e3e', 
        '3d3527', 
        '524534', 
        '46433b', 
        '443e2b', 
        '271c10'
      ])
    },
    'mossy-stone': {
      encoding: textures_create([
        '2c2e20',
        '282e26',
        '303e1a',
        '444b31',
        '393c2c',
        '33352f',
        '333435',
        '2c2e23',
        '3d3f36',
        '3d3a30',
        '464339',
        '514938',
        '6a6554'
      ])
    },
    'paper': {
      encoding: textures_create([
        'ece8b9',
        'e4dea2',
        'e9e8b8',
        'e3dea6'
      ])
    },
    'gold': {
      encoding: textures_create([
        'a36f35',
        'b8872a',
        'a17550',
        'ac7f3e'
      ])
    },
    'stone': {
      encoding: textures_create([
        '292322',
        '6a5a4b',
        '665f5f',
        '3b3534',
        '645444',
        '6c6a69'
      ])
    },
    'burned-brick': {
      encoding: textures_create([
        '443f40',
        '211c17',
        '0a0605'
      ])
    },
    'red': {
      encoding: textures_create(['ff0000'])
    },
    'black': {
      encoding: textures_create(['000000'])
    },
    'orange': {
      encoding: textures_create(['ffcc00'])
    },
    'white': {
      encoding: textures_create(['ffffff'])
    }
  };

  let loadedImages = 0;
  let numImages = 0;
  for (let key in textures) {
    (function() {
      numImages++;
      let texture = textures[key];
      let glTexture = texture.glTexture = webglContext.createTexture();
      let image = texture.image = new Image();
      image.onload = function() {
        webgl_initTexture(glTexture, image);
        if (++loadedImages >= numImages) {
          callback();
        }
      };
      
      image.src = texture.encoding;
    })();
  }
};

