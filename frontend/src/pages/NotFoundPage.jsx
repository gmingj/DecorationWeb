import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" color="primary" sx={{ fontSize: '8rem', fontWeight: 'bold' }}>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          页面未找到
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          抱歉，您请求的页面不存在或已被移动。
        </Typography>
        <Button variant="contained" component={RouterLink} to="/" sx={{ mt: 3 }}>
          返回首页
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage; 