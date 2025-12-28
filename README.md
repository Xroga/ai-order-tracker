# Xroga AI Tracking - Cloudflare Setup

## Webhooks Setup for Shopify App Review

### Current Setup:
- Frontend: Cloudflare Pages (`ai-order-trackers.pages.dev`)
- Backend: Cloudflare Workers (for webhooks)
- Webhook URLs:
  1. `https://ai-order-trackers.pages.dev/webhooks/customers/data_request`
  2. `https://ai-order-trackers.pages.dev/webhooks/customers/redact`
  3. `https://ai-order-trackers.pages.dev/webhooks/shop/redact`

### Steps to Deploy:

1. **Install Wrangler CLI:**
   ```bash
   npm install -g wrangler
