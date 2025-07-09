import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              关于我们
            </Typography>
            <Typography variant="body2" color="text.secondary">
              装修工作室致力于提供高质量的装修服务，
              帮助客户打造理想的生活空间。
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              联系方式
            </Typography>
            <Typography variant="body2" color="text.secondary">
              电话: 123-456-7890
            </Typography>
            <Typography variant="body2" color="text.secondary">
              邮箱: contact@decorationweb.com
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              服务时间
            </Typography>
            <Typography variant="body2" color="text.secondary">
              周一至周五: 9:00 - 18:00
            </Typography>
            <Typography variant="body2" color="text.secondary">
              周六至周日: 10:00 - 16:00
            </Typography>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            <Link color="inherit" href="/">
              装修工作室
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 