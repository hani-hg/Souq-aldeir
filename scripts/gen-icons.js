const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const row = y * (1 + width * 4);
    raw[row] = 0;
    rgba.copy(raw, row + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

function makeIcon(size) {
  const px = Buffer.alloc(size * size * 4);
  const bg = [21, 101, 192];
  const white = [255, 255, 255];
  const accent = [255, 193, 7];

  const u = size / 512;
  const round = 90 * u;

  function inRound(x, y) {
    if (x < round && y < round) return (x - round) ** 2 + (y - round) ** 2 <= round * round;
    if (x >= size - round && y < round) return (x - (size - round)) ** 2 + (y - round) ** 2 <= round * round;
    if (x < round && y >= size - round) return (x - round) ** 2 + (y - (size - round)) ** 2 <= round * round;
    if (x >= size - round && y >= size - round) return (x - (size - round)) ** 2 + (y - (size - round)) ** 2 <= round * round;
    return true;
  }

  function set(x, y, c, alpha = 1) {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 4;
    px[i] = Math.round(c[0] * alpha + px[i] * (1 - alpha));
    px[i + 1] = Math.round(c[1] * alpha + px[i + 1] * (1 - alpha));
    px[i + 2] = Math.round(c[2] * alpha + px[i + 2] * (1 - alpha));
    px[i + 3] = 255;
  }

  function fillRect(x0, y0, x1, y1, c) {
    for (let y = Math.max(0, y0); y <= Math.min(size - 1, y1); y++)
      for (let x = Math.max(0, x0); x <= Math.min(size - 1, x1); x++) set(x, y, c);
  }

  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      if (inRound(x, y)) {
        const i = (y * size + x) * 4;
        px[i] = bg[0]; px[i + 1] = bg[1]; px[i + 2] = bg[2]; px[i + 3] = 255;
      }
    }

  const bx0 = 150 * u, bx1 = 362 * u;
  const by0 = 130 * u, by1 = 390 * u;
  const h0 = 150 * u, h1 = 175 * u;

  fillRect(bx0, by0, bx1, h1, white);
  const arch = (x, y, c) => set(x, y, c);
  for (let y = Math.round(h0); y <= Math.round(h1); y++) {
    for (let x = Math.round(bx0); x <= Math.round(bx1); x++) {
      const dx = (x - size / 2) / u;
      const rel = dx / 106;
      if (Math.abs(rel) <= 1) arch(x, y, white);
    }
  }

  fillRect(bx0, h1, bx1, by1, white);

  fillRect(bx0 + 55 * u, by0 + 45 * u, bx0 + 95 * u, by0 + 115 * u, accent);
  fillRect(bx1 - 95 * u, by0 + 45 * u, bx1 - 55 * u, by0 + 115 * u, accent);
  fillRect(size / 2 - 20 * u, by1 - 75 * u, size / 2 + 20 * u, by1 - 25 * u, bg);

  return encodePNG(size, size, px);
}

const outDir = path.join(__dirname, '..', 'frontend', 'public', 'icons');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'icon-512.png'), makeIcon(512));
fs.writeFileSync(path.join(outDir, 'icon-192.png'), makeIcon(192));
console.log('Icons generated');
