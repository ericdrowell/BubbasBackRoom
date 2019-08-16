function u_convertNegZeroToPosZero(val) {
  if (1/val === -Infinity) {
    return val * -1;
  }
  return val;
}

function u_getRandomElement(arr) {
  var index = Math.floor(MATH_RANDOM() * arr.length);
  return arr[index];
}


// fast concat
function utils_concat(a, b) {
  a.push.apply(a, b);
}