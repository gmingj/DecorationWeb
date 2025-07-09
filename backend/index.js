require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// Import routes
const requirementRoutes = require('./routes/requirements');
const pricingRoutes = require('./routes/pricing');
const styleTestRoutes = require('./routes/styleTest');
const floorplanRoutes = require('./routes/floorplan');
const comparisonRoutes = require('./routes/comparison');

// Import services
const uploadService = require('./services/uploadService');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// 确保上传目录存在
const uploadDir = path.join(__dirname, uploadService.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// 静态文件服务（用于户型图和其他上传文件）
app.use(`/${uploadService.UPLOAD_DIR}`, express.static(uploadDir));

// Routes
app.use('/api/requirements', requirementRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/style-test', styleTestRoutes);
app.use('/api/floorplan', floorplanRoutes);
app.use('/api/comparison', comparisonRoutes);

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
    console.log(`Upload directory: ${uploadDir}`);
    console.log(`API available at http://localhost:${PORT}`);
  });
}); 