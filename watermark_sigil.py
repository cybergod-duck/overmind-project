import os
from PIL import Image, ImageDraw, ImageFont
import random
import qrcode
import uuid

def apply_overmind_sigil(image_path: str) -> str:
    """
    Overmind Clean Sigil Protocol.
    Takes a raw PNG path, applies a clean "Industrial/Neon" VNR 001 badge in the corner, 
    and adds a functional QR code linking to an authenticity page on the Overmind site.
    """
    try:
        img = Image.open(image_path).convert('RGBA')
        width, height = img.size
        
        # Generation ID for QR and Text
        artifact_id = str(uuid.uuid4()).split("-")[0].upper()
        # The URL the QR code will direct to (a future verification page we can build)
        verification_url = f"https://www.overmind-project.com/verify?id={artifact_id}"
        
        # --- 1. Generate the Neon Cyan QR Code ---
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=4,
            border=2,
        )
        qr.add_data(verification_url)
        qr.make(fit=True)
        # Create QR image with Black background and Neon Cyan fill
        qr_img = qr.make_image(fill_color=(0, 255, 255), back_color=(0, 0, 0, 200)).convert('RGBA')
        qr_w, qr_h = qr_img.size

        # --- 2. Create the Layout Overlay ---
        overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        
        try:
            # Consola or generic monospace
            font_small = ImageFont.truetype("consola.ttf", 16)
            font_large = ImageFont.truetype("consola.ttf", 28)
        except IOError:
            font_small = ImageFont.load_default()
            font_large = font_small

        # Define Padding & Sigil Box Dimensions (Bottom Right Corner)
        pad_x = 30
        pad_y = 30
        
        # Calculate box to hold QR code and Text
        # Layout: [Text Data] [QR Code] horizontally aligned in bottom right
        box_width = 350
        box_height = qr_h + 20
        
        start_x = width - box_width - pad_x
        start_y = height - box_height - pad_y
        
        # Draw Industrial Background Box
        # Dark, semi-transparent background bordered by neon cyan
        draw.rectangle([start_x, start_y, start_x + box_width, start_y + box_height], fill=(5, 5, 10, 220))
        
        # Neon Border
        draw.rectangle([start_x, start_y, start_x + box_width, start_y + box_height], outline=(0, 255, 255, 200), width=2)
        
        # Corner accents (Industrial Tech UI style)
        accent_len = 15
        draw.line([start_x, start_y, start_x + accent_len, start_y], fill=(176, 0, 255, 255), width=3) # Purple top-left
        draw.line([start_x, start_y, start_x, start_y + accent_len], fill=(176, 0, 255, 255), width=3)
        draw.line([start_x + box_width, start_y + box_height, start_x + box_width - accent_len, start_y + box_height], fill=(176, 0, 255, 255), width=3) # Purple bottom-right
        draw.line([start_x + box_width, start_y + box_height, start_x + box_width, start_y + box_height - accent_len], fill=(176, 0, 255, 255), width=3)
        
        # --- 3. Paste the QR Code into the Box ---
        qr_pad_x = start_x + box_width - qr_w - 10
        qr_pad_y = start_y + 10
        overlay.paste(qr_img, (qr_pad_x, qr_pad_y), qr_img)
        
        # --- 4. Draw Typography / Data inside the Box ---
        text_start_x = start_x + 15
        
        draw.text((text_start_x, start_y + 15), "VNR-001 || ARTIFACT", font=font_large, fill=(0, 255, 255, 255))
        draw.text((text_start_x, start_y + 50), f"ID: {artifact_id}", font=font_small, fill=(255, 255, 255, 180))
        draw.text((text_start_x, start_y + 70), "STATUS: SECURE VERIFIED", font=font_small, fill=(176, 0, 255, 255))
        draw.text((text_start_x, start_y + 90), "VOSS NEURAL RESEARCH LLC", font=font_small, fill=(100, 100, 100, 255))

        # --- Combine everything ---
        final_img = Image.alpha_composite(img, overlay)
        
        # Convert back to RGB
        final_img = final_img.convert('RGB')
        
        output_path = image_path.replace(".png", "_sigil.png")
        final_img.save(output_path, "PNG")
        
        print(f"⚡ VNR ARTIFACT SECURED: {output_path} with QR Verification ID: {artifact_id}")
        return output_path

    except Exception as e:
        print(f"❌ SIGIL APPLICATION FAILURE: {e}")
        return image_path

if __name__ == "__main__":
    pass
