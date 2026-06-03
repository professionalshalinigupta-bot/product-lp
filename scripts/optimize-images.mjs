import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceImages = [
  {
    source: "C:/Users/Dell/Pictures/strawv=berry shake.png",
    output: "shakeweight-strawberry.png"
  },
  {
    source: "C:/Users/Dell/Pictures/blueberry shake.webp",
    output: "shakeweight-blueberry.png"
  },
  {
    source: "C:/Users/Dell/Pictures/banana shake.png",
    output: "shakeweight-banana.png"
  },
  {
    source: "C:/Users/Dell/Pictures/chocolate milk shake 2.webp",
    output: "shakeweight-chocolate.png"
  }
];

const outputDir = path.resolve("public/images");
await fs.mkdir(outputDir, { recursive: true });

await Promise.all(
  sourceImages.map(async (image) => {
    const output = path.join(outputDir, image.output);
    await sharp(image.source)
      .rotate()
      .resize({ width: 1400, withoutEnlargement: true })
      .sharpen()
      .png({ quality: 95, compressionLevel: 8 })
      .toFile(output);
  })
);

console.log(`Optimized ${sourceImages.length} product images into ${outputDir}`);
