var BLOCK_SIZE = 100; //100;
var buffers = {};

function buffers_init() {
  buffers = {
    cube: {
      position: gl_createArrayBuffer([    
        -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, // Front face    
        -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1, // Back face    
        -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, // Top face    
        -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, // Bottom face    
        1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, // Right face    
        -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1 // Left face
      ]),
      normal: gl_createArrayBuffer([    
        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, // Front face    
        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, // Back face   
        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, // Top face    
        0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, // Bottom face    
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // Right face    
        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0 // Left face
      ]),
      texture: gl_createArrayBuffer([    
        0, 0, 1, 0, 1, 1, 0, 1, // Front face   
        1, 0, 1, 1, 0, 1, 0, 0, // Back face   
        0, 1, 0, 0, 1, 0, 1, 1, // Top face    
        1, 1, 0, 1, 0, 0, 1, 0, // Bottom face   
        1, 0, 1, 1, 0, 1, 0, 0, // Right face    
        0, 0, 1, 0, 1, 1, 0, 1 // Left face
      ]),
      index: gl_createElementArrayBuffer([
        0, 1, 2, 0, 2, 3, // Front face
        4, 5, 6, 4, 6, 7, // Back face
        8, 9, 10, 8, 10, 11, // Top face
        12, 13, 14, 12, 14, 15, // Bottom face
        16, 17, 18, 16, 18, 19, // Right face
        20, 21, 22, 20, 22, 23 // Left face
      ])
    },
    plane: {
      position: gl_createArrayBuffer([
        -BLOCK_SIZE/2, 0, -BLOCK_SIZE/2, -BLOCK_SIZE/2, 0, BLOCK_SIZE/2, BLOCK_SIZE/2, 0, BLOCK_SIZE/2, BLOCK_SIZE/2, 0, -BLOCK_SIZE/2
      ]),
      normal: gl_createArrayBuffer([
        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0
      ]),
      texture: gl_createArrayBuffer([
        0, BLOCK_SIZE/4, 0, 0, BLOCK_SIZE/4, 0, BLOCK_SIZE/4, BLOCK_SIZE/4
      ]),
      index: gl_createElementArrayBuffer([
        0, 1, 2, 0, 2, 3
      ])
    }
  }
}
