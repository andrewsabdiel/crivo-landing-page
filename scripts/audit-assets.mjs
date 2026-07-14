import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const videoExtensions = new Set([".mp4", ".webm", ".mov"]);

function walk(directory) {
  if (!fs.existsSync(directory)) return [];

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return walk(fullPath);
    }

    return entry.isFile() ? [fullPath] : [];
  });
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let size = bytes / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 ? 1 : 2)} ${units[unitIndex]}`;
}

function readPngDimensions(buffer) {
  if (
    buffer.length < 24 ||
    buffer[0] !== 0x89 ||
    buffer.toString("ascii", 1, 4) !== "PNG"
  ) {
    return null;
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function readJpegDimensions(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }

  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) return null;

    const marker = buffer[offset + 1];
    const size = buffer.readUInt16BE(offset + 2);
    const isStartOfFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      ![0xc4, 0xc8, 0xcc].includes(marker);

    if (isStartOfFrame) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }

    offset += 2 + size;
  }

  return null;
}

function imageDimensions(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const buffer = fs.readFileSync(filePath);

  if (extension === ".png") return readPngDimensions(buffer);
  if (extension === ".jpg" || extension === ".jpeg") {
    return readJpegDimensions(buffer);
  }

  return null;
}

function relative(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}

const files = walk(publicDir).map((filePath) => {
  const stats = fs.statSync(filePath);
  const extension = path.extname(filePath).toLowerCase();

  return {
    filePath,
    extension,
    size: stats.size,
    type: imageExtensions.has(extension)
      ? "image"
      : videoExtensions.has(extension)
        ? "video"
        : "other",
  };
});

const images = files
  .filter((file) => file.type === "image")
  .map((file) => ({
    ...file,
    dimensions: imageDimensions(file.filePath),
  }))
  .sort((a, b) => b.size - a.size);

const videos = files
  .filter((file) => file.type === "video")
  .sort((a, b) => b.size - a.size);

const imageTotal = images.reduce((total, file) => total + file.size, 0);
const videoTotal = videos.reduce((total, file) => total + file.size, 0);

console.log("Asset audit");
console.log(`Images: ${images.length} files, ${formatBytes(imageTotal)}`);
console.log(`Videos: ${videos.length} files, ${formatBytes(videoTotal)}`);
console.log("");

console.log("Largest images");
for (const file of images.slice(0, 20)) {
  const dimensions = file.dimensions
    ? `${file.dimensions.width}x${file.dimensions.height}`
    : "unknown";

  console.log(
    `${formatBytes(file.size).padStart(9)}  ${dimensions.padStart(11)}  ${relative(
      file.filePath,
    )}`,
  );
}

console.log("");
console.log("Largest videos");
for (const file of videos.slice(0, 20)) {
  console.log(`${formatBytes(file.size).padStart(9)}  ${relative(file.filePath)}`);
}
