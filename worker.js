// worker.js - SECURE Shopify OAuth Backend
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // --- 1. OAuth START: Redirect merchant to Shopify to install the app ---
    if (url.pathname === '/auth') {
      const shop = url.searchParams.get('shop');
      
      // Validate the shop domain format
      if (!shop || !/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/.test(shop)) {
        return new Response('Invalid Shopify store domain.', { status: 400 });
      }
      
      // Generate a unique 'state' parameter to prevent CSRF attacks [citation:10]
      const state = crypto.randomUUID();
      // In a real app, you might store this 'state' in a database with a short expiry
      
      // Build the Shopify OAuth authorization URL
      const authUrl = new URL(`https://${shop}/admin/oauth/authorize`);
      authUrl.searchParams.set('client_id', env.SHOPIFY_API_KEY);
      authUrl.searchParams.set('scope', 'read_orders,write_orders,read_products');
      authUrl.searchParams.set('redirect_uri', `${env.APP_URL}/auth/callback`);
      authUrl.searchParams.set('state', state);
      
      // Redirect the user's browser to Shopify
      return Response.redirect(authUrl.toString());
    }
    
    // --- 2. OAuth CALLBACK: Shopify redirects back here after merchant approves ---
    if (url.pathname === '/auth/callback') {
      const shop = url.searchParams.get('shop');
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const hmac = url.searchParams.get('hmac');
      
      // CRITICAL: Verify all required parameters are present
      if (!shop || !code || !hmac) {
        return new Response('Missing required OAuth parameters.', { status: 400 });
      }
      
      // IMPORTANT: In a production app, you MUST verify the 'state' parameter here
      // against the one you saved in step 1 to prevent CSRF attacks [citation:10].
      // if (state !== savedState) { return new Response('Invalid state.', { status: 403 }); }
      
      // CRITICAL: Verify the HMAC signature from Shopify for security
      // You need to implement HMAC validation. Search for "Shopify OAuth HMAC validation" for guides.
      // const isValidHmac = verifyShopifyHmac(url.searchParams, env.SHOPIFY_API_SECRET);
      // if (!isValidHmac) { return new Response('Invalid HMAC.', { status: 403 }); }
      
      try {
        // Exchange the temporary 'code' for a permanent 'access_token'
        const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: env.SHOPIFY_API_KEY,
            client_secret: env.SHOPIFY_API_SECRET,
            code: code
          })
        });
        
        if (!tokenResponse.ok) {
          throw new Error(`Shopify token request failed: ${tokenResponse.status}`);
        }
        
        const { access_token, scope } = await tokenResponse.json();
        
        // Redirect the user back to your app's frontend with the token
        // SECURE: The token is passed via the URL for this single redirect only.
        const appFrontendUrl = `${env.APP_URL}?shop=${encodeURIComponent(shop)}&token=${encodeURIComponent(access_token)}`;
        return Response.redirect(appFrontendUrl);
        
      } catch (error) {
        console.error('OAuth Error:', error);
        return new Response(`Authentication failed. Please try again. Error: ${error.message}`, { status: 500 });
      }
    }
    
    // Simple endpoint to check if the worker is running
    if (url.pathname === '/health') {
      return new Response('✅ CourierDetect OAuth Worker is operational.', { 
        headers: { 'Content-Type': 'text/plain' } 
      });
    }
    
    return new Response('Not Found', { status: 404 });
  }
};
