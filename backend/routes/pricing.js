const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Requirement = require('../models/Requirement');
const Quotation = require('../models/Quotation');

// Base pricing constants (for demonstration purposes)
const BASE_PRICES = {
  materials: {
    floorMaterial: {
      '木地板': 300, // per square meter
      '瓷砖': 200,
      '大理石': 800,
      '其他': 250
    },
    wallMaterial: {
      '乳胶漆': 60, // per square meter
      '壁纸': 80,
      '硅藻泥': 120,
      '其他': 80
    },
    kitchenBathroomMaterial: {
      '普通台面': 1000, // per meter
      '石英石台面': 1500,
      '大理石台面': 2500,
      '其他': 1200
    },
    doorWindowMaterial: {
      '实木门': 2000, // per door
      '复合门': 1200,
      '铝合金门窗': 1500,
      '其他': 1300
    }
  },
  labor: {
    base: 200, // per square meter
    complexity: {
      '现代简约': 1.0,
      '北欧': 1.1,
      '中式': 1.3,
      '美式': 1.2,
      '工业风': 1.15,
      '其他': 1.2
    }
  },
  design: {
    base: 100 // per square meter
  }
};

// Calculate price based on requirements
router.post('/calculate', async (req, res) => {
  try {
    const { requirementId } = req.body;
    
    if (!requirementId) {
      return res.status(400).json({ message: 'Requirement ID is required' });
    }
    
    // For demo purposes, we'll use in-memory data
    global.demoRequirements = global.demoRequirements || [];
    global.demoQuotations = global.demoQuotations || [];
    
    const requirement = global.demoRequirements.find(req => req._id === requirementId);
    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }
    
    // Get area from requirements
    const area = requirement.basicInfo.area;
    
    // Calculate materials cost
    const floorMaterialPrice = BASE_PRICES.materials.floorMaterial[requirement.materialChoices.floorMaterial || '其他'] || BASE_PRICES.materials.floorMaterial['其他'];
    const wallMaterialPrice = BASE_PRICES.materials.wallMaterial[requirement.materialChoices.wallMaterial || '其他'] || BASE_PRICES.materials.wallMaterial['其他'];
    const kitchenBathroomMaterialPrice = BASE_PRICES.materials.kitchenBathroomMaterial[requirement.materialChoices.kitchenBathroomMaterial || '其他'] || BASE_PRICES.materials.kitchenBathroomMaterial['其他'];
    const doorWindowMaterialPrice = BASE_PRICES.materials.doorWindowMaterial[requirement.materialChoices.doorWindowMaterial || '其他'] || BASE_PRICES.materials.doorWindowMaterial['其他'];
    
    // Assume standard room has 4 walls with height of 2.8m, 1 door, and kitchen/bathroom is 20% of total area
    const wallArea = Math.sqrt(area) * 4 * 2.8;
    const kitchenBathroomLength = Math.sqrt(area * 0.2) * 4; // Perimeter of kitchen/bathroom
    const doorCount = Math.ceil(area / 15); // Roughly 1 door per 15 square meters
    
    const materialsCost = (
      floorMaterialPrice * area +
      wallMaterialPrice * wallArea +
      kitchenBathroomMaterialPrice * kitchenBathroomLength +
      doorWindowMaterialPrice * doorCount
    );
    
    // Calculate labor cost with complexity factor
    const complexityFactor = BASE_PRICES.labor.complexity[requirement.stylePreferences.style || '其他'] || BASE_PRICES.labor.complexity['其他'];
    const laborCost = BASE_PRICES.labor.base * area * complexityFactor;
    
    // Calculate design cost
    const designCost = BASE_PRICES.design.base * area;
    
    // Calculate total cost
    const totalCost = materialsCost + laborCost + designCost;
    
    // Create itemized details
    const details = [
      {
        item: '地面材料',
        description: requirement.materialChoices.floorMaterial || '其他',
        unitPrice: floorMaterialPrice,
        quantity: area,
        total: floorMaterialPrice * area
      },
      {
        item: '墙面材料',
        description: requirement.materialChoices.wallMaterial || '其他',
        unitPrice: wallMaterialPrice,
        quantity: wallArea,
        total: wallMaterialPrice * wallArea
      },
      {
        item: '厨卫材料',
        description: requirement.materialChoices.kitchenBathroomMaterial || '其他',
        unitPrice: kitchenBathroomMaterialPrice,
        quantity: kitchenBathroomLength,
        total: kitchenBathroomMaterialPrice * kitchenBathroomLength
      },
      {
        item: '门窗材料',
        description: requirement.materialChoices.doorWindowMaterial || '其他',
        unitPrice: doorWindowMaterialPrice,
        quantity: doorCount,
        total: doorWindowMaterialPrice * doorCount
      },
      {
        item: '人工费用',
        description: `${requirement.stylePreferences.style || '其他'} 风格 (复杂度系数: ${complexityFactor})`,
        unitPrice: BASE_PRICES.labor.base * complexityFactor,
        quantity: area,
        total: laborCost
      },
      {
        item: '设计费用',
        description: '设计服务费',
        unitPrice: BASE_PRICES.design.base,
        quantity: area,
        total: designCost
      }
    ];
    
    // Create quotation in memory
    const quotation = {
      _id: 'quote_' + Date.now(),
      projectId: requirement.projectId,
      name: `${requirement.stylePreferences.style || '标准'} 风格装修报价`,
      totalPrice: totalCost,
      itemizedCosts: {
        materials: materialsCost,
        labor: laborCost,
        design: designCost,
        other: 0
      },
      details: details,
      createdAt: new Date()
    };
    
    global.demoQuotations.push(quotation);
    
    res.json({
      quotation: quotation,
      summary: {
        materialsCost,
        laborCost,
        designCost,
        totalCost
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all quotations for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const quotations = await Quotation.find({ projectId: req.params.projectId });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific quotation
router.get('/:id', async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    res.json(quotation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 