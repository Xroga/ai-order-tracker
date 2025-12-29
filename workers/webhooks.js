// workers/webhooks.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle Shopify webhooks
    if (url.pathname === '/api/shopify/webhooks' && request.method === 'POST') {
      return handleShopifyWebhook(request, env);
    }
    
    return new Response('Not Found', { status: 404 });
  }
};

async function handleShopifyWebhook(request, env) {
  try {
    // 1. Get request data
    const body = await request.clone().text();
    const hmac = request.headers.get('X-Shopify-Hmac-Sha256');
    const topic = request.headers.get('X-Shopify-Topic');
    const shopDomain = request.headers.get('X-Shopify-Shop-Domain');
    
    console.log(`📦 Webhook received: ${topic} from ${shopDomain}`);
    
    // 2. Verify HMAC (CRITICAL for security)
    const isValid = await verifyHmac(body, hmac, env.SHOPIFY_WEBHOOK_SECRET);
    if (!isValid) {
      console.error('❌ Invalid HMAC signature');
      return new Response('Unauthorized', { status: 401 });
    }
    
    // 3. Parse JSON
    const data = JSON.parse(body);
    
    // 4. Handle different webhook types
    switch (topic) {
      case 'app/uninstalled':
        await handleAppUninstalled(data, env);
        break;
        
      case 'orders/fulfilled':
        await handleOrderFulfilled(data, env);
        break;
        
      case 'orders/paid':
        await handleOrderPaid(data, env);
        break;
        
      default:
        console.log(`ℹ️ Unhandled webhook topic: ${topic}`);
    }
    
    // 5. Always return 200 OK immediately
    return new Response('OK', { 
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Error', { status: 500 });
  }
}

// HMAC verification function
async function verifyHmac(body, hmac, secret) {
  if (!hmac || !secret) return false;
  
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  
  // Convert hex to bytes
  const signatureBytes = hexToBytes(hmac);
  const dataBytes = encoder.encode(body);
  
  return await crypto.subtle.verify('HMAC', key, signatureBytes, dataBytes);
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

// Webhook handlers
async function handleAppUninstalled(data, env) {
  const shopDomain = data.domain || data.myshopify_domain;
  console.log(`🗑️ App uninstalled from ${shopDomain}`);
  
  // Delete from database
  if (env.DB) { // If using KV, D1, or other storage
    await env.DB.delete(`store:${shopDomain}`);
  }
  
  // Optional: Send to your logging service
  await fetch('https://your-logging-endpoint.com/uninstall', {
    method: 'POST',
    body: JSON.stringify({ shop: shopDomain, timestamp: new Date().toISOString() })
  });
}

async function handleOrderFulfilled(data, env) {
  console.log(`📦 Order ${data.id} fulfilled`);
  
  // YOUR CARRIER DETECTION LOGIC HERE
  const trackingNumbers = data.fulfillments?.map(f => f.tracking_number) || [];
  
  for (const trackingNumber of trackingNumbers) {
    if (trackingNumber) {
      // Auto-detect carrier (your existing logic)
      const carrier = await detectCarrier(trackingNumber);
      console.log(`🚚 Detected ${carrier} for ${trackingNumber}`);
      
      // Store in your database
      if (env.DB) {
        await env.DB.put(`tracking:${data.id}`, JSON.stringify({
          orderId: data.id,
          trackingNumber,
          carrier,
          detectedAt: new Date().toISOString()
        }));
      }
    }
  }
}

async function detectCarrier(trackingNumber) {
  // This is your existing carrier detection logic
  // Call your 1000+ courier detection service
  return 'Auto-detected';
}
