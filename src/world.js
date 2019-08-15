/*
 x  0  1  2  x
 3  4  5  6  7
 8  9  20 10 11
 12 13 14 15 16
 x  17 18 19 x
*/
var LEAVES_GEOMETRY = [
  [-1, -2, -2], // 0
  [0, -2, -2], // 1
  [1, -2, -2], // 2
  [-2, -1, -2], // 3
  [-1, -1, -1], // 4
  [0, -1, -1], // 5
  [1, -1, -1], // 6
  [2, -1, -2], // 7
  [-2, 0, -2], // 8
  [-1, 0, -1], // 9
  [1, 0, -1], // 10
  [2, 0, -2], // 11
  [-2, 1, -2], // 12
  [-1, 1, -1], // 13
  [0, 1, -1], // 14
  [1, 1, -1], // 15
  [2, 1, -2], // 16
  [-1, 2, -2], // 17
  [0, 2, -2], // 18
  [1, 2, -2], // 19
  [0, 0, 0], // 20
];

var world = {};
var numBlocks = 0;

function w_init() {
  world = {
    // big blocky areas of the world.  Infinite world generation works by dynamically
    // assembling blocks
    blocks: {},
    beacon: {},
    monsters: [],
    lasers: [],
    // sparse 3d grid used for fast collision detection
    grid: {}
  };

  numBlocks = 0;

  w_addBlock(0, 0);
  w_addBlocks();
  w_addBeacon();
}

function w_getGridPoint(point) {
  return {
    x: MATH_ROUND(point.x/GRID_CELL_SIZE),
    y: MATH_ROUND(point.y/GRID_CELL_SIZE),
    z: MATH_ROUND(point.z/GRID_CELL_SIZE)
  }
}

function w_updateBeacon() {
  var beacon = world.beacon;
  var rotationEachFrame = BEACON_ROTATION_SPEED * MATH_PI * 2 * elapsedTime / 1000;
  beacon.rotationY += rotationEachFrame;

  var beaconOrbitDistance = BEACON_ORBIT_SPEEED * elapsedTime / 1000;
  var orbitYEachFrame = Math.atan(beaconOrbitDistance / BEACON_DISTANCE);

  beacon.orbitY += orbitYEachFrame;

  w_removeGridCell(beacon);

  beacon.x = Math.cos(beacon.orbitY) * BEACON_DISTANCE;
  beacon.z = Math.sin(beacon.orbitY) * BEACON_DISTANCE;

  w_addObjectToGrid(world.beacon, world.beacon);
}

function w_updateMonsters() {
  world.monsters.forEach(function(monster, n) {
    // if monster is dead
    if (monster.health <= 0) {
      monster.points.forEach(function(point) {
        w_removeGridCell(point);
      }); 
      world.monsters.splice(n, 1);

      //a_soundEffect('die');
      aa.play('monster-die');
    }
    else {
      var firstPoint = monster.points[0];

      // move monster closer to player
      var playerDirection = vec3.create([firstPoint.x - camera.x, 0, firstPoint.z - camera.z]);
      vec3.normalize(playerDirection);

      var distEachFrame = (monster.points[0].y === 0 ? MONSTER_SPEED : MONSTER_JUMP_SPEED) * elapsedTime / 1000;

      if (MATH_RANDOM() < MONSTER_CHANCE_TO_JUMP_PER_FRAME && monster.verticalVelocity === 0) {
        monster.verticalVelocity = (MATH_RANDOM() * (MONSTER_JUMP_MAX_VELOCITY-MONSTER_JUMP_MIN_VELOCITY)) + MONSTER_JUMP_MIN_VELOCITY;
        var distanceFromPlayer = Math.sqrt(
          Math.pow(camera.x - monster.points[0].x, 2) +
          Math.pow(camera.y - monster.points[0].y, 2) +
          Math.pow(camera.z - monster.points[0].z, 2)
        );

        distanceFromPlayer -= 50;
        if (distanceFromPlayer < 1) {
          distanceFromPlayer = 1;
        }
        volume = 1/distanceFromPlayer;

        if (volume < 0.1) {
          volume = 0.1;
        }
        aa.play('monster-jump', volume)
      }

      var verticalDistEachFrame = monster.verticalVelocity * elapsedTime / 1000;

      // d = at
      monster.verticalVelocity -= GRAVITY * (elapsedTime / 1000)

      monster.points.forEach(function(point, n) {
        w_removeGridCell(point);
    
        point.x += playerDirection[0]*distEachFrame*-1;
        point.y += verticalDistEachFrame;
        point.z += playerDirection[2]*distEachFrame*-1;

        if (point.y < n * 2) {
          point.y = n * 2;
          monster.verticalVelocity = 0;
        }

        w_removeGridCell(point);
        w_addObjectToGrid(monster, point);
      });
    } 
  }); 
}

function w_updateLasers() {
  var distEachFrame = LASER_SPEED * elapsedTime / 1000 *-1;
  world.lasers.forEach(function(laser, n) {
    var pitch = laser.pitch+MATH_PI/2;
    var yaw = laser.yaw;

    laser.x += Math.sin(yaw) * Math.sin(pitch) * distEachFrame;
    laser.y += Math.cos(pitch) * distEachFrame;
    laser.z += Math.cos(yaw) * Math.sin(pitch) * distEachFrame;

    var intersectingObj = w_getGridObject(laser);

    // handle hit monster
    if (intersectingObj && intersectingObj.type === 'monster') {
      if (intersectingObj.timout) {
        clearTimeout(intersectingObj.timeout);
      }

      intersectingObj.isHit = true;
      
      world.lasers.splice(n, 1);

      intersectingObj.timeout = setTimeout(function() {
        intersectingObj.isHit = false;
        intersectingObj.health -= 1;
        //a_soundEffect('monster-hurt');
        aa.play('damage');
      }, PAIN_FLASH_DURATION);
    }

    // handle hit tree
    if (w_isNearbyTree(laser)) {
      world.lasers.splice(n, 1);
      //a_soundEffect('laser-hit');
      aa.play('damage');
    }

    // handle hit floor
    if (laser.y <= 0) {
      world.lasers.splice(n, 1);
      //a_soundEffect('laser-hit');
      aa.play('damage');
    }

    // handle laser expire
    if (laser.expire <= now) {
      world.lasers.splice(n, 1);
    }
  });
}

function w_removeGridCell(point) {
  var gridPoint = w_getGridPoint(point);

  for (var x=-1; x<=1; x++) {
    for (var z=-1; z<=1; z++) {
      var key = w_getGridCellKey({
        x: gridPoint.x + x,
        y: gridPoint.y,
        z: gridPoint.z + z
      });
      world.grid[key] = null;
    }
  }


}

function w_getGridObject(point) {
  var gridPoint = w_getGridPoint(point);
  var key = w_getGridCellKey(gridPoint);

  return world.grid[key];
}

function w_getGridCellKey(gridPoint) {
  return gridPoint.x + ':' + gridPoint.y + ':' + gridPoint.z;
}

function w_addObjectToGrid(obj, point) {
  var gridPoint = w_getGridPoint(point);

  // add to all cells around point
  for (var x=-1; x<=1; x++) {
    for (var z=-1; z<=1; z++) {
      var key = w_getGridCellKey({
        x: gridPoint.x + x,
        y: gridPoint.y,
        z: gridPoint.z + z
      });
      world.grid[key] = obj;
    }
  }
  
}

function w_getNearbyObjects(point, dist) {
  var gridPoint = w_getGridPoint(point);
  var objects = [];

  // add to all cells around point
  for (var x=-dist; x<=dist; x++) {
    for (var y=-dist; y<=dist; y++) {
      for (var z=-dist; z<=dist; z++) {
        var key = w_getGridCellKey({
          x: gridPoint.x + x,
          y: gridPoint.y + y,
          z: gridPoint.z + z
        });

        if (world.grid[key]) {
          objects.push(world.grid[key]);
        }
      }
    }
  }

  return objects;
}

function w_getNearbyVerticalObjects(point, dist) {
  var gridPoint = w_getGridPoint(point);
  var objects = [];

  // add to all cells around point
  for (var y=-dist; y<=dist; y++) {

    var key = w_getGridCellKey({
      x: gridPoint.x,
      y: gridPoint.y + y,
      z: gridPoint.z
    });

    if (world.grid[key]) {
      objects.push(world.grid[key]);
    }
  }

  return objects;
}

function w_isNearbyBeacon() {
  var objects = w_getNearbyObjects({
    x: camera.x,
    y: 6,
    z: camera.z
  }, 3);

  for (var key in objects) {
    if (objects[key].type === 'beacon') {
      return true;
    }
  }

  return false;
}

function w_isNearbyTree(point) {
  var objects = w_getNearbyVerticalObjects(point, 1);

  for (var key in objects) {
    if (objects[key].type === 'tree') {
      return true;
    }
  }

  return false;
}

function w_getNearbyTree() {
  var objects = w_getNearbyObjects(camera, 5);

  for (var key in objects) {
    if (objects[key].type === 'tree') {
      return objects[key];
    }
  }

  return null;
}

function w_getNearbyMonsters() {
  var objects = w_getNearbyObjects(camera, 3);

  var monsters = [];

  for (var key in objects) {
    if (objects[key].type === 'monster') {
      monsters.push(objects[key]);
    }
  }

  return monsters;
}

function w_addBeacon() {
  var angle = MATH_RANDOM() * MATH_PI * 2;
  world.beacon = {
    type: 'beacon',
    x: Math.cos(angle) * BEACON_DISTANCE,
    y: 6,
    z: Math.sin(angle) * BEACON_DISTANCE,
    rotationY: 0,
    orbitY: angle
  }

  w_addObjectToGrid(world.beacon, world.beacon);
}

function w_addBlock(x, z) {

  if (world.blocks[x] === undefined) {
    world.blocks[x] = {};
  }

  world.blocks[x][z] = {
    trees: []
  }

  // add trees
  for (var n = 0; n < TREES_PER_BLOCK; n++) {
    var height = 60 + MATH_RANDOM() * 60;
    //var height = 1;
    var newTree = {
      type: 'tree',
      points: [],
      rotationY: MATH_RANDOM() * MATH_PI * 2,
      height: height
    };

    var treeX = (x * BLOCK_SIZE) + (MATH_RANDOM() * BLOCK_SIZE) - BLOCK_SIZE/2;
    var treeZ = (z * BLOCK_SIZE) + (MATH_RANDOM() * BLOCK_SIZE) - BLOCK_SIZE/2;

    if ((treeX > NO_TREE_DISTANCE || treeX < -1 * NO_TREE_DISTANCE)  &&  (treeZ > NO_TREE_DISTANCE || treeZ < -1 * NO_TREE_DISTANCE)  ) {
      for (var i = 0; i < height/4; i++) {
        var treeY = i*4;
        var newTreePoint = {
          x: treeX,
          y: treeY,
          z: treeZ
        };

        newTree.points.push(newTreePoint);

        w_addObjectToGrid(newTree, newTreePoint);
      }

      world.blocks[x][z].trees.push(newTree);
    }
  }

  // add monsters
  if (numBlocks >= 9 && MATH_RANDOM() <= MONSTER_SPAWN_CHANCE) {
    var monsterX = (x * BLOCK_SIZE) + (MATH_RANDOM() * BLOCK_SIZE) - BLOCK_SIZE/2;
    var monsterZ = (z * BLOCK_SIZE) + (MATH_RANDOM() * BLOCK_SIZE) - BLOCK_SIZE/2;

    var newMonster = {
      type: 'monster',
      points: [],
      health: 3,
      verticalVelocity: 0
    }

    for (var i=0; i<4; i++) {
      var newMonsterPoint = {
        x: monsterX,
        y: i*2,
        z: monsterZ
      };
      newMonster.points.push(newMonsterPoint);

      w_addObjectToGrid(newMonster, newMonsterPoint);
    }
    world.monsters.push(newMonster);
  
  }

  numBlocks++;
}

/*
 *     -
 *   1 2 3
 * - 8 0 4 +
 *   7 6 5 
 *     +
 */ 
function w_getSurroundingBlocks() {
  var x = u_convertNegZeroToPosZero(MATH_ROUND(camera.x/BLOCK_SIZE));
  var z = u_convertNegZeroToPosZero(MATH_ROUND(camera.z/BLOCK_SIZE));

  return [
    {x: x, z: z}, // 0
    {x: x-1, z: z-1}, // 1
    {x: x, z: z-1}, // 2
    {x: x+1, z: z-1}, // 3
    {x: x+1, z: z}, // 4
    {x: x+1, z: z+1}, // 5
    {x: x, z: z+1}, // 6
    {x: x-1, z: z+1}, // 7
    {x: x-1, z: z} // 8
  ];
}
   
function w_addBlocks() {
  var blocks = w_getSurroundingBlocks();

  blocks.forEach(function(block) {
    var bx = block.x;
    var bz = block.z;

    if (world.blocks[bx] === undefined) {
      world.blocks[bx] = {};
    }

    if (world.blocks[bx][bz] === undefined) {
      w_addBlock(bx, bz);
    }
  });
}
