import os
from PIL import Image

src_path = r"C:/Users/user1/.gemini/antigravity/brain/71f2ae4a-9c98-4d29-a4e7-738c65bc032a/.user_uploaded/media_1792436261043.png"
out_dir = r"c:/Users/user1/Documents/antigravity/cool-bardeen/eidi-parfum/public/images"
os.makedirs(out_dir, exist_ok=True)

img = Image.open(src_path).convert("RGBA")
width, height = img.size
print(f"Loaded logo: {width}x{height}")

# Analyze colors and create clean transparent version
# Background is white (RGB close to 255, 255, 255)
# We want clean alpha transition so there is no white halo around the letters.

pixels = img.load()

# Create transparent dark logo (original colors: black A, gold D, black PARFUM, transparent background)
logo_dark = Image.new("RGBA", (width, height), (0, 0, 0, 0))
pixels_dark = logo_dark.load()

# Create transparent light logo (for dark backgrounds: white A, gold D, white PARFUM, transparent background)
logo_light = Image.new("RGBA", (width, height), (0, 0, 0, 0))
pixels_light = logo_light.load()

# Let's find bounding box of content while processing
min_x, max_x = width, 0
min_y, max_y = height, 0

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        # Calculate brightness / distance from pure white (255, 255, 255)
        # Background is white/cream > 240
        # If it's pure white, alpha = 0
        whiteness = (r + g + b) / 3.0
        
        if whiteness > 248:
            # Completely transparent background
            alpha = 0
        elif whiteness > 210:
            # Smooth anti-aliased edge
            alpha = int((248 - whiteness) / (248 - 210) * 255)
        else:
            alpha = 255

        if alpha > 0:
            if x < min_x: min_x = x
            if x > max_x: max_x = x
            if y < min_y: min_y = y
            if y > max_y: max_y = y

            # Keep original colors for dark logo
            pixels_dark[x, y] = (r, g, b, alpha)

            # Check if this pixel is part of the gold letter 'D' or part of the black text ('A' & 'PARFUM')
            # Gold in the logo has high red, moderate green, lower blue (e.g., r > 150, g > 110, b < 90)
            is_gold = (r > 120 and g > 90 and (r - b) > 50 and (g - b) > 25)

            if is_gold:
                # Keep the exact authentic gold color
                pixels_light[x, y] = (r, g, b, alpha)
            else:
                # Invert dark tones to warm white/porcelain (#FAF9F6) for dark backgrounds
                # Preserve smooth anti-aliased alpha
                pixels_light[x, y] = (250, 249, 246, alpha)

# Crop with comfortable margin
padding = 40
crop_box = (
    max(0, min_x - padding),
    max(0, min_y - padding),
    min(width, max_x + padding),
    min(height, max_y + padding)
)

cropped_dark = logo_dark.crop(crop_box)
cropped_light = logo_light.crop(crop_box)

cropped_dark.save(os.path.join(out_dir, "logo-dark.png"), "PNG")
cropped_light.save(os.path.join(out_dir, "logo-light.png"), "PNG")

# Also save high-res full logo
logo_dark.save(os.path.join(out_dir, "logo-dark-full.png"), "PNG")
logo_light.save(os.path.join(out_dir, "logo-light-full.png"), "PNG")

print("Cropped bounds:", crop_box)
print("Saved transparent logos to public/images/logo-dark.png and public/images/logo-light.png successfully!")
