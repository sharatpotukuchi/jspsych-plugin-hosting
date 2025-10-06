const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the current directory
app.use(express.static('.'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'plugin-hosting-service',
    timestamp: new Date().toISOString()
  });
});

// List available files
app.get('/files', (req, res) => {
  const fs = require('fs');
  const files = fs.readdirSync('.')
    .filter(file => file.endsWith('.js'))
    .map(file => ({
      name: file,
      url: `https://${req.get('host')}/${file}`
    }));
  
  res.json({ files });
});

app.listen(PORT, () => {
  console.log(`Plugin hosting service running on port ${PORT}`);
  console.log(`Available files:`);
  console.log(`- jspsych.js: https://localhost:${PORT}/jspsych.js`);
  console.log(`- plugin-columbia-card-task.js: https://localhost:${PORT}/plugin-columbia-card-task.js`);
});
