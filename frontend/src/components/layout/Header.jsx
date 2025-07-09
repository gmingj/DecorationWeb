import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useMediaQuery,
  useTheme,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Assignment as AssignmentIcon,
  Calculate as CalculateIcon,
  Style as StyleIcon,
  Dashboard as DashboardIcon,
  Compare as CompareIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

const Header = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // 主要导航项
  const mainNavItems = [
    { name: '首页', path: '/', icon: <HomeIcon /> },
    { name: '需求收集', path: '/requirements', icon: <AssignmentIcon />, primary: true },
  ];
  
  // 工具导航项
  const toolNavItems = [
    { name: '风格测试', path: '/style-test', icon: <StyleIcon /> },
    { name: '户型诊断', path: '/floorplan', icon: <DashboardIcon /> },
    { name: '价格计算', path: '/calculator', icon: <CalculateIcon /> },
    { name: '报价对比', path: '/comparison', icon: <CompareIcon /> }
  ];
  
  // 所有导航项（用于移动端菜单）
  const allNavItems = [...mainNavItems, ...toolNavItems];
  
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // 移动端侧边菜单
  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          装修工作室
        </Typography>
      </Box>
      <Divider />
      <List>
        {allNavItems.map((item) => (
          <ListItem
            button
            component={RouterLink}
            to={item.path}
            key={item.name}
            selected={isActive(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
            {item.primary && (
              <Chip 
                size="small" 
                color="secondary" 
                label="推荐" 
                sx={{ ml: 1 }} 
              />
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
  
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            装修工作室
          </Typography>
          
          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', flexGrow: 1, ml: 2 }}>
                {mainNavItems.map((item) => (
                  <Button
                    key={item.name}
                    component={RouterLink}
                    to={item.path}
                    color={isActive(item.path) ? 'primary' : 'inherit'}
                    sx={{ mr: 1 }}
                    startIcon={item.icon}
                    variant={item.primary ? "contained" : "text"}
                  >
                    {item.name}
                  </Button>
                ))}
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {toolNavItems.map((item) => (
                  <Button
                    key={item.name}
                    component={RouterLink}
                    to={item.path}
                    color={isActive(item.path) ? 'primary' : 'inherit'}
                    sx={{ mx: 0.5 }}
                    size="small"
                  >
                    {item.name}
                  </Button>
                ))}
              </Box>
            </>
          )}
          
          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' }, ml: 2 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              component={RouterLink}
              to="/requirements"
              endIcon={<ArrowForwardIcon />}
            >
              开始装修
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 