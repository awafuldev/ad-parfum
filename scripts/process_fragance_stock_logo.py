import os
from PIL import Image

src_path = r"C:/Users/user1/.gemini/antigravity/brain/71f2ae4a-9c98-4d29-a4e7-738c65bc032a/.user_uploaded/media_1792868837703.png"
out_dir = r"c:/Users/user1/Documents/antigravity/cool-bardeen/eidi-parfum/public/images"
os.makedirs(out_dir, exist_ok=True)

img = Image.open(src_path).convert("RGBA")
width, height = img.size
print(f"Loaded Fragance Stock logo: {width}x{height}")

pixels = img.load()

# Create transparent light logo (white bottle & text on transparent background)
logo_light = Image.new("RGBA", (width, height), (0, 0, 0, 0))
pixels_light = logo_light.load()

# Create transparent dark logo (black bottle & text on transparent background)
logo_dark = Image.new("RGBA", (width, height), (0, 0, 0, 0))
pixels_dark = logo_dark.load()

min_x, max_x = width, 0
min_y, max_y = height, 0

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        # Calculate brightness (black background has low brightness)
        brightness = (r + g + b) / 3.0
        
        # Smooth anti-aliased alpha threshold from black background
        if brightness < 20:
            alpha = 0
        elif brightness < 60:
            alpha = int(((brightness - 20) / 40.0) * 255)
        else:
            alpha = 255

        if alpha > 0:
            if x < min_x: min_x = x
            if x > max_x: max_x = x
            if y < min_y: min_y = y
            if y > max_y: max_y = y

            # Light version: pure crisp white (#FFFFFF) with smooth alpha
            pixels_light[x, y] = (255, 255, 255, alpha)

            # Dark version: deep obsidian noir (#111111) with smooth alpha
            pixels_dark[x, y] = (17, 17, 17, alpha)

padding = 30
crop_box = (
    max(0, min_x - padding),
    max(0, min_y - padding),
    min(width, max_x + padding),
    min(height, max_y + padding)
)

cropped_light = logo_light.crop(crop_box)
cropped_dark = logo_dark.crop(crop_box)

cropped_light.save(os.path.join(out_dir, "logo-light.png"), "PNG")
cropped_dark.save(os.path.join(out_dir, "logo-dark.png"), "PNG")

logo_light.save(os.path.join(out_dir, "logo-light-full.png"), "PNG")
logo_dark.save(os.path.join(out_dir, "logo-dark-full.png"), "PNG")

print(f"Cropped dimensions: {cropped_light.size}")
print(f"Borders: {crop_box}")
print("Saved transparent Fragance Stock RD logos successfully!")
