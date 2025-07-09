const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  itemizedCosts: {
    materials: {
      type: Number,
      required: true
    },
    labor: {
      type: Number,
      required: true
    },
    design: {
      type: Number,
      default: 0
    },
    other: {
      type: Number,
      default: 0
    }
  },
  details: [{
    item: String,
    description: String,
    unitPrice: Number,
    quantity: Number,
    total: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quotation', quotationSchema); 