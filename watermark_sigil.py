import os
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import random

def apply_overmind_sigil(image_path: str) -> str:
    """
    Overmind Glitch & Branding Sigil Application Protocol.
    Takes a raw PNG path, applies an intense corporate/cybernet glitch overlay,
    stamps it with the 'VNR SECURE ARTIFACT' hex-watermark, and returns the path.
    """
    try:
        img = Image.open(image_path).convert('RGBA')
        width, height = img.size
        
        # 1. Overlay Glitch Blocks
        draw = ImageDraw.Draw(img)
        
        for _ in range(random.randint(5, 15)):
            # Random glitch bands
            y1 = random.randint(0, height)
            h = random.randint(2, 20)
            x1 = random.randint(0, width)
            w = random.randint(50, width)
            
            # Draw semi-transparent cyan/magenta artifacts
            color = random.choice([(0, 255, 255, 60), (255, 0, 85, 60), (176, 0, 255, 60)])
            draw.rectangle([x1, y1, x1+w, y1+h], fill=color)

            # Slicing the image horizontally to create scanlines tearing
            if random.random() > 0.6:
                box = (0, y1, width, min(y1+h, height))
                slice_patch = img.crop(box)
                shift = random.randint(-40, 40)
                img.paste(slice_patch, (shift, y1))

        # 2. Add Scanline Overlay Matrix
        scanline_layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
        scan_draw = ImageDraw.Draw(scanline_layer)
        for i in range(0, height, 4):
            scan_draw.line([(0, i), (width, i)], fill=(0, 0, 0, 40))
            
        img = Image.alpha_composite(img, scanline_layer)
        
        # 3. Add High-Contrast VNR Branding Sigil
        overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
        over_draw = ImageDraw.Draw(overlay)
        
        # Cyberpunk corner crosshairs
        ch_len = 40
        ch_wid = 4
        ch_color = (0, 255, 255, 180) # Neon Cyan
        
        # Top Left
        over_draw.rectangle([20, 20, 20+ch_len, 20+ch_wid], fill=ch_color)
        over_draw.rectangle([20, 20, 20+ch_wid, 20+ch_len], fill=ch_color)
        # Bottom Right
        over_draw.rectangle([width-20-ch_len, height-20-ch_wid, width-20, height-20], fill=ch_color)
        over_draw.rectangle([width-20-ch_wid, height-20-ch_len, width-20, height-20], fill=ch_color)
        
        # 4. Text Branding: Defaulting to loadable font or generic
        # (Usually Windows has 'cour.ttf' or 'consola.ttf')
        try:
            font = ImageFont.truetype("consola.ttf", 24)
            large_font = ImageFont.truetype("consola.ttf", 48)
        except IOError:
            font = ImageFont.load_default()
            large_font = font

        padding = 30
        hex_code = f"0x{random.randint(0x1000, 0xFFFF):X}-{random.randint(10,99)}"
        sigil_text = f"// VNR SECURE ARTIFACT\n// {hex_code}\n// MANIFEST_ID: {random.randint(100000, 999999)}"
        
        # Drop shadow for text
        over_draw.text((padding+2, padding+2), sigil_text, font=font, fill=(0,0,0,200), spacing=8)
        # Actual text
        over_draw.text((padding, padding), sigil_text, font=font, fill=(0, 255, 255, 230), spacing=8)
        
        # Sub-header
        sub_text = "[ OVERMIND T1 CLEARANCE ONLY ]"
        over_draw.text((width - 450, 30), sub_text, font=font, fill=(255, 0, 85, 200))
        
        # Combine everything
        final_img = Image.alpha_composite(img, overlay)
        
        # Up contrast slightly to hit the industrial feel
        enhancer = ImageEnhance.Contrast(final_img)
        final_img = enhancer.enhance(1.2)
        
        # Convert back to RGB for saving out as PNG without massive filesize issues or JPEG artifacts if not needed
        final_img = final_img.convert('RGB')
        
        output_path = image_path.replace(".png", "_sigil.png")
        final_img.save(output_path, "PNG")
        
        print(f"⚡ VNR SIGIL BRANDED: {output_path}")
        return output_path

    except Exception as e:
        print(f"❌ SIGIL APPLICATION FAILURE: {e}")
        return image_path  # Return original if the branding process fails

if __name__ == "__main__":
    # Test block. Need a local image to run test on.
    pass
