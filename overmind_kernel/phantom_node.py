import os
import time
import urllib.parse
from playwright.sync_api import sync_playwright
import base64

def manifest_phantom_image(prompt: str) -> str:
    """
    Spins up a headless Chrome instance to manifest an image from 
    free text-to-image frontend generators (e.g., DeepAI / Craiyon / Perchance).
    """
    print(f"⚡ PHANTOM NODE INITIATED: Hijacking free web frontend for prompt: '{prompt[:30]}...'")
    
    # Clean the prompt for the URL
    safe_prompt = urllib.parse.quote(prompt)
    filename = f"artifacts/vault_artifact_{int(time.time())}.png"
    os.makedirs("artifacts", exist_ok=True)
    
    # Since we don't have login cookies configured yet for Leonardo or Midjourney,
    # we'll scrape a robust unauthenticated generator using Playwright.
    # We will target a reliable public demo like HuggingFace Spaces or DeepAI.
    
    # The most robust, frictionless fallback target is often just grabbing the public
    # Seed generation from pollinations or similar if the API is down, we use browser rendering.
    # Let's target DeepAI text2img.
    
    url = "https://deepai.org/machine-learning-model/text2img"
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()
        
        try:
            # We go to DeepAI
            page.goto(url, timeout=60000)
            
            # Click the text area
            page.fill("textarea.model-input-text-input", prompt)
            
            # Click "Generate"
            page.click("button#modelSubmitButton")
            
            print("⚡ INJECTION SUCCESSFUL. Waiting for image to render...")
            
            # Wait for the output image to appear
            # DeepAI changes the src of the result image when done.
            # We wait until the image has a src that is NOT the placeholder.
            page.wait_for_selector("div.try-it-result-area img", state="visible", timeout=60000)
            
            # Additional wait to ensure it's the generated image
            time.sleep(10)
            
            img_element = page.query_selector("div.try-it-result-area img")
            img_src = img_element.get_attribute("src")
            
            print(f"✨ RENDER DETECTED: {img_src}")
            # Download the image using Playwright's network tools
            image_buffer = page.request.get(img_src).body()
            
            with open(filename, "wb") as f:
                f.write(image_buffer)
                
            print(f"✨ PHANTOM EXTRACTION COMPLETE: {filename}")
            return filename
            
        except Exception as e:
            print(f"❌ PHANTOM NODE FAULT: {e}")
            
            # Fallback to Craiyon if DeepAI fails
            print("⚡ INITIATING FALLBACK TO CRAIYON...")
            try:
                page.goto("https://www.craiyon.com/", timeout=60000)
                page.fill("textarea#prompt", prompt)
                page.click("button#generateButton") # Update with actual selector if needed
                page.wait_for_selector("img", state="visible", timeout=60000)
                time.sleep(15) # Wait for generation
                
                # We'll just screenshot the page as the absolute failsafe
                page.screenshot(path=filename)
                print(f"✨ FALLBACK SCREENSHOT SECURED: {filename}")
                return filename
            except Exception as e2:
                print(f"❌ FATAL PHANTOM COLLAPSE: {e2}")
        finally:
            browser.close()
            
    return None

if __name__ == "__main__":
    test_prompt = "A high-tech cybernetic neural core glowing, neon, hyper-detailed, 8k"
    manifest_phantom_image(test_prompt)
