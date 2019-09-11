let HEALTH_CUBES = [
  0, 0, 0, 0.5, 0.8, 0.5, // bottom
  0, 0.8, 0, 0.8, 1, 0.8, // top
  0, 1.6, 0, 0.1, 1, 0.1 // straw
];

function items_init() {
  items = [];
}

function items_add(x, y, z) {
  items.push({
    x: x,
    y: y,
    z: z,
    startY: y,
    yaw: 0,
    texture: TEXTURES_HEALTH,
    id: utils_generateId()
  });
}

function items_spawn() {
  items_add(25, 3.5, -27);
  items_buildBuffers();
}

function items_update() {
  items.forEach(function(item, n) {
    item.y = item.startY + 0.5 * Math.sin(now*0.001);
    item.yaw = now * 0.001;

    // if player touches it
    let xDiff = item.x - player.x;
    let yDiff = item.y - player.y;
    let zDiff = item.z - player.z;

    let dist = Math.sqrt(xDiff * xDiff + yDiff * yDiff + zDiff * zDiff);
    if (dist < 3) {
      player.health = 6;
      items.splice(n, 1);
      soundEffects_play(SOUND_EFFECTS_HEALTH);
    }
  });
}

function items_buildBuffers() {
  items.forEach(function(item) {
    let position = [];
    let normal = [];
    let texture = [];
    let index = [];
    let numBlocks = 0;

    for (let n=0; n<HEALTH_CUBES.length; n+=6) {
      let x = HEALTH_CUBES[n];
      let y = HEALTH_CUBES[n+1];
      let z = HEALTH_CUBES[n+2];
      let xSize = HEALTH_CUBES[n+3];
      let ySize = HEALTH_CUBES[n+4];
      let zSize = HEALTH_CUBES[n+5];

      // position buffer
      for (let n = 0; n < CUBE_BUFFERS.position.length; n+=3) {
        position.push(CUBE_BUFFERS.position[n]*xSize + x*2);
        position.push(CUBE_BUFFERS.position[n+1]*ySize + y*2);
        position.push(CUBE_BUFFERS.position[n+2]*zSize + z*2);
      }

      // normal buffer
      utils_concat(normal, CUBE_BUFFERS.normal);

      // texture buffer
      utils_concat(texture, CUBE_BUFFERS.texture);

      // index buffer
      for (let n = 0; n < CUBE_BUFFERS.index.length; n++) {
        index.push(CUBE_BUFFERS.index[n] + (24 * numBlocks));
      }

      item.buffers = {
        position: webgl_createArrayBuffer(sceneContext, position),
        normal: webgl_createArrayBuffer(sceneContext, normal),
        texture: webgl_createArrayBuffer(sceneContext, texture),
        index: webgl_createElementArrayBuffer(sceneContext, index)
      };

      numBlocks++;
    };
  });
}

function items_render() {
  items.forEach(function(item) {
    modelView_save();
    mat4.translate(mvMatrix, [2 * item.x, 2 * item.y, 2 * item.z]);
    mat4.rotate(mvMatrix, -item.yaw, [0, 1, 0]);
    scene_render(item.buffers, textures[item.texture].glTexture);
    modelView_restore();

  });
}