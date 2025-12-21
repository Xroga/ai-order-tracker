// worker.js - CourierDetect Pro Shopify OAuth Backend
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // 1. Health check endpoint
    if (path === '/health') {
      return new Response('✅ CourierDetect OAuth Worker is operational.', { 
        headers: { 'Content-Type': 'text/plain' } 
      });
    }
    
    // 2. OAuth START: Redirect to Shopify for installation
    if (path === '/auth') {
      const shop = url.searchParams.get('shop');
      
      // Validate Shopify domain format
      if (!shop || !/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/.test(shop)) {
        return new Response('Invalid Shopify store domain.', { 
          status: 400,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
      
      // Generate state parameter for CSRF protection
      const state = crypto.randomUUID();
      
      // 🔴 CRITICAL FIX: Point to YOUR Worker's callback URL
      const redirectUri = 'https://courierdetect.evanderthorne-help.workers.dev/auth/callback';
      
      // Build Shopify OAuth authorization URL
      const authUrl = new URL(`https://${shop}/admin/oauth/authorize`);
      authUrl.searchParams.set('client_id', env.SHOPIFY_API_KEY);
      authUrl.searchParams.set('scope', 'read_orders,write_orders,read_products');
      authUrl.searchParams.set('redirect_uri', redirectUri);  // ✅ Fixed URL
      authUrl.searchParams.set('state', state);
      
      // Redirect merchant to Shopify
      return Response.redirect(authUrl.toString());
    }
    
    // 3. OAuth CALLBACK: Shopify redirects here after approval
    if (path === '/auth/callback') {
      const shop = url.searchParams.get('shop');
      const code = url.searchParams.get('code');
      const hmac = url.searchParams.get('hmac');
      
      // Validate required parameters
      if (!shop || !code || !hmac) {
        return new Response('Missing required OAuth parameters.', { 
          status: 400,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
      
      // ⚠️ IMPORTANT: In production, you MUST implement HMAC validation here
      // Example: verifyShopifyHmac(url.searchParams, env.SHOPIFY_API_SECRET)
      
      try {
        // Exchange authorization code for access token
        const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'User-Agent': 'CourierDetect-Pro-Shopify-App'
          },
          body: JSON.stringify({
            client_id: env.SHOPIFY_API_KEY,
            client_secret: env.SHOPIFY_API_SECRET,
            code: code
          })
        });
        
        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          throw new Error(`Shopify API error ${tokenResponse.status}: ${errorText}`);
        }
        
        const { access_token } = await tokenResponse.json();
        
        // 🔴 CRITICAL FIX: Redirect to YOUR frontend Pages site
        const frontendUrl = `${env.APP_URL}?shop=${encodeURIComponent(shop)}&token=${encodeURIComponent(access_token)}`;
        return Response.redirect(frontendUrl);
        
      } catch (error) {
        console.error('OAuth Error:', error);
        return new Response(`Authentication failed. Please try again. Error: ${error.message}`, { 
          status: 500,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    }
    
    // 4. Default response for root path
    if (path === '/') {
      return new Response('CourierDetect Pro OAuth Worker', {
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    // 5. Not found for all other paths
    return new Response('Not Found', { 
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
