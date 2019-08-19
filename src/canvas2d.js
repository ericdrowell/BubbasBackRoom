function canvas2d_init() {
  sceneCanvas = document.getElementById('sceneCanvas');
  sceneContext = canvas2d_initCanvas(sceneCanvas, PIXEL_RATIO);

  hudCanvas = document.createElement('canvas');
  hudContext = canvas2d_initCanvas(hudCanvas, PIXEL_RATIO);

  compositeCanvas = document.createElement('canvas');
  compositeContext = canvas2d_initCanvas(compositeCanvas, PIXEL_RATIO);

  pixelateCanvas = document.createElement('canvas');
  pixelateContext = canvas2d_initCanvas(pixelateCanvas, 1);
};

function canvas2d_initCanvas(canvas, pixelRatio) {
  let context = canvas.getContext('2d');
  canvas.width = viewportWidth * pixelRatio;
  canvas.height = viewportHeight * pixelRatio;
  canvas.style.width = viewportWidth + 'px';
  canvas.style.height = viewportHeight + 'px';
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

function canvas2d_clear(context) {
  context.clearRect(0 ,0, viewportWidth, viewportHeight);
}

function canvas2d_pixelate(canvas, context, pixelation) {
  canvas2d_clear(pixelateContext);
  pixelateContext.save();
  pixelateContext.scale(1/pixelation, 1/pixelation);
  pixelateContext.drawImage(canvas, 0, 0, viewportWidth, viewportHeight);
  pixelateContext.restore();

  canvas2d_clear(context);
  // the viewportWidth + 3 fills in gaps left by pixelation on the right side of canvas
  context.drawImage(pixelateCanvas, 0, 0, viewportWidth/pixelation, viewportHeight/pixelation, 0, 0, viewportWidth+3, viewportHeight);
}