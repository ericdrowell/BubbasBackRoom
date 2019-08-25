function canvas2d_init() {
  hudCanvas = document.getElementById('hudCanvas');
  hudContext = canvas2d_initCanvas(hudCanvas, viewportWidth, viewportHeight, PIXEL_RATIO);

  alphabetCanvas = document.createElement('canvas');
  alphabetContext = canvas2d_initCanvas(alphabetCanvas, 129, 9, PIXEL_RATIO);
};

function canvas2d_initCanvas(canvas, width, height, pixelRatio) {
  let context = canvas.getContext('2d');
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;

  context.mozImageSmoothingEnabled = false;
  context.webkitImageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;

  if (pixelRatio !== 1) {
    context.scale(pixelRatio, pixelRatio);
  }

  return context;
}
