const TEXT_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIEAAAAJAQMAAAAvjd2mAAAABlBMVEUAAACVjnilYY8fAAAAAXRSTlMAQObYZgAAAIpJREFUCNdjYGFQSHASZAACJhBhwwASaXCYCBdxYmB4LvHseZFwzWOJ09bLQr3idjIwiCzV7PSa7DVlqY6TWqiXUysDw5eF+p1ec4EiGkZqoUY+exkYgEyIGg0uoJqApQwM5RLP2oEiky1eFM7t8rw3nwEEGBkaGBgUFEBMBwewCBsjA1SEscGGAQDqvCg0BsK+agAAAABJRU5ErkJggg==';

const TEXT_MAP  = {
  a: [0, 4],
  b: [5, 4],
  c: [10, 4],
  d: [15, 4],
  e: [20, 4],
  f: [24, 3],
  g: [28, 4],
  h: [33, 4],
  i: [38, 1],
  j: [39, 2],
  k: [43, 4],
  l: [47, 1],
  m: [49, 6],
  n: [56, 4],
  o: [61, 4],
  p: [66, 4],
  q: [71, 4],
  r: [76, 4],
  s: [81, 4],
  t: [86, 3],
  u: [90, 4],
  v: [94, 4],
  w: [99, 5],
  x: [105, 4],
  y: [110, 4],
  z: [115, 4],
  '@': [120, 8]
}

function text_init() {
  let image = new Image();
  image.onload = function() {
    textContext.drawImage(image, 0, 0);
  };

  image.src = TEXT_BASE64; 
}

function text_renderLine(str, startX, y, height, context) {
  let scale = height / TEXT_HEIGHT;
  let textColor = '#958e78';
  let x = startX;

  context.save();
  context.translate(0, -1 * TEXT_HEIGHT/2);

  for (let n=0; n<str.length; n++) {
    let char = str[n];
    let charObj = TEXT_MAP[char];

    if (char === ' ') {
      x += 4 * scale;
    }
    else if (char === '.') {
      context.fillStyle = textColor;
      context.fillRect(x, y+6*scale, scale, scale);
      x += (1 + CHAR_SPACING) * scale;
    }
    else if (charObj) {
      let charX = charObj[0];
      let charWidth = charObj[1];
      context.drawImage(textCanvas, charX * PIXEL_RATIO, 0, charWidth * PIXEL_RATIO, TEXT_HEIGHT * PIXEL_RATIO, x, y, charWidth*scale, TEXT_HEIGHT*scale);
      x += (charWidth + CHAR_SPACING) * scale;
    }

  }

  context.restore();
}

function text_getWidth(str, height) {
  let scale = height / TEXT_HEIGHT;

  let width = 0;

  for (let n=0; n<str.length; n++) {
    let char = str[n];
    let charObj = TEXT_MAP[char];

    if (char === ' ') {
      width += 4 * scale;
    }
    else if (char === '.') {
      width += (1 + CHAR_SPACING) * scale;
    }
    else if (charObj) {
      let charX = charObj[0];
      let charWidth = charObj[1];
      width += (charWidth + CHAR_SPACING) * scale;
    }
  }

  return width;
}