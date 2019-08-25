const ALPHABET_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIEAAAAJAQMAAAAvjd2mAAAABlBMVEUAAACVjnilYY8fAAAAAXRSTlMAQObYZgAAAIpJREFUCNdjYGFQSHASZAACJhBhwwASaXCYCBdxYmB4LvHseZFwzWOJ09bLQr3idjIwiCzV7PSa7DVlqY6TWqiXUysDw5eF+p1ec4EiGkZqoUY+exkYgEyIGg0uoJqApQwM5RLP2oEiky1eFM7t8rw3nwEEGBkaGBgUFEBMBwewCBsjA1SEscGGAQDqvCg0BsK+agAAAABJRU5ErkJggg==';

const ALPHABET_MAP  = {
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

function alphabet_init() {
  let image = new Image();
  image.onload = function() {
    alphabetContext.drawImage(image, 0, 0);
  };

  image.src = ALPHABET_BASE64; 
}