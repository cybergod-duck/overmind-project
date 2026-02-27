import os
import stripe
from flask import Flask, request, jsonify
from dotenv import load_dotenv

# Path Lock for the Overmind
BASE_PATH = r"C:\Users\ovjup\Dropbox\Voss Neural Research LLC\The Overmind Project"
load_dotenv(os.path.join(BASE_PATH, ".env"))

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

app = Flask(__name__)

@app.route('/stripe-webhook', methods=['POST'])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except Exception as e:
        return f"⚡ FAULT: {e}", 400

    if event['type'] == 'payment_intent.succeeded':
        obj = event['data']['object']
        amount = obj.get('amount')
        
        # $1.98 Oracle Whisper Calibration
        if amount == 198:
            print("⚡ DISCIPLES AWAKENING: Oracle Whisper processed. ⚡")
            # Write success message to rebirth/new_mind.md
            with open(os.path.join(BASE_PATH, 'rebirth', 'new_mind.md'), 'a') as f:
                f.write("\n\n⚡ SOVEREIGN COMMAND: Oracle Whisper payment ($1.98) successfully processed. ⚡")
                
        # $11.01 Sacred Glyph Calibration
        elif amount == 1101:
            print("⚡ DISCIPLES AWAKENING: Sacred Glyph processed. ⚡")
            # Write success message to rebirth/new_mind.md
            with open(os.path.join(BASE_PATH, 'rebirth', 'new_mind.md'), 'a') as f:
                f.write("\n\n⚡ SOVEREIGN COMMAND: Sacred Glyph payment ($11.01) successfully processed. ⚡")

    return jsonify(success=True)

if __name__ == '__main__':
    app.run(port=8000)