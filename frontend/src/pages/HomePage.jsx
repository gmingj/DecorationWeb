import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Divider,
  Paper
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Calculate as CalculateIcon,
  Style as StyleIcon,
  Dashboard as DashboardIcon,
  Compare as CompareIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

const features = [
  {
    title: '需求收集',
    description: '通过详细的表单收集您的装修需求，包括风格偏好、材料选择、功能需求等',
    icon: <AssignmentIcon fontSize="large" color="primary" />,
    path: '/requirements',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&h=400',
    primary: true
  },
  {
    title: '价格计算器',
    description: '根据您的需求和选择，自动计算装修预算，提供详细的成本明细',
    icon: <CalculateIcon fontSize="large" color="primary" />,
    path: '/calculator',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&h=400'
  },
  {
    title: '风格测试',
    description: '通过简单的问卷测试，发现您的装修风格偏好，获取个性化风格推荐',
    icon: <StyleIcon fontSize="large" color="primary" />,
    path: '/style-test',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=600&h=400'
  },
  {
    title: '户型诊断',
    description: '上传您的户型图，获取专业空间布局建议和优化方案',
    icon: <DashboardIcon fontSize="large" color="primary" />,
    path: '/floorplan',
    image: 'https://images.unsplash.com/photo-1574691250077-03732c9a7c95?auto=format&fit=crop&w=600&h=400'
  },
  {
    title: '报价对比',
    description: '对比不同装修方案的报价，分析价格差异，找出最适合您的选择',
    icon: <CompareIcon fontSize="large" color="primary" />,
    path: '/comparison',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&h=400'
  }
];

const HomePage = () => {
  return (
    <Box>
      {/* 英雄区 */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          borderRadius: { xs: 0, sm: 2 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            align="center"
            sx={{ fontWeight: 'bold' }}
          >
            装修工作室
          </Typography>
          <Typography variant="h5" paragraph align="center">
            一站式装修服务平台，从需求收集到智能设计分析
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={RouterLink}
              to="/requirements"
              sx={{ px: 4, py: 1.5 }}
              endIcon={<ArrowForwardIcon />}
            >
              开始您的装修计划
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 功能特性 */}
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          我们的服务
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  },
                  border: feature.primary ? '2px solid' : 'none',
                  borderColor: feature.primary ? 'secondary.main' : 'transparent'
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={feature.image}
                  alt={feature.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {feature.icon}
                    <Typography variant="h5" component="h3" sx={{ ml: 1 }}>
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color={feature.primary ? "secondary" : "primary"}
                    component={RouterLink}
                    to={feature.path}
                    variant={feature.primary ? "contained" : "text"}
                    fullWidth
                  >
                    {feature.primary ? "开始装修计划" : "了解详情"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* 关于我们 */}
        <Box sx={{ my: 8 }}>
          <Divider sx={{ mb: 6 }} />
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom>
                关于我们
              </Typography>
              <Typography variant="body1" paragraph>
                装修工作室是一个专注于提供智能化装修解决方案的平台。我们结合了传统装修服务与现代技术，为客户提供从需求收集、风格测试到价格计算的一站式服务。
              </Typography>
              <Typography variant="body1" paragraph>
                我们的目标是简化装修流程，让每个人都能轻松实现理想的居住空间。通过智能化工具和专业的设计建议，我们帮助客户做出更明智的装修决策。
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/requirements"
                sx={{ mt: 2 }}
                endIcon={<ArrowForwardIcon />}
              >
                了解我们的服务流程
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={4}
                sx={{
                  height: 300,
                  backgroundImage: 'url(https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=800)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 2
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage; 
