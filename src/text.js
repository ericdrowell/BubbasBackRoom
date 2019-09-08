function text_renderLine(str, height, y, context, align) {
  let scale = height / TEXT_HEIGHT;
  let width = text_getWidth(str, height);
  let startX;

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
  context.translate(0, 0);

  for (let n=0; n<str.length; n++) {
    let char = str[n];
    let charCode = char.charCodeAt(0);

    if (char === ' ') {
      x += CHAR_WIDTH * scale;
    }
    else {
      // charCode of a is 97
      let charX;
      let copyWidth;

      if (char === '.') {
        charX = 28*15;
        copyWidth = CHAR_WIDTH/3;
      }
      else if (char === '@') {
        charX = 78*15;
        copyWidth = CHAR_WIDTH;
      }
      else {
        charX = (charCode - 97) * CHAR_WIDTH;
        copyWidth = CHAR_WIDTH;
      }

      //console.log(MATH_FLOOR(charX * PIXEL_RATIO), 0, copyWidth * PIXEL_RATIO, TEXT_HEIGHT * PIXEL_RATIO, MATH_FLOOR(x), MATH_FLOOR(y), MATH_FLOOR(copyWidth*scale), MATH_FLOOR(TEXT_HEIGHT*scale))
      //context.drawImage(textCanvas, MATH_FLOOR(charX * PIXEL_RATIO), 0, copyWidth * PIXEL_RATIO, TEXT_HEIGHT * PIXEL_RATIO, MATH_FLOOR(x), MATH_FLOOR(y), MATH_FLOOR(copyWidth*scale), MATH_FLOOR(TEXT_HEIGHT*scale));
      hudContext.save();
      hudContext.translate(MATH_FLOOR(x), MATH_FLOOR(y));
      hudContext.scale(scale, scale);
      sprite_draw(hudContext, MATH_CEIL(charX), 270, copyWidth, TEXT_HEIGHT);
      hudContext.restore();
      x += (CHAR_WIDTH + CHAR_SPACING) * scale;
    }

  }

  context.restore();
}

function text_getWidth(str, height) {
  let scale = height / TEXT_HEIGHT;

  let width = (CHAR_WIDTH + CHAR_SPACING) * scale * str.length;

  return width;
}