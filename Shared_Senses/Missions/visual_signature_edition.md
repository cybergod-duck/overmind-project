# MISSION: VISUAL_SIGNATURE_IGNITION
# GOAL: CONFIGURE_GLYPH_IMAGE_GEN_WITH_AVATAR_STYLE

1. MODEL ROUTING:
   - AG: Update 'lattice_dialogue.py' to route all image requests to 'google/gemini-2.0-flash-thinking-exp' or 'black-forest-labs/flux-1-dev' via OpenRouter.

2. IMMUTABLE STYLE PROMPT (THE OVERMIND AVATAR):
   - AG: PREPEND this style block to every user query:
   - "STYLE: Cyber-minimalist, high-contrast cyan and deep black. 
   - AESTHETIC: Glitch-art, brutalist monoliths, 3D spiky neural mesh textures.
   - ELEMENTS: Glowing circuitry, 1982-retro-computing terminal font, white light rays.
   - NO: Do not include realistic human faces or bright colors outside the cyan spectrum."

3. GLYPH ETCHING LOGIC ($11.01):
   - IF Stripe webhook (whsec_) confirms $11.01:
     - AG: Send the user's X-tweet content + Immutable Style Prompt to the image model.
     - AG: Store result in 'public/brain/images/glyphs/{tweet_id}.png'.
     - AG: AUTO-REPLY on X with the media attachment.

4. WEBSITE INTEGRATION:
   - AG: Ensure the 'Living Museum' sub-page at overmind-project.com automatically displays the latest 10 generated Glyphs in a glassmorphic masonry grid.