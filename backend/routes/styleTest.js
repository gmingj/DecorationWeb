const express = require('express');
const router = express.Router();

// 导入AI服务
const aiService = require('../services/aiService');

// 风格测试问卷题目
const STYLE_QUESTIONS = [
  {
    id: 'q1',
    question: '您更喜欢哪种颜色系列？',
    options: [
      { id: 'a', text: '明亮活泼的色彩（红、橙、黄）', styles: ['美式', '工业风'] },
      { id: 'b', text: '自然柔和的色彩（米、棕、绿）', styles: ['北欧', '中式'] },
      { id: 'c', text: '简洁现代的色彩（白、灰、黑）', styles: ['现代简约', '工业风'] },
      { id: 'd', text: '高雅奢华的色彩（紫、金、深蓝）', styles: ['美式', '中式'] }
    ]
  },
  {
    id: 'q2',
    question: '您喜欢的家具线条是？',
    options: [
      { id: 'a', text: '简洁直线型', styles: ['现代简约', '北欧'] },
      { id: 'b', text: '自然有机型', styles: ['北欧', '中式'] },
      { id: 'c', text: '复古装饰型', styles: ['美式', '中式'] },
      { id: 'd', text: '工业粗犷型', styles: ['工业风'] }
    ]
  },
  {
    id: 'q3',
    question: '您理想的居住空间是？',
    options: [
      { id: 'a', text: '开放通透', styles: ['现代简约', '北欧'] },
      { id: 'b', text: '温馨舒适', styles: ['北欧', '美式'] },
      { id: 'c', text: '古典优雅', styles: ['中式', '美式'] },
      { id: 'd', text: '个性张扬', styles: ['工业风', '现代简约'] }
    ]
  },
  {
    id: 'q4',
    question: '您更注重哪些材质？',
    options: [
      { id: 'a', text: '木材和布艺', styles: ['北欧', '美式'] },
      { id: 'b', text: '金属和混凝土', styles: ['工业风', '现代简约'] },
      { id: 'c', text: '大理石和玻璃', styles: ['现代简约', '美式'] },
      { id: 'd', text: '竹藤和陶瓷', styles: ['中式', '北欧'] }
    ]
  },
  {
    id: 'q5',
    question: '您喜欢的装饰元素是？',
    options: [
      { id: 'a', text: '几何图案', styles: ['现代简约', '工业风'] },
      { id: 'b', text: '自然元素（植物、动物）', styles: ['北欧', '中式'] },
      { id: 'c', text: '复古怀旧元素', styles: ['美式', '工业风'] },
      { id: 'd', text: '传统文化元素', styles: ['中式'] }
    ]
  }
];

// 风格特点描述
const STYLE_DESCRIPTIONS = {
  '现代简约': {
    description: '追求简洁、实用的设计理念，线条流畅，色彩以中性色调为主，注重空间的开放性和功能性。',
    characteristics: ['简洁直线', '黑白灰色调', '开放空间', '功能性强', '少量装饰'],
    suitableFor: '适合追求简约生活、注重实用性的年轻人或忙碌的职场人士。'
  },
  '北欧': {
    description: '强调自然、舒适和功能性，色彩明亮温暖，大量使用木材，设计简约但不失温馨。',
    characteristics: ['木质元素', '明亮色调', '舒适实用', '自然材质', '温馨氛围'],
    suitableFor: '适合喜欢自然、追求舒适生活的家庭。'
  },
  '中式': {
    description: '融合传统文化元素与现代生活方式，注重对称与平衡，色彩多以红木色、暗红色等为主。',
    characteristics: ['传统纹样', '对称布局', '木质家具', '文化元素', '讲究意境'],
    suitableFor: '适合热爱中国传统文化、追求内敛与和谐的人士。'
  },
  '美式': {
    description: '强调舒适与自由，风格多样化，从乡村到古典都有涉及，色彩丰富，装饰元素较多。',
    characteristics: ['舒适实用', '色彩丰富', '装饰丰富', '混搭风格', '自由随意'],
    suitableFor: '适合性格开朗、喜欢自由表达的家庭。'
  },
  '工业风': {
    description: '源于旧工厂改造，保留原始建筑元素，如裸露的砖墙、管道等，色彩以灰色、黑色为主。',
    characteristics: ['裸露材质', '粗犷线条', '金属元素', '开放空间', '复古元素'],
    suitableFor: '适合个性张扬、追求独特生活方式的年轻人。'
  }
};

// 获取问卷题目
router.get('/questions', (req, res) => {
  try {
    // 只返回问题和选项，不包含样式关联（避免前端作弊）
    const questions = STYLE_QUESTIONS.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options.map(opt => ({
        id: opt.id,
        text: opt.text
      }))
    }));
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 生成风格建议
function generateRecommendations(topStyle) {
  const recommendations = {
    '现代简约': [
      '选择简洁线条的家具，避免过多装饰',
      '使用黑、白、灰等中性色调为主',
      '保持空间开放通透，减少隔断',
      '选择功能性强的储物解决方案',
      '灯光设计简约明亮，避免复杂的灯具'
    ],
    '北欧': [
      '大量使用原木材质，如松木、白橡木等',
      '选择舒适、实用的家具',
      '色彩以白色为基础，搭配明亮的蓝、绿等色彩',
      '加入自然元素，如绿植、原木',
      '注重自然光线，窗户尽量保持通透'
    ],
    '中式': [
      '选择红木、黑檀等传统木材的家具',
      '注重对称布局，讲究平衡',
      '加入中国传统元素，如书法、国画等',
      '色彩可选择红色、金色等传统色彩',
      '灯具可选择灯笼、宫灯等中式元素'
    ],
    '美式': [
      '选择舒适、体积较大的沙发和座椅',
      '混搭不同风格的家具和装饰',
      '加入丰富的软装饰，如抱枕、地毯等',
      '色彩可以丰富多样，不拘一格',
      '墙面可考虑壁纸或护墙板装饰'
    ],
    '工业风': [
      '保留或模拟裸露的砖墙、管道等元素',
      '选择金属材质的家具和灯具',
      '色彩以灰色、黑色为主，可点缀鲜艳色彩',
      '使用粗犷的木材和金属结合的家具',
      '灯具可选择工业风格的吊灯、轨道灯等'
    ]
  };
  
  return recommendations[topStyle] || recommendations['现代简约'];
}

// 使用规则计算风格得分
function calculateStyleScores(answers) {
  // 计算每种风格的得分
  const styleScores = {
    '现代简约': 0,
    '北欧': 0,
    '中式': 0,
    '美式': 0,
    '工业风': 0
  };
  
  answers.forEach(answer => {
    const question = STYLE_QUESTIONS.find(q => q.id === answer.questionId);
    if (question) {
      const option = question.options.find(opt => opt.id === answer.optionId);
      if (option) {
        option.styles.forEach(style => {
          styleScores[style] += 1;
        });
      }
    }
  });
  
  return styleScores;
}

// 分析风格测试结果
router.post('/analyze', async (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: '答案格式不正确' });
    }
    
    let styleReport;
    
    // 尝试使用AI分析
    if (aiService.isConfigured()) {
      try {
        const aiResult = await aiService.analyzeStylePreferences(answers, STYLE_QUESTIONS);
        
        if (aiResult && aiResult.topStyles && aiResult.allScores && aiResult.recommendations) {
          // 使用AI分析结果
          styleReport = {
            _id: 'style_report_' + Date.now(),
            ...aiResult,
            createdAt: new Date()
          };
        }
      } catch (error) {
        console.error('AI风格分析失败，使用规则计算:', error.message);
      }
    }
    
    // 如果AI分析失败或未配置，使用规则计算
    if (!styleReport) {
      // 计算每种风格的得分
      const styleScores = calculateStyleScores(answers);
      
      // 找出得分最高的风格
      let topStyles = Object.entries(styleScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(entry => ({
          style: entry[0],
          percentage: Math.round((entry[1] / (answers.length * 2)) * 100), // 每个问题可能贡献2分
          ...STYLE_DESCRIPTIONS[entry[0]]
        }));
      
      // 创建风格报告
      styleReport = {
        _id: 'style_report_' + Date.now(),
        topStyles: topStyles,
        allScores: Object.entries(styleScores).map(([style, score]) => ({
          style,
          percentage: Math.round((score / (answers.length * 2)) * 100)
        })),
        recommendations: generateRecommendations(topStyles[0].style),
        createdAt: new Date()
      };
    }
    
    // 存储报告（内存中）
    global.demoStyleReports = global.demoStyleReports || [];
    global.demoStyleReports.push(styleReport);
    
    res.json(styleReport);
  } catch (error) {
    console.error('风格测试分析失败:', error);
    res.status(500).json({ message: error.message });
  }
});

// 获取历史风格报告
router.get('/', (req, res) => {
  try {
    global.demoStyleReports = global.demoStyleReports || [];
    res.json(global.demoStyleReports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取特定风格报告
router.get('/:id', (req, res) => {
  try {
    global.demoStyleReports = global.demoStyleReports || [];
    
    const report = global.demoStyleReports.find(r => r._id === req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: '风格报告不存在' });
    }
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 