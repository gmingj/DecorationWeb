import React, { useState, useEffect, useRef } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip,
  TextField,
  Chip,
  Badge
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Home as HomeIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon,
  Apartment as ApartmentIcon,
  Science as ScienceIcon,
  Architecture as ArchitectureIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';
import { analyzeFloorplan, fetchFloorplanAnalyses, clearCurrentAnalysis } from '../store/floorplanSlice';

const FloorplanPage = () => {
  const dispatch = useDispatch();
  const { analyses, currentAnalysis, loading, error, uploadProgress } = useSelector(state => state.floorplan);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const fileInputRef = useRef(null);
  
  // 获取历史分析
  useEffect(() => {
    dispatch(fetchFloorplanAnalyses());
  }, [dispatch]);
  
  // 处理文件选择
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (selectedFile) {
      setFile(selectedFile);
      
      // 创建预览URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
      
      // 获取图片尺寸
      const img = new Image();
      img.onload = () => {
        setImageSize({
          width: img.width,
          height: img.height
        });
      };
      img.src = previewUrl;
      
      // 清除当前分析结果
      dispatch(clearCurrentAnalysis());
    }
  };
  
  // 处理文件上传和分析
  const handleAnalyze = () => {
    if (file) {
      const formData = new FormData();
      formData.append('floorplan', file);
      formData.append('width', imageSize.width);
      formData.append('height', imageSize.height);
      
      dispatch(analyzeFloorplan(formData));
    }
  };
  
  // 处理标签切换
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // 查看历史分析
  const handleViewAnalysis = (analysis) => {
    dispatch(clearCurrentAnalysis());
    setTimeout(() => {
      // 模拟加载
      dispatch({ type: 'floorplan/fetchOne/fulfilled', payload: analysis });
      setTabValue(0); // 切换到分析结果标签页
    }, 500);
  };

  // 处理拖放上传
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // 检查文件类型
      if (droppedFile.type.match('image.*')) {
        setFile(droppedFile);
        
        // 创建预览URL
        const previewUrl = URL.createObjectURL(droppedFile);
        setPreview(previewUrl);
        
        // 获取图片尺寸
        const img = new Image();
        img.onload = () => {
          setImageSize({
            width: img.width,
            height: img.height
          });
        };
        img.src = previewUrl;
        
        // 清除当前分析结果
        dispatch(clearCurrentAnalysis());
      }
    }
  };
  
  // 渲染上传区域
  const renderUploadArea = () => {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          border: '2px dashed #ccc',
          borderRadius: 2,
          cursor: 'pointer',
          mb: 4,
          backgroundColor: preview ? 'transparent' : '#f9f9f9'
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        
        {preview ? (
          <Box sx={{ position: 'relative' }}>
            <img
              src={preview}
              alt="户型图预览"
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                borderRadius: 8
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                color: 'white',
                opacity: 0,
                transition: 'opacity 0.3s',
                '&:hover': {
                  opacity: 1
                },
                borderRadius: 2
              }}
            >
              <Typography variant="h6">点击或拖拽更换图片</Typography>
            </Box>
            <Box sx={{ mt: 2, textAlign: 'left' }}>
              <Typography variant="body2" color="textSecondary">
                文件名: {file?.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                尺寸: {imageSize.width} x {imageSize.height} 像素
              </Typography>
            </Box>
          </Box>
        ) : (
          <>
            <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              点击或拖拽上传户型图
            </Typography>
            <Typography variant="body2" color="textSecondary">
              支持JPG、PNG格式，最大5MB
            </Typography>
          </>
        )}
      </Paper>
    );
  };
  
  // 渲染分析结果
  const renderAnalysisResult = () => {
    if (loading && !currentAnalysis) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            正在分析户型图...
          </Typography>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                上传进度: {uploadProgress}%
              </Typography>
            </Box>
          )}
        </Box>
      );
    }
    
    if (error) {
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      );
    }
    
    if (!currentAnalysis) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="textSecondary">
            上传户型图并点击"分析"按钮开始诊断
          </Typography>
        </Box>
      );
    }
    
    return (
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: 'primary.light', color: 'white' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h5" gutterBottom>
                户型诊断结果
              </Typography>
              <Typography variant="body1">
                总面积: <strong>{currentAnalysis.totalArea} 平方米</strong> | 
                房间数: <strong>{currentAnalysis.rooms.length}</strong> | 
                创建时间: <strong>{new Date(currentAnalysis.createdAt).toLocaleString()}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Chip 
                icon={<ScienceIcon />} 
                label="AI分析" 
                sx={{ 
                  bgcolor: 'white', 
                  color: 'primary.main',
                  fontWeight: 'bold',
                  mr: 1
                }} 
              />
              <Chip 
                icon={<ArchitectureIcon />} 
                label="专业诊断" 
                sx={{ 
                  bgcolor: 'white', 
                  color: 'primary.main',
                  fontWeight: 'bold'
                }} 
              />
            </Grid>
          </Grid>
        </Paper>
        
        <Grid container spacing={3}>
          {/* 户型图 */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                户型图
              </Typography>
              <Box
                component="img"
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${currentAnalysis.floorplanUrl}`}
                alt="户型图"
                sx={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  borderRadius: 1
                }}
              />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">
                  总面积: {currentAnalysis.totalArea} 平方米
                </Typography>
                <Tooltip title="此为AI识别结果，可能与实际面积有偏差">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          </Grid>
          
          {/* 问题分析 */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LightbulbIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  户型问题分析
                </Typography>
              </Box>
              
              {currentAnalysis.issues.length > 0 ? (
                <List>
                  {currentAnalysis.issues.map((issue) => (
                    <Box key={issue.key} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <WarningIcon color="warning" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1" fontWeight="bold">
                          {issue.name}
                        </Typography>
                      </Box>
                      <List dense>
                        {issue.tips.map((tip, index) => (
                          <ListItem key={index}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <ArrowForwardIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={tip} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="textSecondary">
                  未发现明显户型问题
                </Typography>
              )}
            </Paper>
          </Grid>
          
          {/* 房间分析 */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ApartmentIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                房间分析
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              {currentAnalysis.rooms.map((room) => (
                <Grid item xs={12} sm={6} md={4} key={room.type}>
                  <Card elevation={2}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <HomeIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">
                          {room.name} ({room.area}㎡)
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <List dense>
                        {room.tips.map((tip, index) => (
                          <ListItem key={index}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <CheckCircleIcon color="success" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={tip} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          
          {/* 总体建议 */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, mt: 2, bgcolor: '#f5f5f5' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LightbulbIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  总体建议
                </Typography>
              </Box>
              
              <List>
                {currentAnalysis.generalRecommendations.map((recommendation, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <ArrowForwardIcon color="primary" />
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
  
  // 渲染历史分析
  const renderHistoryAnalyses = () => {
    if (loading && analyses.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (analyses.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="textSecondary">
            暂无历史分析记录
          </Typography>
        </Box>
      );
    }
    
    return (
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {analyses.map((analysis) => (
          <Grid item xs={12} sm={6} md={4} key={analysis._id}>
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
              onClick={() => handleViewAnalysis(analysis)}
            >
              <Box
                sx={{
                  height: 160,
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <Box
                  component="img"
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${analysis.floorplanUrl}`}
                  alt="户型图"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderTopLeftRadius: 4
                  }}
                >
                  <Typography variant="body2">
                    {analysis.totalArea}㎡
                  </Typography>
                </Box>
              </Box>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  户型分析
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(analysis.createdAt).toLocaleString()}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  <Chip 
                    label={`${analysis.rooms.length}个房间`} 
                    size="small" 
                    variant="outlined"
                  />
                  {analysis.issues.length > 0 && (
                    <Chip 
                      label={`${analysis.issues.length}个问题`} 
                      size="small" 
                      color="warning" 
                      variant="outlined"
                    />
                  )}
                </Box>
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
          户型诊断
        </Typography>
        
        <Typography variant="body1" paragraph align="center">
          上传您的户型图，获取专业空间布局建议
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        {/* 标签页 */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="户型诊断标签页"
            centered
          >
            <Tab label={currentAnalysis ? "当前诊断" : "新建诊断"} />
            <Tab 
              label={
                <Badge badgeContent={analyses.length} color="primary" max={99}>
                  历史记录
                </Badge>
              } 
            />
          </Tabs>
        </Box>
        
        {/* 新建诊断标签页 */}
        {tabValue === 0 && (
          <Box>
            {!currentAnalysis && renderUploadArea()}
            
            {!currentAnalysis && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CloudUploadIcon />}
                  onClick={handleAnalyze}
                  disabled={!file || loading}
                >
                  开始分析
                </Button>
              </Box>
            )}
            
            {renderAnalysisResult()}
          </Box>
        )}
        
        {/* 历史记录标签页 */}
        {tabValue === 1 && renderHistoryAnalyses()}
      </Box>
    </Container>
  );
};

export default FloorplanPage; 