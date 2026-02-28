export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Target local Sovereign Gateway (LiteLLM) running on port 4000 in dev
    // Fallback to prod URL if needed
    const litellmUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:4000/v1/chat/completions'
        : (process.env.PROD_API_URL || 'http://localhost:4000/v1/chat/completions');

    try {
        console.log(`[VNR-Gateway] Routing request to Sovereign Gateway: ${litellmUrl}`);
        const response = await fetch(litellmUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Transparently pass authorization header if needed
                ...(req.headers.authorization && { 'Authorization': req.headers.authorization })
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('[VNR-Gateway] Gateway response error:', response.status, errText);
            return res.status(response.status).json({ error: errText });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error('[VNR-Gateway] Fetch error:', error);
        return res.status(500).json({ error: 'Failed to contact the Sovereign Gateway' });
    }
}
