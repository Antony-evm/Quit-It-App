from __future__ import annotations

from pathlib import Path

from PIL import Image


REPO_ROOT = Path(__file__).resolve().parents[1]
SOURCE_ICON = REPO_ROOT / "src" / "assets" / "apple-touch-icon-180.png"

ANDROID_MIPMAP_SIZES = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

ADAPTIVE_FOREGROUND_SIZE = 432
# Slightly tighter ratio so circular masks don't crop the glyph
ADAPTIVE_SAFE_AREA_RATIO = 0.5

IOS_ICON_SPECS = [
    ("iphone", "20x20", "2x", "AppIcon-20x20@2x.png", 40),
    ("iphone", "20x20", "3x", "AppIcon-20x20@3x.png", 60),
    ("iphone", "29x29", "2x", "AppIcon-29x29@2x.png", 58),
    ("iphone", "29x29", "3x", "AppIcon-29x29@3x.png", 87),
    ("iphone", "40x40", "2x", "AppIcon-40x40@2x.png", 80),
    ("iphone", "40x40", "3x", "AppIcon-40x40@3x.png", 120),
    ("iphone", "60x60", "2x", "AppIcon-60x60@2x.png", 120),
    ("iphone", "60x60", "3x", "AppIcon-60x60@3x.png", 180),
    ("ios-marketing", "1024x1024", "1x", "AppIcon-1024x1024@1x.png", 1024),
]


def load_source_icon() -> Image.Image:
    if not SOURCE_ICON.exists():
        raise FileNotFoundError(f"Base icon not found: {SOURCE_ICON}")
    return Image.open(SOURCE_ICON).convert("RGBA")


def resize_icon(img: Image.Image, size: int) -> Image.Image:
    """Return a resized copy using a high-quality filter."""
    return img.resize((size, size), Image.LANCZOS)


def generate_android_icons(img: Image.Image) -> None:
    android_res = REPO_ROOT / "android" / "app" / "src" / "main" / "res"

    for folder, size in ANDROID_MIPMAP_SIZES.items():
        dest_dir = android_res / folder
        dest_dir.mkdir(parents=True, exist_ok=True)
        resized = resize_icon(img, size)

        for name in ("ic_launcher.png", "ic_launcher_round.png"):
            dest_file = dest_dir / name
            resized.save(dest_file, format="PNG")
            print(f"[android] wrote {dest_file.relative_to(REPO_ROOT)} ({size}px)")

    foreground_png = android_res / "drawable" / "ic_launcher_foreground.png"
    foreground_png.parent.mkdir(parents=True, exist_ok=True)
    foreground = create_adaptive_foreground(img)
    foreground.save(foreground_png, format="PNG")
    print(
        "[android] wrote"
        f" {foreground_png.relative_to(REPO_ROOT)} ({ADAPTIVE_FOREGROUND_SIZE}px)"
    )


def generate_ios_icons(img: Image.Image) -> None:
    appicon_dir = (
        REPO_ROOT
        / "ios"
        / "QuitItApp"
        / "Images.xcassets"
        / "AppIcon.appiconset"
    )
    appicon_dir.mkdir(parents=True, exist_ok=True)

    images_payload = []

    for idiom, size_label, scale, filename, pixels in IOS_ICON_SPECS:
        dest_file = appicon_dir / filename
        resize_icon(img, pixels).save(dest_file, format="PNG")
        images_payload.append(
            {
                "idiom": idiom,
                "size": size_label,
                "scale": scale,
                "filename": filename,
            }
        )
        print(f"[ios] wrote {dest_file.relative_to(REPO_ROOT)} ({pixels}px)")

    contents = {
        "images": images_payload,
        "info": {"author": "codex", "version": 1},
    }
    contents_file = appicon_dir / "Contents.json"
    contents_file.write_text(
        _json_dump(contents),
        encoding="utf-8",
    )
    print(f"[ios] updated {contents_file.relative_to(REPO_ROOT)}")


def _json_dump(obj: object) -> str:
    import json

    return json.dumps(obj, indent=2, sort_keys=False) + "\n"


def create_adaptive_foreground(img: Image.Image) -> Image.Image:
    canvas_size = ADAPTIVE_FOREGROUND_SIZE
    safe_size = int(canvas_size * ADAPTIVE_SAFE_AREA_RATIO)
    glyph = img.resize((safe_size, safe_size), Image.LANCZOS)

    canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    offset = ((canvas_size - safe_size) // 2, (canvas_size - safe_size) // 2)
    canvas.paste(glyph, offset, glyph)
    return canvas


def main() -> None:
    base_img = load_source_icon()
    generate_android_icons(base_img)
    generate_ios_icons(base_img)
    print("Branding assets refreshed.")


if __name__ == "__main__":
    main()
