"""
Remove background from existing logo PNG
"""
from pathlib import Path
from PIL import Image

REPO_ROOT = Path(__file__).resolve().parents[1]
SOURCE_PNG = REPO_ROOT / "assets" / "bootsplash" / "logo@4x.png"
OUTPUT_PNG = REPO_ROOT / "src" / "assets" / "logo2.png"

if not SOURCE_PNG.exists():
    print(f"Error: Source file not found: {SOURCE_PNG}")
    exit(1)

# Load the existing logo
img = Image.open(SOURCE_PNG).convert("RGBA")
width, height = img.size
pixels = img.load()

# Define the dark green background color to remove
background_color = (2, 44, 34)  # #022C22
tolerance = 10  # Color tolerance for matching

# Create a new image with transparent background
new_img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
new_pixels = new_img.load()

# Copy non-background pixels
for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        
        # Check if pixel is close to background color
        if (abs(r - background_color[0]) <= tolerance and
            abs(g - background_color[1]) <= tolerance and
            abs(b - background_color[2]) <= tolerance):
            # Make it transparent
            new_pixels[x, y] = (r, g, b, 0)
        else:
            # Keep the pixel
            new_pixels[x, y] = (r, g, b, a)

# Save the result
OUTPUT_PNG.parent.mkdir(parents=True, exist_ok=True)
new_img.save(OUTPUT_PNG, "PNG")
print(f"Created {OUTPUT_PNG.relative_to(REPO_ROOT)}")
print(f"Background color {background_color} removed (±{tolerance})")
