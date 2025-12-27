// Add this to your existing install.js or OAuth flow
const Shopify = require('@shopify/shopify-api');

async function registerMandatoryWebhooks(session) {
  const webhooks = [
    {
      topic: 'customers/data_request',
      address: `${process.env.APP_URL}/webhooks/customers/data_request`,
      format: 'json'
    },
    {
      topic: 'customers/redact',
      address: `${process.env.APP_URL}/webhooks/customers/redact`,
      format: 'json'
    },
    {
      topic: 'shop/redact',
      address: `${process.env.APP_URL}/webhooks/shop/redact`,
      format: 'json'
    }
  ];
  
  console.log('📝 Registering mandatory GDPR webhooks...');
  
  for (const webhook of webhooks) {
    try {
      const response = await Shopify.Webhooks.Registry.register({
        session,
        path: webhook.address.replace(process.env.APP_URL, ''),
        topic: webhook.topic,
      });
      
      console.log(`✅ Registered webhook: ${webhook.topic}`, response);
    } catch (error) {
      console.error(`❌ Failed to register ${webhook.topic}:`, error);
    }
  }
}

// Call this function after successful app installation
module.exports = { registerMandatoryWebhooks };
