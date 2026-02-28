import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { text } = await req.json();

        // THE VOICE PROTOCOL
        const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
        const VOICE_ID = "YOUR_VOICE_ID_HERE"; // Swapped out placeholder

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
            method: 'POST',
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_monolingual_v1",
                voice_settings: { stability: 0.5, similarity_boost: 0.5 }
            })
        });

        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`ElevenLabs API failed: ${response.status} - ${errBody}`);
        }

        const audioBuffer = await response.arrayBuffer();

        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'inline; filename="whisper.mp3"'
            }
        });

    } catch (error) {
        console.error("Voice Protocol Error:", error);
        return NextResponse.json({ error: 'Failed to synthesize voice' }, { status: 500 });
    }
}
