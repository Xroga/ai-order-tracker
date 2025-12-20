// worker.js - Cloudflare Worker Backend
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Home page
    if (url.pathname === '/') {
      return new Response('Worker is running!');
    }
    
    // OAuth callback (Shopify login)
    if (url.pathname === '/auth/callback') {
      const shop = url.searchParams.get('shop');
      const code = url.searchParams.get('code');
      
      // Get access token from Shopify
      const response = await fetch(
        `https://${shop}/admin/oauth/access_token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: env.SHOPIFY_API_KEY,
            client_secret: env.SHOPIFY_API_SECRET,
            code: code
          })
        }
      );
      
      const { access_token } = await response.json();
      
      // Redirect to your app
      return Response.redirect(
        `https://your-app.pages.dev?shop=${shop}&token=${access_token}`
      );
    }
    
    return new Response('Not found', { status: 404 });
  }
};
