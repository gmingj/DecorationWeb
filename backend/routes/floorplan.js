const express = require('express');
const router = express.Router();
const path = require('path');

// 导入服务
const uploadService = require('../services/uploadService');
const aiService = require('../services/aiService');

// 房间类型分析建议 (作为备用数据)
const ROOM_ANALYSIS = {
  'livingRoom': {
    name: '客厅',
    tips: [
      '客厅是家庭活动的中心，应保持开放通透',
      '沙发区应面向电视或焦点墙，形成交流中心',
      '确保有足够的自然光照',
      '注意家具摆放不要阻碍通行路线'
    ]
  },
  'bedroom': {
    name: '卧室',
    tips: [
      '床头应避免正对门口，保持私密性',
      '床的两侧最好留有通行空间',
      '衣柜门开启不应受阻',
      '可考虑使用窗帘调节光线，保证睡眠质量'
    ]
  },
  'kitchen': {
    name: '厨房',
    tips: [
      '厨房应遵循"工作三角形"原则（冰箱、水槽、灶台）',
      '确保有足够的操作台面',
      '注意油烟机的位置和排风效果',
      '储物空间应充分利用墙面高度'
    ]
  },
  'bathroom': {
    name: '卫生间',
    tips: [
      '注意干湿分离设计',
      '确保通风良好，防止潮湿',
      '马桶、洗手台、淋浴/浴缸的布局应合理',
      '考虑增加储物空间'
    ]
  },
  'diningRoom': {
    name: '餐厅',
    tips: [
      '餐桌与厨房的距离应适中，方便上菜',
      '确保每个座位都有足够的活动空间',
      '可考虑增加餐边柜增加储物功能',
      '光线应充足但不刺眼'
    ]
  },
  'studyRoom': {
    name: '书房',
    tips: [
      '书桌应有充足的自然光，避免眩光',
      '书架的高度应方便取放',
      '注意电源插座的位置，方便电子设备使用',
      '可考虑隔音处理，保证安静的工作环境'
    ]
  }
};

// 户型问题及建议 (作为备用数据)
const LAYOUT_ISSUES = {
  'narrowEntrance': {
    name: '入户过窄',
    tips: [
      '使用镜面扩大视觉空间',
      '简化入户区域的家具',
      '使用明亮的照明',
      '墙面使用浅色调'
    ]
  },
  'poorLighting': {
    name: '采光不足',
    tips: [
      '使用浅色系装修提亮空间',
      '增加镜面反射自然光',
      '选择通透的窗帘',
      '增加人工照明，使用多层次光源'
    ]
  },
  'awkwardLayout': {
    name: '户型结构不规则',
    tips: [
      '使用家具巧妙划分空间',
      '不规则区域可设计成储物空间',
      '使用统一的地面材料增加整体感',
      '考虑定制家具适应不规则空间'
    ]
  },
  'limitedSpace': {
    name: '空间狭小',
    tips: [
      '选择比例适当的家具',
      '多功能家具可节省空间',
      '善用墙面和高处空间',
      '开放式设计增加空间感'
    ]
  },
  'poorVentilation': {
    name: '通风不良',
    tips: [
      '考虑增加换气扇或新风系统',
      '优化窗户位置或更换为可开启式窗户',
      '室内植物可改善空气质量',
      '减少阻碍气流的隔断'
    ]
  }
};

// 生成模拟数据（当AI服务不可用时）
const generateMockAnalysis = (imageUrl) => {
  // 模拟识别的房间
  const rooms = [
    { type: 'livingRoom', area: Math.round(Math.random() * 20 + 15) },
    { type: 'bedroom', area: Math.round(Math.random() * 10 + 10) },
    { type: 'kitchen', area: Math.round(Math.random() * 5 + 5) },
    { type: 'bathroom', area: Math.round(Math.random() * 3 + 3) },
    { type: 'diningRoom', area: Math.round(Math.random() * 8 + 8) }
  ];
  
  // 随机选择2-3个户型问题
  const issueKeys = Object.keys(LAYOUT_ISSUES);
  const selectedIssues = [];
  const issueCount = Math.floor(Math.random() * 2) + 2; // 2-3个问题
  
  for (let i = 0; i < issueCount; i++) {
    const randomIndex = Math.floor(Math.random() * issueKeys.length);
    const issueKey = issueKeys[randomIndex];
    
    // 避免重复
    if (!selectedIssues.find(issue => issue.key === issueKey)) {
      selectedIssues.push({
        key: issueKey,
        ...LAYOUT_ISSUES[issueKey]
      });
    }
    
    // 从数组中移除已选项
    issueKeys.splice(randomIndex, 1);
    
    if (issueKeys.length === 0) break;
  }
  
  // 生成房间分析
  const roomAnalysis = rooms.map(room => ({
    type: room.type,
    name: ROOM_ANALYSIS[room.type].name,
    area: room.area,
    tips: ROOM_ANALYSIS[room.type].tips
  }));
  
  // 创建分析结果
  return {
    totalArea: rooms.reduce((sum, room) => sum + room.area, 0),
    rooms: roomAnalysis,
    issues: selectedIssues,
    generalRecommendations: [
      '注意房间的动线规划，保证流通顺畅',
      '根据朝向合理规划房间功能',
      '充分利用自然光',
      '考虑未来生活变化的可能性，预留弹性空间'
    ]
  };
};

// 上传并分析户型图
router.post('/analyze', uploadService.upload.single('floorplan'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '请上传户型图' });
    }

    // 获取上传的文件URL
    const fileUrl = uploadService.getFileUrl(req, req.file.filename);
    
    let analysis;
    
    // 调用AI服务分析户型图
    if (aiService.isConfigured()) {
      // 获取图片尺寸信息
      const imageSize = {
        width: req.body.width || 0,
        height: req.body.height || 0
      };
      
      // 调用AI分析
      const aiResult = await aiService.analyzeFloorplan(fileUrl, imageSize);
      
      if (aiResult) {
        analysis = aiResult;
      } else {
        // AI分析失败，使用模拟数据
        analysis = generateMockAnalysis(fileUrl);
      }
    } else {
      // AI服务未配置，使用模拟数据
      analysis = generateMockAnalysis(fileUrl);
    }
    
    // 添加元数据
    const result = {
      _id: 'floorplan_' + Date.now(),
      floorplanUrl: fileUrl,
      ...analysis,
      createdAt: new Date()
    };
    
    // 存储分析结果（内存中）
    global.demoFloorplanAnalyses = global.demoFloorplanAnalyses || [];
    global.demoFloorplanAnalyses.push(result);
    
    res.json(result);
  } catch (error) {
    console.error('户型图分析失败:', error);
    res.status(500).json({ message: error.message });
  }
});

// 获取历史分析结果
router.get('/', (req, res) => {
  try {
    global.demoFloorplanAnalyses = global.demoFloorplanAnalyses || [];
    res.json(global.demoFloorplanAnalyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取特定分析结果
router.get('/:id', (req, res) => {
  try {
    global.demoFloorplanAnalyses = global.demoFloorplanAnalyses || [];
    
    const analysis = global.demoFloorplanAnalyses.find(a => a._id === req.params.id);
    
    if (!analysis) {
      return res.status(404).json({ message: '分析结果不存在' });
    }
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 