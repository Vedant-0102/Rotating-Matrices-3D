const width = 160;
const height = 44;
const buffer = new Array(width * height);
const zBuffer = new Array(width * height);
let A = 0, B = 0, C = 0;
const distanceFromCam = 100;
const K1 = 40;
let incrementSpeed = 0.6;
const asciiElement = document.getElementById('ascii');

function calculateX(i, j, k) {
  return j * Math.sin(A) * Math.sin(B) * Math.cos(C) -
         k * Math.cos(A) * Math.sin(B) * Math.cos(C) +
         j * Math.cos(A) * Math.sin(C) +
         k * Math.sin(A) * Math.sin(C) +
         i * Math.cos(B) * Math.cos(C);
}

function calculateY(i, j, k) {
  return j * Math.cos(A) * Math.cos(C) +
         k * Math.sin(A) * Math.cos(C) -
         j * Math.sin(A) * Math.sin(B) * Math.sin(C) +
         k * Math.cos(A) * Math.sin(B) * Math.sin(C) -
         i * Math.cos(B) * Math.sin(C);
}

function calculateZ(i, j, k) {
  return k * Math.cos(A) * Math.cos(B) -
         j * Math.sin(A) * Math.cos(B) +
         i * Math.sin(B);
}

function calculateForSurface(cubeX, cubeY, cubeZ, ch, horizontalOffset) {
  const x = calculateX(cubeX, cubeY, cubeZ);
  const y = calculateY(cubeX, cubeY, cubeZ);
  const z = calculateZ(cubeX, cubeY, cubeZ) + distanceFromCam;
  const ooz = 1 / z;

  const xp = Math.floor(width / 2 + horizontalOffset + K1 * ooz * x * 2);
  const yp = Math.floor(height / 2 + K1 * ooz * y);

  const idx = xp + yp * width;
  if (idx >= 0 && idx < width * height) {
    if (ooz > zBuffer[idx]) {
      zBuffer[idx] = ooz;
      buffer[idx] = ch;
    }
  }
}

function renderFrame() {
  buffer.fill(' ');
  zBuffer.fill(0);

  const size = 20;
  const offset = -2 * size;

  for (let cubeX = -size; cubeX < size; cubeX += incrementSpeed) {
    for (let cubeY = -size; cubeY < size; cubeY += incrementSpeed) {
      calculateForSurface(cubeX, cubeY, -size, '@', offset);
      calculateForSurface(size, cubeY, cubeX, '$', offset);
      calculateForSurface(-size, cubeY, -cubeX, '~', offset);
      calculateForSurface(-cubeX, cubeY, size, '#', offset);
      calculateForSurface(cubeX, -size, -cubeY, ';', offset);
      calculateForSurface(cubeX, size, cubeY, '+', offset);
    }
  }

  let output = '';
  for (let k = 0; k < buffer.length; k++) {
    output += k % width === width - 1 ? buffer[k] + '\n' : buffer[k];
  }

  asciiElement.textContent = output;

  A += 0.015;
  B += 0.015;
  C += 0.005;

  requestAnimationFrame(renderFrame);
}

renderFrame();
