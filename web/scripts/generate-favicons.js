const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico');

const svgPath = path.join(__dirname, '..', 'public', 'favicon.svg');
const outPng = path.join(__dirname, '..', 'public', 'favicon.png');
const outIco = path.join(__dirname, '..', 'public', 'favicon.ico');

const sizes = [16, 32, 48, 64, 128];

(async () => {
  try {
    // create temporary PNG files for each size because png-to-ico sometimes
    // expects file paths rather than raw buffers in some environments
    const tmpDir = path.join(__dirname, 'tmp-icons');
    await fs.promises.mkdir(tmpDir, { recursive: true });
    const pngPaths = [];
    for (const s of sizes) {
      const p = path.join(tmpDir, `icon-${s}.png`);
      await sharp(svgPath).resize(s, s).png().toFile(p);
      pngPaths.push(p);
    }

    // write the largest png as favicon.png
    await fs.promises.copyFile(pngPaths[pngPaths.length - 1], outPng);

    // create ico from the png buffers using 'to-ico' (more robust)
    const toIco = require('to-ico');
    const pngBufs = await Promise.all(pngPaths.map((p) => fs.promises.readFile(p)));
    const icoBuf = await toIco(pngBufs);
    await fs.promises.writeFile(outIco, icoBuf);

    // cleanup tmp files
    for (const p of pngPaths) {
      await fs.promises.unlink(p).catch(() => {});
    }
    await fs.promises.rmdir(tmpDir).catch(() => {});

    console.log('Generated', outPng, outIco);
  } catch (err) {
    console.error('Failed to generate favicons:', err);
    process.exitCode = 1;
  }
})();
