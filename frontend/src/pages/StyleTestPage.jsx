import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon,
  Info as InfoIcon,
  Share as ShareIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { fetchStyleQuestions, updateAnswer, submitStyleAnswers, clearAnswers, fetchStyleReports } from '../store/styleTestSlice';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';

// 风格图片映射
const STYLE_IMAGES = {
  '现代简约': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb3?auto=format&fit=crop&w=300&h=200',
  '北欧': 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=300&h=200',
  '中式': 'https://images.unsplash.com/photo-1503787834998-b2d978a15ed7?auto=format&fit=crop&w=300&h=200',
  '美式': 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=300&h=200',
  '工业风': 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=300&h=200'
};

// 风格颜色映射
const STYLE_COLORS = {
  '现代简约': '#2196F3',
  '北欧': '#4CAF50',
  '中式': '#F44336',
  '美式': '#FF9800',
  '工业风': '#9C27B0'
};

const StyleTestPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { questions, answers, report, reports, loading, error } = useSelector(state => state.styleTest);
  const [activeStep, setActiveStep] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [selectedReportId, setSelectedReportId] = useState(null);
  
  // 获取问题
  useEffect(() => {
    if (questions.length === 0) {
      dispatch(fetchStyleQuestions());
    }
  }, [dispatch, questions.length]);
  
  // 获取历史报告
  useEffect(() => {
    dispatch(fetchStyleReports());
  }, [dispatch]);
  
  // 处理答案选择
  const handleAnswerSelect = (questionId, optionId) => {
    dispatch(updateAnswer({ questionId, optionId }));
  };
  
  // 处理下一步
  const handleNext = () => {
    if (activeStep === questions.length) {
      // 提交答案
      dispatch(submitStyleAnswers(answers));
    } else {
      setActiveStep(prevStep => prevStep + 1);
    }
  };
  
  // 处理上一步
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  // 重新开始测试
  const handleRestart = () => {
    dispatch(clearAnswers());
    setActiveStep(0);
    setTabValue(0);
  };
  
  // 检查当前问题是否已回答
  const isCurrentQuestionAnswered = () => {
    if (activeStep >= questions.length) return true;
    
    const currentQuestionId = questions[activeStep]?.id;
    return answers.some(answer => answer.questionId === currentQuestionId);
  };

  // 处理标签页变化
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 选择历史报告
  const handleSelectReport = (reportId) => {
    setSelectedReportId(reportId);
    setTabValue(1); // 切换到历史报告标签页
  };

  // 获取当前显示的报告
  const getCurrentReport = () => {
    if (tabValue === 0 || !selectedReportId) {
      return report;
    } else {
      return reports.find(r => r._id === selectedReportId);
    }
  };

  // 继续到需求收集
  const handleContinueToRequirements = () => {
    navigate('/requirements', { 
      state: { 
        fromStyleTest: true, 
        preferredStyle: getCurrentReport()?.topStyles[0]?.style || '现代简约'
      } 
    });
  };
  
  // 渲染问题
  const renderQuestion = () => {
    if (loading && questions.length === 0) {
      return (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (error) {
      return (
        <Box my={4}>
          <Typography color="error">{error}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(fetchStyleQuestions())}
            sx={{ mt: 2 }}
          >
            重试
          </Button>
        </Box>
      );
    }
    
    if (activeStep >= questions.length) {
      return renderSummary();
    }
    
    const question = questions[activeStep];
    const selectedOption = answers.find(answer => answer.questionId === question?.id)?.optionId;
    
    return (
      <Paper elevation={3} sx={{ p: 3, my: 3 }}>
        <Typography variant="h5" gutterBottom>
          {question?.question}
        </Typography>
        
        <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
          <RadioGroup
            value={selectedOption || ''}
            onChange={(e) => handleAnswerSelect(question.id, e.target.value)}
          >
            {question?.options.map(option => (
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={<Radio />}
                label={option.text}
                sx={{ my: 1 }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Paper>
    );
  };
  
  // 渲染答题总结
  const renderSummary = () => {
    if (loading && !getCurrentReport()) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" my={4}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            正在分析您的风格偏好...
          </Typography>
        </Box>
      );
    }
    
    const currentReport = getCurrentReport();
    
    if (!currentReport) {
      return (
        <Box my={4}>
          <Typography variant="h6">请回答所有问题以获取风格分析</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setActiveStep(0)}
            sx={{ mt: 2 }}
          >
            返回问题
          </Button>
        </Box>
      );
    }

    // 为饼图准备数据
    const pieData = currentReport.allScores.map(score => ({
      name: score.style,
      value: score.percentage
    }));

    return (
      <Box my={4}>
        {/* 标签页 */}
        {report && (
          <Paper sx={{ mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab icon={<InfoIcon />} label="当前测试结果" />
              <Tab icon={<HistoryIcon />} label="历史测试结果" />
            </Tabs>
          </Paper>
        )}

        {/* 历史报告选择 */}
        {tabValue === 1 && (
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>历史风格测试报告</Typography>
            {reports.length === 0 ? (
              <Alert severity="info">暂无历史测试记录</Alert>
            ) : (
              <Grid container spacing={2}>
                {reports.map(historyReport => (
                  <Grid item xs={12} sm={6} md={4} key={historyReport._id}>
                    <Card 
                      elevation={historyReport._id === selectedReportId ? 8 : 2}
                      onClick={() => handleSelectReport(historyReport._id)}
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': { transform: 'translateY(-4px)' }
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          {new Date(historyReport.createdAt).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          主要风格: {historyReport.topStyles[0].style} ({historyReport.topStyles[0].percentage}%)
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        )}

        <Typography variant="h5" gutterBottom>
          您的装修风格偏好分析
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* 顶级风格 */}
          {currentReport.topStyles.map((style, index) => (
            <Grid item xs={12} md={6} key={style.style}>
              <Card elevation={3}>
                <Box
                  sx={{
                    height: 200,
                    backgroundImage: `url(${STYLE_IMAGES[style.style] || ''})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      bgcolor: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      p: 1
                    }}
                  >
                    <Typography variant="h6">
                      {index === 0 ? '主要风格' : '次要风格'}: {style.style}
                    </Typography>
                    <Typography variant="body2">
                      匹配度: {style.percentage}%
                    </Typography>
                  </Box>
                </Box>
                <CardContent>
                  <Typography variant="body1" paragraph>
                    {style.description}
                  </Typography>
                  
                  <Typography variant="subtitle1" gutterBottom>
                    特点:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {style.characteristics.map((char, i) => (
                      <Chip key={i} label={char} color="primary" variant="outlined" />
                    ))}
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary">
                    {style.suitableFor}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          
          {/* 风格匹配度饼图 */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', minHeight: 300 }}>
              <Typography variant="h6" gutterBottom>
                风格匹配度
              </Typography>
              
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STYLE_COLORS[entry.name] || `#${Math.floor(Math.random()*16777215).toString(16)}`} />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          {/* 装修建议 */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                装修建议
              </Typography>
              
              <List>
                {currentReport.recommendations.map((recommendation, index) => (
                  <ListItem key={index} alignItems="flex-start">
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <ArrowForwardIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={recommendation} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRestart}
          >
            重新测试
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AssignmentIcon />}
            onClick={handleContinueToRequirements}
          >
            继续填写装修需求
          </Button>
          
          <Tooltip title="分享结果">
            <IconButton color="primary">
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    );
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          装修风格测试
        </Typography>
        
        <Typography variant="body1" paragraph align="center">
          回答以下问题，我们将帮您找到最适合的装修风格
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        {/* 步骤指示器 */}
        {!report && (
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {questions.map((question, index) => {
              const isAnswered = answers.some(answer => answer.questionId === question.id);
              
              return (
                <Step key={question.id} completed={isAnswered}>
                  <StepLabel
                    StepIconProps={{
                      icon: isAnswered ? <CheckCircleIcon color="primary" /> : index + 1
                    }}
                  >
                    问题 {index + 1}
                  </StepLabel>
                </Step>
              );
            })}
            <Step key="summary" completed={report !== null}>
              <StepLabel>结果</StepLabel>
            </Step>
          </Stepper>
        )}
        
        {/* 问题内容 */}
        {renderQuestion()}
        
        {/* 导航按钮 */}
        {!report && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              上一步
            </Button>
            
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isCurrentQuestionAnswered() || loading}
            >
              {activeStep === questions.length - 1 ? '完成' : '下一步'}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default StyleTestPage; 