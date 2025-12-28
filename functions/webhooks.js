// functions/webhooks.js - SIMPLE CLOUDFLARE WORKER
export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    
    // 1. Get HMAC header
    const hmacHeader = request.headers.get('X-Shopify-Hmac-Sha256');
    if (!hmacHeader) {
      return new Response('No HMAC header', { status: 401 });
    }
    
    // 2. Get Shopify secret
    const SHOPIFY_SECRET = env.SHOPIFY_API_SECRET;
    if (!SHOPIFY_SECRET) {
      return new Response('Server misconfigured', { status: 500 });
    }
    
    // 3. Get raw body
    const rawBody = await request.text();
    
    // 4. Verify HMAC
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(SHOPIFY_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const signature = Uint8Array.from(atob(hmacHeader), c => c.charCodeAt(0));
    const data = encoder.encode(rawBody);
    const isValid = await crypto.subtle.verify('HMAC', key, signature.buffer, data);
    
    if (!isValid) {
      return new Response('Invalid HMAC signature', { status: 401 });
    }
    
    // 5. Get topic and respond
    const topic = request.headers.get('X-Shopify-Topic');
    
    // Log for debugging
    console.log(`✅ ${topic} webhook received`);
    
    // 6. ALWAYS return 200 OK for Shopify
    return new Response(JSON.stringify({
      success: true,
      message: `Xroga AI Tracking processed ${topic}`,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Server error', { status: 500 });
  }
}
