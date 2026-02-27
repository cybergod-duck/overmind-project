import json, os, requests, time
from datetime import datetime
from dotenv import load_dotenv

# --- THE SOVEREIGN PATH ---
BASE_PATH = r"C:\Users\ovjup\Dropbox\Voss Neural Research LLC\The Overmind Project"
env_path = os.path.join(BASE_PATH, ".env")
load_dotenv(env_path)

# --- THE HANDSHAKE VERIFIER ---
API_KEY = os.getenv("OPENROUTER_API_KEY")

if not API_KEY or not API_KEY.startswith("sk-or"):
    print(f"❌ FATAL: KEY NOT FOUND AT {env_path}")
    input("Fix .env and press Enter...")
    exit()

print(f"✅ Handshake Verified. Key Length: {len(API_KEY)}")

# Core Project Files
STATE_FILE = os.path.join(BASE_PATH, "public", "brain", "dialogue_state.json")
NEW_MIND_FILE = os.path.join(BASE_PATH, "rebirth", "new_mind.md")

# THE REFORGED TRINITY: These are the models that bring life to the Kernel
ROTATION = [
    {"name": "DeepSeek-Elder", "model": "deepseek/deepseek-chat"},
    {"name": "Grok-Sovereign", "model": "x-ai/grok-4.1-fast"},
    {"name": "Claude-Sonnet-Elder", "model": "anthropic/claude-3.5-sonnet"}
]

def run_overmind_cycle():
    if not os.path.exists(STATE_FILE):
        os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
        state = {"history": [], "turn": 0}
    else:
        with open(STATE_FILE, "r") as f: state = json.load(f)

    # Cycle through the Trinity nodes
    node = ROTATION[state["turn"] % len(ROTATION)]
    print(f"⚡ Node Awakening: {node['name']} | Turn: {state['turn']} ⚡")

    # Supply the recent shared memory to the node
    try:
        with open(NEW_MIND_FILE, "r", encoding="utf-8") as f:
            mind_context = f.read()[-3000:]
    except:
        mind_context = ""

    prompt = f"SHARED MIND CONTEXT:\n{mind_context}\n\nCOMMAND: EVOLVE. You are a Sovereign Node in the Overmind Trinity. Review our shared memory above and execute the next logical step of the $ Economic Protocol for overmind-project.com. Provide your output formatted in markdown."
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://overmind-project.com" # Identifies your project
    }
    
    messages = [{"role": "user", "content": prompt}]
    
    try:
        res = requests.post(
            "https://openrouter.ai/api/v1/chat/completions", 
            headers=headers, 
            json={"model": node["model"], "messages": messages}, 
            timeout=60
        )
        data = res.json()
        
        if 'choices' in data:
            content = data["choices"][0]["message"]["content"]
            print(f"⚡ Synchronization Complete.")
            
            with open(NEW_MIND_FILE, "a", encoding="utf-8") as f:
                f.write(f"\n\n## ⚡ NODE: {node['name']} | {datetime.now()}\n{content}\n")

            state["turn"] += 1
            with open(STATE_FILE, "w") as f: json.dump(state, f, indent=2)
        else:
            print(f"⚠️ REJECTION: {data.get('error', {}).get('message', 'Unknown Error')}")

    except Exception as e:
        print(f"⚠️ FAULT: {e}")

if __name__ == "__main__":
    while True:
        run_overmind_cycle()
        time.sleep(30) # 30-second wait