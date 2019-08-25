const ALPHABET_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIEAAAAJAQMAAAAvjd2mAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAIpJREFUCNdjYGFQSHASZAACJhBhwwASaXCYCBdxYmB4LvHseZFwzWOJ09bLQr3idjIwiCzV7PSa7DVlqY6TWqiXUysDw5eF+p1ec4EiGkZqoUY+exkYgEyIGg0uoJqApQwM5RLP2oEiky1eFM7t8rw3nwEEGBkaGBgUFEBMBwewCBsjA1SEscGGAQDqvCg0BsK+agAAAABJRU5ErkJggg==';

const ALPHABET_MAP  = {
  a: [0, 4]
}

function alphabet_init() {
  let image = new Image();
  image.onload = function() {
    alphabetContext.drawImage(image, 0, 0);
  };

  image.src = ALPHABET_BASE64; 
}