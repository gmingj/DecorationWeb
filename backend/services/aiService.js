const axios = require('axios');
require('dotenv').config();

// OpenAI API配置
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// 检查API密钥是否存在
const isConfigured = () => {
  return !!OPENAI_API_KEY;
};

// 基础请求配置
const getRequestConfig = () => {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    }
  };
};

// 风格测试分析
const analyzeStylePreferences = async (answers, questions) => {
  if (!isConfigured()) {
    console.warn('OpenAI API未配置，使用模拟数据');
    return null;
  }

  try {
    // 构建提示词
    const prompt = buildStyleAnalysisPrompt(answers, questions);
    
    // 调用OpenAI API
    const response = await axios.post(OPENAI_API_URL, {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "你是一位专业的室内设计师，擅长分析用户的装修风格偏好。" },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }, getRequestConfig());

    // 解析响应
    const result = response.data.choices[0].message.content;
    return parseStyleAnalysisResult(result);
  } catch (error) {
    console.error('调用OpenAI API失败:', error.message);
    return null;
  }
};

// 构建风格分析提示词
const buildStyleAnalysisPrompt = (answers, questions) => {
  // 将用户回答转换为可读格式
  const userResponses = answers.map(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    const option = question?.options.find(opt => opt.id === answer.optionId);
    return `问题: ${question?.question}\n回答: ${option?.text}`;
  }).join('\n\n');

  return `
请分析以下用户对装修风格偏好问卷的回答，并给出详细的风格分析报告。
用户回答:
${userResponses}

请以JSON格式返回分析结果，包含以下字段:
1. topStyles: 数组，包含用户最匹配的两种风格（现代简约、北欧、中式、美式、工业风），每种风格包含:
   - style: 风格名称
   - percentage: 匹配度百分比(0-100)
   - description: 风格描述
   - characteristics: 数组，包含该风格的5个特点
   - suitableFor: 适合人群描述
2. allScores: 数组，包含所有风格的匹配度，每个包含:
   - style: 风格名称
   - percentage: 匹配度百分比
3. recommendations: 数组，包含5条基于首选风格的装修建议

请确保返回的是有效的JSON格式，不要包含任何其他文本。
`;
};

// 解析风格分析结果
const parseStyleAnalysisResult = (resultText) => {
  try {
    // 提取JSON部分
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('无法从响应中提取JSON');
    }
    
    const result = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error) {
    console.error('解析AI响应失败:', error.message);
    return null;
  }
};

// 户型图分析
const analyzeFloorplan = async (imageUrl, imageSize) => {
  if (!isConfigured()) {
    console.warn('OpenAI API未配置，使用模拟数据');
    return null;
  }

  try {
    // 构建提示词
    const prompt = buildFloorplanAnalysisPrompt(imageUrl, imageSize);
    
    // 调用OpenAI API (GPT-4 Vision)
    const response = await axios.post(OPENAI_API_URL, {
      model: "gpt-4-vision-preview",
      messages: [
        { 
          role: "user", 
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    }, getRequestConfig());

    // 解析响应
    const result = response.data.choices[0].message.content;
    return parseFloorplanAnalysisResult(result);
  } catch (error) {
    console.error('调用OpenAI API失败:', error.message);
    return null;
  }
};

// 构建户型图分析提示词
const buildFloorplanAnalysisPrompt = (imageUrl, imageSize) => {
  return `
请分析这张户型图，并给出详细的空间布局分析和改进建议。
请识别图中的房间类型（如客厅、卧室、厨房、卫生间等）并估算面积。
请分析户型存在的问题（如采光不足、空间狭小、户型结构不规则等）。
请给出针对各房间的布局建议和总体改进建议。

请以JSON格式返回分析结果，包含以下字段:
1. totalArea: 估算总面积（平方米）
2. rooms: 数组，包含识别出的房间，每个房间包含:
   - type: 房间类型（livingRoom, bedroom, kitchen, bathroom, diningRoom, studyRoom等）
   - name: 房间名称（中文）
   - area: 估算面积
   - tips: 数组，包含4条该房间的布局建议
3. issues: 数组，包含2-3个户型问题，每个问题包含:
   - key: 问题标识符（如poorLighting, limitedSpace等）
   - name: 问题名称（中文）
   - tips: 数组，包含4条针对该问题的改进建议
4. generalRecommendations: 数组，包含4条总体建议

请确保返回的是有效的JSON格式，不要包含任何其他文本。
`;
};

// 解析户型图分析结果
const parseFloorplanAnalysisResult = (resultText) => {
  try {
    // 提取JSON部分
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('无法从响应中提取JSON');
    }
    
    const result = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error) {
    console.error('解析AI响应失败:', error.message);
    return null;
  }
};

module.exports = {
  analyzeStylePreferences,
  analyzeFloorplan,
  isConfigured
}; 