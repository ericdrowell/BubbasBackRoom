var textures = {};

function textures_create(colors) {
  var canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  var context = canvas.getContext('2d');

  for (var x=0; x<16; x++) {
    for (var y=0; y<16; y++) {
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
    tree: {
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
    ground: {
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
    leaves: {
      encoding: textures_create([
        '51531f',
        '4e5315',
        '545617',
        '4c4d13',
        '252108',
        '33370a',
        '474d13',
        '383c0d',
      ])
    },
    red: {
      encoding: textures_create(['ff0000'])
    },
    shadow: {
      encoding: textures_create(['000000'])
    },
    monster: {
      encoding: textures_create([
        '5f3b88', 
        '56367e',
        '4d3279', 
        '553783',
        '412d6f', 
        '3b2866',
        '4b337a', 
        '563986',
        '4e3179', 
        '54367f',
        '663f8f', 
        '382460'
      ])
    },
    orange: {
      encoding: textures_create(['ffcc00'])
    },
    white: {
      encoding: textures_create(['ffffff'])
    }
  };

  var loadedImages = 0;
  var numImages = 0;
  for (var key in textures) {
    (function() {
      numImages++;
      var texture = textures[key];
      var glTexture = texture.glTexture = context.createTexture();
      var image = texture.image = new Image();
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

