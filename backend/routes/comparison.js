const express = require('express');
const router = express.Router();

// 创建报价对比
router.post('/', (req, res) => {
  try {
    const { quotationIds, name } = req.body;
    
    if (!quotationIds || !Array.isArray(quotationIds) || quotationIds.length < 2) {
      return res.status(400).json({ message: '至少需要两个报价进行对比' });
    }
    
    // 获取内存中的报价数据
    global.demoQuotations = global.demoQuotations || [];
    
    // 查找所有指定的报价
    const quotations = quotationIds.map(id => {
      return global.demoQuotations.find(q => q._id === id);
    }).filter(q => q); // 过滤掉未找到的报价
    
    if (quotations.length < 2) {
      return res.status(400).json({ message: '找不到足够的报价进行对比' });
    }
    
    // 创建对比分析
    const comparison = {
      _id: 'comparison_' + Date.now(),
      name: name || `报价对比 ${new Date().toLocaleDateString()}`,
      quotations: quotations,
      analysis: generateComparison(quotations),
      createdAt: new Date()
    };
    
    // 存储对比结果（内存中）
    global.demoComparisons = global.demoComparisons || [];
    global.demoComparisons.push(comparison);
    
    res.status(201).json(comparison);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取所有报价对比
router.get('/', (req, res) => {
  try {
    global.demoComparisons = global.demoComparisons || [];
    res.json(global.demoComparisons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取特定报价对比
router.get('/:id', (req, res) => {
  try {
    global.demoComparisons = global.demoComparisons || [];
    
    const comparison = global.demoComparisons.find(c => c._id === req.params.id);
    
    if (!comparison) {
      return res.status(404).json({ message: '报价对比不存在' });
    }
    
    res.json(comparison);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 生成对比分析
function generateComparison(quotations) {
  // 计算总价差异
  const totalPrices = quotations.map(q => q.totalPrice);
  const minPrice = Math.min(...totalPrices);
  const maxPrice = Math.max(...totalPrices);
  const avgPrice = totalPrices.reduce((sum, price) => sum + price, 0) / totalPrices.length;
  
  // 计算各项成本的对比
  const materialsComparison = compareItemizedCosts(quotations, 'materials');
  const laborComparison = compareItemizedCosts(quotations, 'labor');
  const designComparison = compareItemizedCosts(quotations, 'design');
  
  // 分析各报价的特点
  const quotationAnalysis = quotations.map(quotation => {
    // 计算该报价与平均值的偏差百分比
    const priceDifference = ((quotation.totalPrice - avgPrice) / avgPrice) * 100;
    
    // 判断价格水平
    let priceLevel;
    if (priceDifference < -10) {
      priceLevel = '低于平均水平';
    } else if (priceDifference > 10) {
      priceLevel = '高于平均水平';
    } else {
      priceLevel = '接近平均水平';
    }
    
    // 分析该报价的特点
    const features = [];
    
    // 材料成本分析
    const materialRatio = quotation.itemizedCosts.materials / quotation.totalPrice;
    if (materialRatio > 0.6) {
      features.push('材料成本占比较高，可能使用了高品质材料');
    } else if (materialRatio < 0.4) {
      features.push('材料成本占比较低，可能使用了经济型材料');
    }
    
    // 人工成本分析
    const laborRatio = quotation.itemizedCosts.labor / quotation.totalPrice;
    if (laborRatio > 0.4) {
      features.push('人工成本占比较高，可能工艺要求较高');
    } else if (laborRatio < 0.2) {
      features.push('人工成本占比较低，可能施工难度较小');
    }
    
    // 设计成本分析
    const designRatio = quotation.itemizedCosts.design / quotation.totalPrice;
    if (designRatio > 0.15) {
      features.push('设计成本占比较高，可能包含更详细的设计服务');
    }
    
    return {
      id: quotation._id,
      name: quotation.name,
      totalPrice: quotation.totalPrice,
      priceDifference: Math.round(priceDifference * 10) / 10, // 保留一位小数
      priceLevel,
      features
    };
  });
  
  // 生成综合建议
  const recommendations = [];
  
  // 价格差异建议
  const priceRange = maxPrice - minPrice;
  const priceRangeRatio = priceRange / minPrice;
  
  if (priceRangeRatio > 0.3) {
    recommendations.push('各报价方案价格差异较大，建议详细比较材料和工艺差异');
  } else {
    recommendations.push('各报价方案价格相近，可以更多考虑服务质量和口碑');
  }
  
  // 材料成本建议
  const materialsCostVariation = (materialsComparison.maxCost - materialsComparison.minCost) / materialsComparison.avgCost;
  if (materialsCostVariation > 0.3) {
    recommendations.push('材料成本差异较大，建议核实材料品牌、型号和质量等级');
  }
  
  // 人工成本建议
  const laborCostVariation = (laborComparison.maxCost - laborComparison.minCost) / laborComparison.avgCost;
  if (laborCostVariation > 0.3) {
    recommendations.push('人工成本差异较大，建议了解施工团队规模、经验和工艺水平');
  }
  
  // 返回完整的分析结果
  return {
    summary: {
      minPrice,
      maxPrice,
      avgPrice,
      priceRange,
      priceRangeRatio: Math.round(priceRangeRatio * 100) // 转为百分比
    },
    costComparison: {
      materials: materialsComparison,
      labor: laborComparison,
      design: designComparison
    },
    quotationAnalysis,
    recommendations
  };
}

// 比较特定成本项的差异
function compareItemizedCosts(quotations, costType) {
  const costs = quotations.map(q => q.itemizedCosts[costType]);
  
  return {
    minCost: Math.min(...costs),
    maxCost: Math.max(...costs),
    avgCost: costs.reduce((sum, cost) => sum + cost, 0) / costs.length,
    values: quotations.map(q => ({
      id: q._id,
      name: q.name,
      value: q.itemizedCosts[costType]
    }))
  };
}

module.exports = router; 