# overmind_kernel/glaze_generator.py
import os
import requests
import base64
import time
from dotenv import load_dotenv

load_dotenv()

def manifest_artifact():
    """
    Sovereign Manifestation: Using the dedicated Imagen 3 Task API.
    This resolves the 400 MIME type error by using the correct 
    generation task flow.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    # Correct 2026 Task Endpoint
    url = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImages?key={api_key}"
    
    prompt = "Industrial high-frequency artifact, VNR Sovereign Controller aesthetic, white light reservoir energy, hyper-detailed mechanical lattice."
    
    payload = {
        "prompt": prompt,
        "number_of_images": 1,
        "aspect_ratio": "1:1",
        "safety_filter_level": "BLOCK_ONLY_HIGH"
    }

    print(f"⚡ INITIATING TASK: IMAGEN-3 GENERATION...")
    try:
        response = requests.post(url, json=payload, timeout=60)
        
        if response.status_code == 200:
            # Imagen API returns a list of image objects
            data = response.json()
            img_b64 = data['images'][0]['imageBinary']
            
            filename = f"vault_artifact_{int(time.time())}.png"
            with open(filename, "wb") as f:
                f.write(base64.b64decode(img_b64))
            
            print(f"✨ ARTIFACT SECURED: {filename}")
            return filename
        else:
            print(f"❌ TASK REJECTED {response.status_code}: {response.text}")
    except Exception as e:
        print(f"⚠️ TRANSMISSION ERROR: {e}")
    return None

if __name__ == "__main__":
    manifest_artifact()
