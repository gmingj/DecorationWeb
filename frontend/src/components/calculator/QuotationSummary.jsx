import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  LinearProgress,
  Paper,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const QuotationSummary = ({ quotation }) => {
  if (!quotation) return null;

  const { itemizedCosts, totalPrice } = quotation;
  
  // Prepare data for pie chart
  const data = [
    { name: '材料费用', value: itemizedCosts.materials },
    { name: '人工费用', value: itemizedCosts.labor },
    { name: '设计费用', value: itemizedCosts.design },
  ];
  
  if (itemizedCosts.other > 0) {
    data.push({ name: '其他费用', value: itemizedCosts.other });
  }

  // Format number to Chinese currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate percentages
  const getPercentage = (value) => {
    return ((value / totalPrice) * 100).toFixed(1);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {quotation.name}
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" color="primary" align="center" sx={{ fontWeight: 'bold', my: 2 }}>
          {formatCurrency(totalPrice)}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          总报价（包含材料费、人工费、设计费等）
        </Typography>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            费用明细
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">材料费用</Typography>
              <Typography variant="body2">{formatCurrency(itemizedCosts.materials)} ({getPercentage(itemizedCosts.materials)}%)</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={parseFloat(getPercentage(itemizedCosts.materials))} 
              sx={{ height: 8, borderRadius: 1, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: COLORS[0] } }}
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">人工费用</Typography>
              <Typography variant="body2">{formatCurrency(itemizedCosts.labor)} ({getPercentage(itemizedCosts.labor)}%)</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={parseFloat(getPercentage(itemizedCosts.labor))} 
              sx={{ height: 8, borderRadius: 1, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: COLORS[1] } }}
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">设计费用</Typography>
              <Typography variant="body2">{formatCurrency(itemizedCosts.design)} ({getPercentage(itemizedCosts.design)}%)</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={parseFloat(getPercentage(itemizedCosts.design))} 
              sx={{ height: 8, borderRadius: 1, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: COLORS[2] } }}
            />
          </Box>
          
          {itemizedCosts.other > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">其他费用</Typography>
                <Typography variant="body2">{formatCurrency(itemizedCosts.other)} ({getPercentage(itemizedCosts.other)}%)</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={parseFloat(getPercentage(itemizedCosts.other))} 
                sx={{ height: 8, borderRadius: 1, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: COLORS[3] } }}
              />
            </Box>
          )}
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            费用占比
          </Typography>
          <Box sx={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default QuotationSummary; 