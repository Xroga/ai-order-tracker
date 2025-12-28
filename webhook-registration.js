// If you have a separate backend for OAuth, add this
const Shopify = require('@shopify/shopify-api');

async function registerWebhooks(session) {
  // Use your Cloudflare Pages domain for webhooks
  const webhooks = [
    {
      topic: 'customers/data_request',
      address: 'https://ai-order-trackers.pages.dev/webhooks/customers/data_request',
      format: 'json'
    },
    {
      topic: 'customers/redact',
      address: 'https://ai-order-trackers.pages.dev/webhooks/customers/redact',
      format: 'json'
    },
    {
      topic: 'shop/redact',
      address: 'https://ai-order-trackers.pages.dev/webhooks/shop/redact',
      format: 'json'
    }
  ];
  
  for (const webhook of webhooks) {
    try {
      await Shopify.Webhooks.Registry.register({
        session,
        path: webhook.address,
        topic: webhook.topic,
      });
      console.log(`✅ Registered: ${webhook.topic}`);
    } catch (error) {
      console.error(`❌ Failed to register ${webhook.topic}:`, error.message);
    }
  }
}

module.exports = { registerWebhooks };
