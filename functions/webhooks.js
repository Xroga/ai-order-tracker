// functions/webhooks.js - Cloudflare Worker
export async function onRequestPost(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Get Shopify API Secret from Cloudflare Secrets
  const SHOPIFY_API_SECRET = context.env.SHOPIFY_API_SECRET;
  
  // Verify HMAC
  const hmacHeader = request.headers.get('X-Shopify-Hmac-Sha256');
  const rawBody = await request.text();
  
  if (!await verifyHMAC(rawBody, hmacHeader, SHOPIFY_API_SECRET)) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const body = JSON.parse(rawBody);
  
  // Route to appropriate handler
  if (path.includes('customers/data_request')) {
    return handleDataRequest(body);
  } else if (path.includes('customers/redact')) {
    return handleCustomerRedact(body);
  } else if (path.includes('shop/redact')) {
    return handleShopRedact(body);
  }
  
  return new Response('Not Found', { status: 404 });
}

// HMAC Verification for Cloudflare Workers
async function verifyHMAC(rawBody, hmacHeader, apiSecret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(apiSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  
  const signature = Uint8Array.from(atob(hmacHeader), c => c.charCodeAt(0));
  const data = encoder.encode(rawBody);
  
  return crypto.subtle.verify('HMAC', key, signature, data);
}

// Handler for GDPR Data Request
function handleDataRequest(body) {
  console.log('GDPR Data Request:', JSON.stringify(body));
  
  // YOUR LOGIC: Gather customer data
  // If you use a database, fetch and format data here
  
  return new Response(JSON.stringify({
    success: true,
    message: 'Data request received',
    note: 'Xroga AI Tracking processes this request'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Handler for Customer Redact
function handleCustomerRedact(body) {
  console.log('Customer Redact:', JSON.stringify(body));
  
  // YOUR LOGIC: Delete customer data from your database
  
  return new Response(JSON.stringify({
    success: true,
    message: 'Customer data redaction processed'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Handler for Shop Redact
function handleShopRedact(body) {
  console.log('Shop Redact:', JSON.stringify(body));
  
  // YOUR LOGIC: Delete all shop data
  
  return new Response(JSON.stringify({
    success: true,
    message: 'Shop data redaction processed'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
