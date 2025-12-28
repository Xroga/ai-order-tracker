// _worker.js - Main Cloudflare Worker
import { onRequestPost } from './functions/webhooks.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle webhooks
    if (url.pathname.startsWith('/webhooks/') && request.method === 'POST') {
      // Pass environment variables
      env.SHOPIFY_API_SECRET = env.SHOPIFY_API_SECRET;
      return onRequestPost({ request, env, ctx });
    }
    
    // For all other requests, serve the static site
    return env.ASSETS.fetch(request);
  }
};
