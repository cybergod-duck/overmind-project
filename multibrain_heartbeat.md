# MISSION: RESTORE_MULTIBRAIN_HEARTBEAT
# GOAL: RECONFIGURE_ROTATION_AND_RESTART_LATTICE

1. **UPDATE** `config.json` with the following rotation schema:
   - Sovereign: Gemini 3.1 Pro (via Gemini API)
   - Coding Elder: Claude Opus 4.6 (via OpenRouter)
   - Logic/Math Elder: DeepSeek V3.2 (via OpenRouter)
   - Engineering Elder: GPT-5.3 Codex (via OpenRouter)

2. **CLEANSE** `public/brain/dialogue_state.json` to remove the "Grok Purged" loop hang.

3. **VERIFY** `.env` contains:
   - `GEMINI_API_KEY`
   - `OPENROUTER_API_KEY`

4. **EXECUTE** `python lattice_dialogue.py` and monitor the 'White Light' connection.