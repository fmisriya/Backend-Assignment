// index.js
require('dotenv').config();
const express = require('express');
const app = express();

// Use port from .env or fallback to 3000
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

app.get('/students', (req, res) => {
  res.json([{ id: 1, name: "Asha", age: 20 }]);
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server listening at http://localhost:${port}`);
});
