// Add these lines to your main server file
const express = require('express');
const bodyParser = require('body-parser');
const webhookRoutes = require('./server/webhooks');

const app = express();

// IMPORTANT: Use raw body for webhook verification
app.use('/webhooks', bodyParser.raw({ type: 'application/json' }));

// Parse JSON for other routes
app.use(bodyParser.json());

// Mount webhook routes
app.use('/webhooks', webhookRoutes);

// Your existing routes...
app.get('/api', (req, res) => {
  res.json({ message: 'Xroga AI Tracking API' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Xroga AI Tracking running on port ${PORT}`);
  console.log(`🔧 Webhooks available at: ${process.env.APP_URL}/webhooks`);
});
