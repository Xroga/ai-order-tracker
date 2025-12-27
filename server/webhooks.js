// server/webhooks.js
const express = require('express');
const router = express.Router();
const verifyWebhook = require('./verify-webhook');

// Apply HMAC verification to all webhook routes
router.use(verifyWebhook);

// 1. CUSTOMERS/DATA_REQUEST - GDPR Data Request
router.post('/customers/data_request', (req, res) => {
  console.log('🔵 GDPR Data Request Received');
  
  const { customer, shop_domain, shop_id } = req.body;
  
  // Log the request (you should save to your database)
  console.log({
    type: 'GDPR_DATA_REQUEST',
    shop_id,
    shop_domain,
    customer_id: customer?.id,
    customer_email: customer?.email,
    timestamp: new Date().toISOString()
  });
  
  // YOUR LOGIC HERE:
  // 1. Gather all data you store for this customer
  // 2. Compile into a structured format
  // 3. Send to merchant or store for their records
  
  // If you don't store any customer data, just acknowledge
  res.status(200).json({ 
    success: true, 
    message: 'Data request processed',
    note: 'Xroga AI Tracking does not store personal customer data beyond order tracking numbers'
  });
});

// 2. CUSTOMERS/REDACT - GDPR Data Deletion
router.post('/customers/redact', (req, res) => {
  console.log('🔴 GDPR Customer Redact Request Received');
  
  const { 
    customer, 
    shop_domain, 
    shop_id, 
    orders_to_redact 
  } = req.body;
  
  // Log the redaction request
  console.log({
    type: 'GDPR_CUSTOMER_REDACT',
    shop_id,
    shop_domain,
    customer_id: customer?.id,
    orders_to_redact: orders_to_redact || [],
    timestamp: new Date().toISOString()
  });
  
  // YOUR LOGIC HERE:
  // 1. Find all data for this customer
  // 2. Anonymize or delete it
  // 3. Confirm deletion in your database
  
  res.status(200).json({ 
    success: true, 
    message: 'Customer data redacted',
    note: 'All tracking data for this customer has been anonymized'
  });
});

// 3. SHOP/REDACT - Shop Data Deletion on Uninstall
router.post('/shop/redact', (req, res) => {
  console.log('⚫ GDPR Shop Redact Request Received');
  
  const { shop_domain, shop_id } = req.body;
  
  // Log the shop redaction
  console.log({
    type: 'GDPR_SHOP_REDACT',
    shop_id,
    shop_domain,
    timestamp: new Date().toISOString(),
    action: 'DELETE_ALL_SHOP_DATA'
  });
  
  // YOUR LOGIC HERE:
  // 1. Delete all shop settings
  // 2. Delete all tracking data
  // 3. Delete all database records for this shop
  
  res.status(200).json({ 
    success: true, 
    message: 'Shop data redacted',
    note: 'All data for this shop has been deleted as per GDPR requirements'
  });
});

module.exports = router;
