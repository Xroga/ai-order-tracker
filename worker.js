// Environment variables needed in Cloudflare Workers dashboard:
// SHOPIFY_API_SECRET = your_app_client_secret (regenerate this!)
// SHOPIFY_API_KEY = your_app_client_id (01eb5efeb620eef58d313a65bfe89e0c)

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Health check endpoint
    if (path === "/health") {
      return new Response("✅ Xroga AI Tracking is operational", {
        headers: { "Content-Type": "text/plain" }
      });
    }

    // AUTH CALLBACK (Simplified - Shopify CLI handles most OAuth)
    if (path === "/auth/callback") {
      return new Response("Auth callback - install via Shopify Admin", {
        status: 200,
        headers: { "Content-Type": "text/plain" }
      });
    }

    // COMPLIANCE WEBHOOKS (All three go to same endpoint)
    if (method === "POST" && path === "/webhooks/compliance") {
      return handleComplianceWebhook(request, env);
    }

    // ORDER CREATE WEBHOOK
    if (method === "POST" && path === "/webhooks/orders/create") {
      return handleOrderCreateWebhook(request, env);
    }

    // Default response
    return new Response("Xroga AI Tracking API", {
      status: 200,
      headers: { "Content-Type": "text/plain" }
    });
  }
};

// ✅ CORRECT HMAC VERIFICATION
async function verifyWebhook(request, env) {
  const hmacHeader = request.headers.get('X-Shopify-Hmac-Sha256');
  if (!hmacHeader) return false;

  try {
    // Get raw body
    const rawBody = await request.clone().text();
    
    // Create HMAC key
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(env.SHOPIFY_API_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Decode the base64 HMAC header
    const signature = atob(hmacHeader);
    const signatureBytes = new Uint8Array(signature.length);
    for (let i = 0; i < signature.length; i++) {
      signatureBytes[i] = signature.charCodeAt(i);
    }

    // Verify
    const data = new TextEncoder().encode(rawBody);
    return await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      data
    );
  } catch (error) {
    console.error('HMAC verification error:', error);
    return false;
  }
}

// Handle all three compliance webhooks
async function handleComplianceWebhook(request, env) {
  // 1. Verify HMAC (REQUIRED for Shopify review)
  if (!await verifyWebhook(request, env)) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 2. Get webhook details
  const topic = request.headers.get('X-Shopify-Topic');
  const shopDomain = request.headers.get('X-Shopify-Shop-Domain');
  const body = await request.json();

  console.log(`🔒 Compliance webhook: ${topic} from ${shopDomain}`);

  // 3. Process based on topic
  switch(topic) {
    case 'customers/data_request':
      console.log('📋 Data request for:', body.customer?.email);
      console.log('Orders requested:', body.orders_requested);
      // Store this request and fulfill within 30 days
      break;
      
    case 'customers/redact':
      console.log('🗑️ Redact customer:', body.customer?.email);
      console.log('Orders to redact:', body.orders_to_redact);
      // Delete this customer's data from your database
      break;
      
    case 'shop/redact':
      console.log('🏪 Redact shop:', body.shop_domain);
      // Delete all data for this shop from your database
      break;
  }

  // 4. Return 200 OK (REQUIRED)
  return new Response(JSON.stringify({ 
    success: true,
    message: `Processed ${topic} webhook`
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Handle order creation
async function handleOrderCreateWebhook(request, env) {
  // 1. Verify HMAC (REQUIRED)
  if (!await verifyWebhook(request, env)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const orderData = await request.json();
  const shopDomain = request.headers.get('X-Shopify-Shop-Domain');

  console.log('🛒 New order received:', {
    shop: shopDomain,
    order_id: orderData.id,
    order_number: orderData.order_number,
    total_price: orderData.total_price,
    email: orderData.email
  });

  // 2. Your order tracking logic here
  // TODO: Implement your AI order detection logic
  
  // 3. Return 200 OK
  return new Response(JSON.stringify({ 
    success: true,
    message: `Order ${orderData.order_number} received for tracking`
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
