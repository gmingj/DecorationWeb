const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  basicInfo: {
    area: {
      type: Number,
      required: true
    },
    roomType: {
      type: String,
      required: true
    },
    budgetRange: {
      min: Number,
      max: Number
    },
    expectedCompletionTime: Date
  },
  stylePreferences: {
    style: {
      type: String,
      enum: ['现代简约', '北欧', '中式', '美式', '工业风', '其他'],
      required: true
    },
    colorPreference: {
      type: String,
      enum: ['冷色调', '暖色调', '中性色调']
    },
    referenceImages: [String] // URLs to uploaded images
  },
  materialChoices: {
    floorMaterial: {
      type: String,
      enum: ['木地板', '瓷砖', '大理石', '其他']
    },
    wallMaterial: {
      type: String,
      enum: ['乳胶漆', '壁纸', '硅藻泥', '其他']
    },
    kitchenBathroomMaterial: {
      type: String,
      enum: ['普通台面', '石英石台面', '大理石台面', '其他']
    },
    doorWindowMaterial: {
      type: String,
      enum: ['实木门', '复合门', '铝合金门窗', '其他']
    }
  },
  functionalRequirements: {
    storageNeeds: {
      type: String,
      enum: ['高', '中', '低']
    },
    lightingPreference: {
      type: String,
      enum: ['自然光', '人工光', '混合']
    },
    smartHomeNeeds: [String],
    specialFunctionalAreas: [String]
  },
  specialRequirements: {
    elderlyChildFriendly: Boolean,
    petFriendly: Boolean,
    ecoFriendly: Boolean,
    otherSpecialRequirements: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Requirement', requirementSchema); 