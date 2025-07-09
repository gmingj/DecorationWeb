require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

// Import routes
const requirementRoutes = require('./routes/requirements');
const pricingRoutes = require('./routes/pricing');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/requirements', requirementRoutes);
app.use('/api/pricing', pricingRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Decoration Web API is running');
});

// MongoDB connection (commented out for demo purposes)
const connectDB = async () => {
  try {
    // For demo purposes, we'll skip the MongoDB connection
    // await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/decoration');
    console.log('Demo mode: MongoDB connection skipped');
    return Promise.resolve();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return Promise.resolve(); // Continue anyway for demo
  }
};

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}); 