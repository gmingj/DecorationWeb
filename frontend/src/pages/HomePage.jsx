import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  Paper,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Calculate as CalculateIcon,
  Compare as CompareIcon,
} from '@mui/icons-material';

const features = [
  {
    title: '需求收集',
    description: '详细收集您的装修需求，包括风格偏好、材料选择和特殊要求，帮助我们更好地了解您的期望。',
    icon: <AssignmentIcon sx={{ fontSize: 60 }} color="primary" />,
    link: '/requirements',
  },
  {
    title: '价格计算器',
    description: '根据您的需求和选择，自动计算装修预算，提供透明的价格明细，帮助您做出明智的决策。',
    icon: <CalculateIcon sx={{ fontSize: 60 }} color="primary" />,
    link: '/calculator',
  },
  {
    title: '方案对比',
    description: '对比不同装修方案的成本和效果，找到最适合您预算和需求的解决方案。',
    icon: <CompareIcon sx={{ fontSize: 60 }} color="primary" />,
    link: '/comparison',
  },
];

const styles = [
  {
    title: '现代简约',
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    title: '北欧风格',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    title: '中式风格',
    image: 'https://images.unsplash.com/photo-1545529468-42764ef8c85f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    title: '美式风格',
    image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
];

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)`,
          height: '500px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.4)',
          }}
        />
        <Container maxWidth="lg">
          <Box sx={{ position: 'relative', p: { xs: 3, md: 6 } }}>
            <Typography
              component="h1"
              variant="h2"
              color="inherit"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              打造理想家居空间
            </Typography>
            <Typography variant="h5" color="inherit" paragraph>
              我们提供专业的装修设计和施工服务，帮助您实现梦想中的家居环境。
              从需求收集到价格计算，我们的一站式服务让装修变得简单。
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to="/requirements"
              sx={{ mt: 3 }}
            >
              开始您的装修计划
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h3" align="center" gutterBottom>
          我们的服务
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          一站式装修服务平台，满足您的各种装修需求
        </Typography>
        <Grid container spacing={4} sx={{ mt: 3 }}>
          {features.map((feature) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea component={RouterLink} to={feature.link}>
                  <Box
                    sx={{
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2" align="center">
                      {feature.title}
                    </Typography>
                    <Typography align="center">{feature.description}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Styles Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom>
            装修风格
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            探索不同的装修风格，找到适合您的设计灵感
          </Typography>
          <Grid container spacing={4} sx={{ mt: 3 }}>
            {styles.map((style) => (
              <Grid item key={style.title} xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="200"
                      image={style.image}
                      alt={style.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2" align="center">
                        {style.title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              size="large"
              component={RouterLink}
              to="/requirements"
            >
              开始风格测试
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ my: 6 }}>
        <Paper
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'primary.main',
            color: 'white',
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            准备好开始您的装修项目了吗？
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            填写我们的需求表单，获取免费报价和专业建议。
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={RouterLink}
            to="/requirements"
          >
            立即开始
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage; 