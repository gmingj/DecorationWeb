import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  CardActions,
  Checkbox,
  FormControlLabel,
  TextField,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs
} from '@mui/material';
import {
  Compare as CompareIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { fetchQuotations } from '../store/quotationSlice';
import {
  createComparison,
  fetchComparisons,
  toggleSelectedQuotation,
  clearSelectedQuotations,
  clearCurrentComparison
} from '../store/comparisonSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const ComparisonPage = () => {
  const dispatch = useDispatch();
  const { quotations, loading: quotationsLoading } = useSelector(state => state.quotation);
  const {
    comparisons,
    currentComparison,
    selectedQuotations,
    loading: comparisonLoading,
    error
  } = useSelector(state => state.comparison);
  const [comparisonName, setComparisonName] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // 获取报价和对比历史
  useEffect(() => {
    dispatch(fetchQuotations());
    dispatch(fetchComparisons());
  }, [dispatch]);
  
  // 处理标签切换
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // 处理报价选择
  const handleToggleQuotation = (quotationId) => {
    dispatch(toggleSelectedQuotation(quotationId));
  };
  
  // 创建对比
  const handleCreateComparison = () => {
    if (selectedQuotations.length >= 2) {
      dispatch(createComparison({
        quotationIds: selectedQuotations,
        name: comparisonName || `报价对比 ${new Date().toLocaleDateString()}`
      }));
    }
  };
  
  // 查看历史对比
  const handleViewComparison = (comparison) => {
    dispatch(clearCurrentComparison());
    setTimeout(() => {
      // 模拟加载
      dispatch({ type: 'comparison/fetchOne/fulfilled', payload: comparison });
    }, 300);
  };
  
  // 渲染报价选择区域
  const renderQuotationSelection = () => {
    if (quotationsLoading) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (quotations.length === 0) {
      return (
        <Alert severity="info" sx={{ my: 2 }}>
          暂无可用的报价，请先创建报价
        </Alert>
      );
    }
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          选择要对比的报价（至少选择2个）
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {quotations.map((quotation) => (
            <Grid item xs={12} sm={6} md={4} key={quotation._id}>
              <Card
                elevation={2}
                sx={{
                  borderColor: selectedQuotations.includes(quotation._id) ? 'primary.main' : 'transparent',
                  borderWidth: 2,
                  borderStyle: 'solid'
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {quotation.name}
                  </Typography>
                  
                  <Typography variant="h5" color="primary" gutterBottom>
                    ¥{quotation.totalPrice.toLocaleString()}
                  </Typography>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Typography variant="body2" color="textSecondary">
                    材料费: ¥{quotation.itemizedCosts.materials.toLocaleString()}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary">
                    人工费: ¥{quotation.itemizedCosts.labor.toLocaleString()}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary">
                    设计费: ¥{quotation.itemizedCosts.design.toLocaleString()}
                  </Typography>
                </CardContent>
                
                <CardActions>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedQuotations.includes(quotation._id)}
                        onChange={() => handleToggleQuotation(quotation._id)}
                        color="primary"
                      />
                    }
                    label="选择此报价"
                  />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="对比名称（可选）"
            value={comparisonName}
            onChange={(e) => setComparisonName(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1 }}
          />
          
          <Button
            variant="contained"
            startIcon={<CompareIcon />}
            onClick={handleCreateComparison}
            disabled={selectedQuotations.length < 2 || comparisonLoading}
          >
            创建对比
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => dispatch(clearSelectedQuotations())}
            disabled={selectedQuotations.length === 0}
          >
            清除选择
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    );
  };
  
  // 渲染对比结果
  const renderComparisonResult = () => {
    if (comparisonLoading && !currentComparison) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (!currentComparison) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="textSecondary">
            请选择至少两个报价并创建对比
          </Typography>
        </Box>
      );
    }
    
    // 准备图表数据
    const chartData = currentComparison.quotations.map(q => ({
      name: q.name,
      总价: q.totalPrice,
      材料费: q.itemizedCosts.materials,
      人工费: q.itemizedCosts.labor,
      设计费: q.itemizedCosts.design
    }));
    
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          {currentComparison.name}
        </Typography>
        
        <Grid container spacing={3}>
          {/* 总览图表 */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                价格对比
              </Typography>
              
              <Box sx={{ height: 400, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="总价" fill="#8884d8" />
                    <Bar dataKey="材料费" fill="#82ca9d" />
                    <Bar dataKey="人工费" fill="#ffc658" />
                    <Bar dataKey="设计费" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
          
          {/* 价格摘要 */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                价格摘要
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>项目</TableCell>
                      <TableCell align="right">最低价</TableCell>
                      <TableCell align="right">最高价</TableCell>
                      <TableCell align="right">平均价</TableCell>
                      <TableCell align="right">差价</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>总价</TableCell>
                      <TableCell align="right">¥{currentComparison.analysis.summary.minPrice.toLocaleString()}</TableCell>
                      <TableCell align="right">¥{currentComparison.analysis.summary.maxPrice.toLocaleString()}</TableCell>
                      <TableCell align="right">¥{Math.round(currentComparison.analysis.summary.avgPrice).toLocaleString()}</TableCell>
                      <TableCell align="right">¥{currentComparison.analysis.summary.priceRange.toLocaleString()} ({currentComparison.analysis.summary.priceRangeRatio}%)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>材料费</TableCell>
                      <TableCell align="right">¥{currentComparison.analysis.costComparison.materials.minCost.toLocaleString()}</TableCell>
                      <TableCell align="right">¥{currentComparison.analysis.costComparison.materials.maxCost.toLocaleString()}</TableCell>
                      <TableCell align="right">¥{Math.round(currentComparison.analysis.costComparison.materials.avgCost).toLocaleString()}</TableCell>
                      <TableCell align="right">¥{(currentComparison.analysis.costComparison.materials.maxCost - currentComparison.analysis.costComparison.materials.minCost).toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>人工费</TableCell>
                      <TableCell align="right">¥{currentComparison.analysis.costComparison.labor.minCost.toLocaleString()}</TableCell>
                      <TableCell align="right">¥{currentComparison.analysis.costComparison.labor.maxCost.toLocaleString()}</TableCell>
                      <TableCell align="right">¥{Math.round(currentComparison.analysis.costComparison.labor.avgCost).toLocaleString()}</TableCell>
                      <TableCell align="right">¥{(currentComparison.analysis.costComparison.labor.maxCost - currentComparison.analysis.costComparison.labor.minCost).toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>设计费</TableCell>
                      <TableCell align="right">¥{currentComparison.analysis.costComparison.design.minCost.toLocaleString()}</TableCell>
                      <TableCell align="right">¥{currentComparison.analysis.costComparison.design.maxCost.toLocaleString()}</TableCell>
                      <TableCell align="right">¥{Math.round(currentComparison.analysis.costComparison.design.avgCost).toLocaleString()}</TableCell>
                      <TableCell align="right">¥{(currentComparison.analysis.costComparison.design.maxCost - currentComparison.analysis.costComparison.design.minCost).toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          
          {/* 报价分析 */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                报价分析
              </Typography>
              
              {currentComparison.analysis.quotationAnalysis.map((analysis) => (
                <Box key={analysis.id} sx={{ mb: 2, p: 1, borderRadius: 1, bgcolor: 'background.default' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1">
                      {analysis.name}
                    </Typography>
                    <Chip
                      label={`¥${analysis.totalPrice.toLocaleString()}`}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      价格水平:
                    </Typography>
                    <Chip
                      size="small"
                      label={analysis.priceLevel}
                      color={
                        analysis.priceLevel === '低于平均水平'
                          ? 'success'
                          : analysis.priceLevel === '高于平均水平'
                          ? 'error'
                          : 'default'
                      }
                      sx={{ ml: 1 }}
                    />
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                      ({analysis.priceDifference > 0 ? '+' : ''}{analysis.priceDifference}%)
                    </Typography>
                  </Box>
                  
                  {analysis.features.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        特点:
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        {analysis.features.map((feature, index) => (
                          <Typography key={index} variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                            <ArrowForwardIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                            {feature}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              ))}
            </Paper>
          </Grid>
          
          {/* 建议 */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                对比建议
              </Typography>
              
              <List>
                {currentComparison.analysis.recommendations.map((recommendation, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={recommendation} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };
  
  // 渲染历史对比
  const renderHistoryComparisons = () => {
    if (comparisonLoading && comparisons.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (comparisons.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="textSecondary">
            暂无历史对比记录
          </Typography>
        </Box>
      );
    }
    
    return (
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {comparisons.map((comparison) => (
          <Grid item xs={12} sm={6} md={4} key={comparison._id}>
            <Card
              elevation={2}
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => handleViewComparison(comparison)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {comparison.name}
                </Typography>
                
                <Divider sx={{ my: 1 }} />
                
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  对比 {comparison.quotations.length} 个报价:
                </Typography>
                
                {comparison.quotations.map((quotation, index) => (
                  <Box key={quotation._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">
                      {index + 1}. {quotation.name}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ¥{quotation.totalPrice.toLocaleString()}
                    </Typography>
                  </Box>
                ))}
                
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  创建时间: {new Date(comparison.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          报价对比
        </Typography>
        
        <Typography variant="body1" paragraph align="center">
          比较不同报价方案，找出最适合您的选择
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        {/* 标签页 */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="报价对比标签页"
            centered
          >
            <Tab label="新建对比" />
            <Tab label={`历史记录 (${comparisons.length})`} />
          </Tabs>
        </Box>
        
        {/* 新建对比标签页 */}
        {tabValue === 0 && (
          <Box>
            {renderQuotationSelection()}
            {renderComparisonResult()}
          </Box>
        )}
        
        {/* 历史记录标签页 */}
        {tabValue === 1 && (
          <Box>
            {renderHistoryComparisons()}
            {currentComparison && renderComparisonResult()}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ComparisonPage; 