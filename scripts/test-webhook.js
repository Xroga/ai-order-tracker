// scripts/test-webhook.js
const crypto = require('crypto');
const fetch = require('node-fetch');

const SHOPIFY_API_SECRET = 'your-test-secret';
const WEBHOOK_URL = 'http://localhost:8787/webhooks/customers/data_request';

const testData = {
  shop_id: 123456,
  shop_domain: 'test.myshopify.com',
  customer: { id: 789, email: 'test@example.com' }
};

const body = JSON.stringify(testData);
const hmac = crypto
  .createHmac('sha256', SHOPIFY_API_SECRET)
  .update(body, 'utf8')
  .digest('base64');

async function test() {
  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Topic': 'customers/data_request',
      'X-Shopify-Hmac-Sha256': hmac,
      'X-Shopify-Shop-Domain': 'test.myshopify.com'
    },
    body
  });
  
  console.log(`Status: ${response.status}`);
  console.log(`Response: ${await response.text()}`);
}

test();
