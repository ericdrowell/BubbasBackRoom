function text_init() {
  let image = new Image();
  image.onload = function() {
    textContext.drawImage(image, 0, 0);
  };

  image.src = 'alphabet-tiny.png'; 
}

function text_renderLine(str, height, y, context, align) {
  let scale = height / TEXT_HEIGHT;
  let width = text_getWidth(str, height);
  let startX;
  let charWidth = 3;

  // align left
  if (align === -1) {
    startX = OPTIMAL_VIEWPORT_WIDTH/2 - width - 5;
  }
  // align center
  else if (align === 0) {
    startX = OPTIMAL_VIEWPORT_WIDTH/2 - width/2;
  }
  // align right
  if (align === 1) {
    startX = OPTIMAL_VIEWPORT_WIDTH/2 + 5;
  }

  let x = startX;

  context.save();
  context.translate(0, -1 * TEXT_HEIGHT/2);

  for (let n=0; n<str.length; n++) {
    let char = str[n];
    let charCode = char.charCodeAt(0);

    if (char === ' ') {
      x += charWidth * scale;
    }
    else {
      // charCode of a is 97
      let charX;
      let copyWidth;

      if (char === '.') {
        charX = 28;
        copyWidth = 1;
      }
      else {
        charX = (charCode - 97) * charWidth;
        copyWidth = charWidth;
      }

      context.drawImage(textCanvas, MATH_FLOOR(charX * PIXEL_RATIO), 0, copyWidth * PIXEL_RATIO, TEXT_HEIGHT * PIXEL_RATIO, MATH_FLOOR(x), MATH_FLOOR(y), MATH_FLOOR(copyWidth*scale), MATH_FLOOR(TEXT_HEIGHT*scale));
      x += (charWidth + CHAR_SPACING) * scale;
    }

  }

  context.restore();
}

function text_getWidth(str, height) {
  let scale = height / TEXT_HEIGHT;

  let charWidth = 3;
  let width = (charWidth + CHAR_SPACING) * scale * str.length;

  return width;
}