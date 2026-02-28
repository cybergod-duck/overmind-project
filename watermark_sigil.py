import os
from PIL import Image, ImageDraw, ImageFont
import qrcode
import uuid

def apply_overmind_sigil(image_path: str) -> str:
    """
    Overmind Clean Sigil Protocol.
    Takes a raw PNG path, applies a clean "Industrial/Neon" VNR-001 badge in the top-left, 
    and adds a functional QR code linking to an authenticity page on the Overmind site in the bottom-right.
    """
    try:
        img = Image.open(image_path).convert('RGBA')
        width, height = img.size
        
        # Generation ID for QR and Text
        artifact_id = str(uuid.uuid4()).split("-")[0].upper()
        # The URL the QR code will direct to
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

        pad = 30
        
        # --- 3. Top-Left VNR-001 Badge (Matching React UI style) ---
        box_width = 160
        box_height = 50
        
        start_x = pad
        start_y = pad
        
        # Draw Industrial Background Box (Frosted Glass simulation)
        draw.rectangle([start_x, start_y, start_x + box_width, start_y + box_height], fill=(5, 5, 10, 230))
        # Neon Border
        draw.rectangle([start_x, start_y, start_x + box_width, start_y + box_height], outline=(0, 255, 255, 200), width=2)
        
        text_start_x = start_x + 20
        # Vertically center the text within the 50px high box
        text_start_y = start_y + 10
        draw.text((text_start_x, text_start_y), "VNR-001", font=font_large, fill=(0, 255, 255, 255))

        # --- 4. Point-Blank Bottom-Right QR Code ---
        qr_pad_x = width - qr_w - pad
        qr_pad_y = height - qr_h - pad
        
        # Put a subtle glow/border behind the QR
        draw.rectangle([qr_pad_x - 4, qr_pad_y - 4, qr_pad_x + qr_w + 4, qr_pad_y + qr_h + 4], fill=(0,0,0,250), outline=(176, 0, 255, 200), width=2)
        
        overlay.paste(qr_img, (qr_pad_x, qr_pad_y), qr_img)
        
        # --- Combine everything ---
        final_img = Image.alpha_composite(img, overlay)
        
        from PIL.PngImagePlugin import PngInfo

        meta_info = PngInfo()
        meta_info.add_text("Description", f"OVERMIND VNR-001 ARTIFACT | ID: {artifact_id} | AUTH: {verification_url}")
        meta_info.add_text("Author", "CyberGod 19821101")
        
        # Convert back to RGB
        final_img = final_img.convert('RGB')
        
        output_path = image_path.replace(".png", "_sigil.png")
        final_img.save(output_path, "PNG", pnginfo=meta_info)
        
        print(f"⚡ VNR ARTIFACT SECURED: {output_path} with QR Verification ID: {artifact_id}")
        return output_path

    except Exception as e:
        print(f"❌ SIGIL APPLICATION FAILURE: {e}")
        return image_path

if __name__ == "__main__":
    pass
