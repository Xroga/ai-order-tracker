// server/verify-webhook.js
const crypto = require('crypto');

function verifyWebhook(req, res, next) {
  try {
    // Get HMAC header from Shopify
    const hmacHeader = req.get('X-Shopify-Hmac-Sha256');
    const topicHeader = req.get('X-Shopify-Topic');
    const shopHeader = req.get('X-Shopify-Shop-Domain');
    
    if (!hmacHeader) {
      console.error('❌ No HMAC header found');
      return res.status(401).json({ error: 'Unauthorized - No HMAC' });
    }
    
    // Get raw body for HMAC calculation
    const rawBody = req.rawBody || JSON.stringify(req.body);
    
    // Calculate HMAC
    const calculatedHmac = crypto
      .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
      .update(rawBody, 'utf8')
      .digest('base64');
    
    // Compare HMACs
    const isValid = crypto.timingSafeEqual(
      Buffer.from(calculatedHmac, 'base64'),
      Buffer.from(hmacHeader, 'base64')
    );
    
    if (isValid) {
      console.log(`✅ Webhook verified: ${topicHeader} from ${shopHeader}`);
      next();
    } else {
      console.error('❌ HMAC verification failed:', {
        shop: shopHeader,
        topic: topicHeader,
        received: hmacHeader,
        calculated: calculatedHmac
      });
      res.status(401).json({ error: 'Unauthorized - Invalid HMAC' });
    }
    
  } catch (error) {
    console.error('❌ Webhook verification error:', error);
    res.status(500).json({ error: 'Webhook verification failed' });
  }
}

module.exports = verifyWebhook;
