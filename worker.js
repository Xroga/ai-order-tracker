// worker.js - FIXED with exact webhook paths
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    
    // 1. Health check
    if (path === "/health") {
      return new Response("✅ Xroga AI Tracking is operational", {
        headers: { "Content-Type": "text/plain" }
      });
    }
    
    // 2. OAuth - Start installation
    if (path === "/auth") {
      const shop = url.searchParams.get("shop");
      if (!shop || !/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/.test(shop)) {
        return new Response("Invalid Shopify store", { status: 400 });
      }
      
      const state = crypto.randomUUID();
      const redirectUri = `${env.FRONTEND_URL || "https://ai-order-trackers.pages.dev"}/auth/callback`;
      
      const authUrl = new URL(`https://${shop}/admin/oauth/authorize`);
      authUrl.searchParams.set("client_id", env.SHOPIFY_API_KEY);
      authUrl.searchParams.set("scope", env.SHOPIFY_SCOPES || "read_orders,write_orders,read_products");
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("state", state);
      
      return Response.redirect(authUrl.toString());
    }
    
    // 3. OAuth - Callback
    if (path === "/auth/callback") {
      const shop = url.searchParams.get("shop");
      const code = url.searchParams.get("code");
      
      if (!shop || !code) {
        return new Response("Missing parameters", { status: 400 });
      }
      
      try {
        // Get access token
        const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: env.SHOPIFY_API_KEY,
            client_secret: env.SHOPIFY_API_SECRET,
            code
          })
        });
        
        if (!tokenResponse.ok) {
          throw new Error(`Token error: ${tokenResponse.status}`);
        }
        
        const { access_token } = await tokenResponse.json();
        
        // Register webhooks after successful installation
        await registerWebhooks(shop, access_token, env);
        
        // Redirect to app
        const frontendUrl = `${env.FRONTEND_URL || "https://ai-order-trackers.pages.dev"}?shop=${encodeURIComponent(shop)}&token=${encodeURIComponent(access_token)}`;
        return Response.redirect(frontendUrl);
        
      } catch (error) {
        console.error("OAuth Error:", error);
        return new Response(`Authentication failed: ${error.message}`, { status: 500 });
      }
    }
    
    // 4. ⭐⭐⭐ EXACT WEBHOOK PATHS ⭐⭐⭐
    if (method === "POST") {
      if (path === "/webhooks/customers/data_request") {
        return handleWebhook("customers/data_request", request, env);
      }
      if (path === "/webhooks/customers/redact") {
        return handleWebhook("customers/redact", request, env);
      }
      if (path === "/webhooks/shop/redact") {
        return handleWebhook("shop/redact", request, env);
      }
    }
    
    // 5. Default response
    return new Response("Xroga AI Tracking - Order Detection", {
      headers: { "Content-Type": "text/plain" }
    });
  }
};

// Webhook Handler - FIXED
async function handleWebhook(expectedTopic, request, env) {
  try {
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
    
    // 5. Get actual topic
    const actualTopic = request.headers.get('X-Shopify-Topic');
    const shopDomain = request.headers.get('X-Shopify-Shop-Domain');
    const body = JSON.parse(rawBody);
    
    console.log(`✅ Webhook received: ${actualTopic} from ${shopDomain}`);
    
    // 6. Return 200 OK
    return new Response(JSON.stringify({
      success: true,
      app: "Xroga AI Tracking",
      webhook: actualTopic,
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

// Register webhooks
async function registerWebhooks(shop, accessToken, env) {
  const webhooks = [
    {
      topic: 'customers/data_request',
      address: `https://courierdetect-auth.evanderthorne-help.workers.dev/webhooks/customers/data_request`,
      format: 'json'
    },
    {
      topic: 'customers/redact',
      address: `https://courierdetect-auth.evanderthorne-help.workers.dev/webhooks/customers/redact`,
      format: 'json'
    },
    {
      topic: 'shop/redact',
      address: `https://courierdetect-auth.evanderthorne-help.workers.dev/webhooks/shop/redact`,
      format: 'json'
    }
  ];
  
  console.log('📝 Registering Shopify webhooks...');
  
  for (const webhook of webhooks) {
    try {
      await fetch(`https://${shop}/admin/api/2024-01/webhooks.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken
        },
        body: JSON.stringify({ webhook })
      });
      console.log(`✅ Registered: ${webhook.topic}`);
    } catch (error) {
      console.error(`❌ Failed to register ${webhook.topic}:`, error.message);
    }
  }
}
