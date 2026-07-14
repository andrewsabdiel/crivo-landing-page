from __future__ import annotations

import shutil
import sys
from datetime import datetime
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError as exc:
    print("Pillow is required to optimize images. Install it with: python -m pip install pillow")
    raise SystemExit(1) from exc


ROOT = Path.cwd()
PUBLIC_DIR = ROOT / "public"
BACKUP_ROOT = ROOT / ".asset-backups" / f"images-{datetime.now():%Y%m%d-%H%M%S}"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}
JPEG_MAX_DIMENSION = 2560
PNG_MAX_DIMENSION = 1200
JPEG_QUALITY = 84


def format_bytes(value: int) -> str:
    if value < 1024:
        return f"{value} B"

    size = value / 1024
    units = ["KB", "MB", "GB"]
    unit_index = 0

    while size >= 1024 and unit_index < len(units) - 1:
        size /= 1024
        unit_index += 1

    return f"{size:.1f} {units[unit_index]}" if size >= 10 else f"{size:.2f} {units[unit_index]}"


def iter_images() -> list[Path]:
    if not PUBLIC_DIR.exists():
        return []

    return sorted(
        path
        for path in PUBLIC_DIR.rglob("*")
        if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS
    )


def resized_size(width: int, height: int, max_dimension: int) -> tuple[int, int]:
    current_max = max(width, height)

    if current_max <= max_dimension:
        return width, height

    scale = max_dimension / current_max
    return max(1, round(width * scale)), max(1, round(height * scale))


def save_candidate(source: Path, candidate: Path) -> None:
    extension = source.suffix.lower()

    with Image.open(source) as original:
      image = ImageOps.exif_transpose(original)

      if extension in {".jpg", ".jpeg"}:
          image = image.convert("RGB")
          next_size = resized_size(image.width, image.height, JPEG_MAX_DIMENSION)

          if next_size != image.size:
              image = image.resize(next_size, Image.Resampling.LANCZOS)

          image.save(
              candidate,
              "JPEG",
              quality=JPEG_QUALITY,
              optimize=True,
              progressive=True,
          )
          return

      if extension == ".png":
          next_size = resized_size(image.width, image.height, PNG_MAX_DIMENSION)

          if next_size != image.size:
              image = image.resize(next_size, Image.Resampling.LANCZOS)

          image.save(candidate, "PNG", optimize=True)
          return

      raise ValueError(f"Unsupported extension: {source.suffix}")


def backup_original(source: Path) -> Path:
    relative_path = source.relative_to(ROOT)
    backup_path = BACKUP_ROOT / relative_path
    backup_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, backup_path)
    return backup_path


def optimize_image(source: Path) -> tuple[bool, int, int, str | None]:
    original_size = source.stat().st_size
    candidate = source.with_name(f"{source.name}.tmp")

    try:
        save_candidate(source, candidate)
        candidate_size = candidate.stat().st_size

        if candidate_size >= original_size:
            candidate.unlink(missing_ok=True)
            return False, original_size, original_size, None

        backup_original(source)
        candidate.replace(source)
        return True, original_size, candidate_size, None
    except Exception as exc:
        candidate.unlink(missing_ok=True)
        return False, original_size, original_size, str(exc)


def main() -> int:
    images = iter_images()

    if not images:
        print("No images found under public/.")
        return 0

    optimized = []
    skipped = 0
    errors = []

    for image_path in images:
        changed, before, after, error = optimize_image(image_path)

        if error:
            errors.append((image_path, error))
            continue

        if not changed:
            skipped += 1
            continue

        optimized.append((image_path, before, after))

    before_total = sum(before for _, before, _ in optimized)
    after_total = sum(after for _, _, after in optimized)
    saved_total = before_total - after_total

    print("Image optimization complete")
    print(f"Optimized: {len(optimized)}")
    print(f"Skipped: {skipped}")
    print(f"Saved: {format_bytes(saved_total)}")

    if optimized:
        print(f"Backups: {BACKUP_ROOT}")
        print("")
        for image_path, before, after in optimized:
            relative = image_path.relative_to(ROOT).as_posix()
            print(f"{format_bytes(before):>9} -> {format_bytes(after):>9}  {relative}")

    if errors:
        print("")
        print("Errors:")
        for image_path, error in errors:
            print(f"- {image_path.relative_to(ROOT).as_posix()}: {error}")
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
