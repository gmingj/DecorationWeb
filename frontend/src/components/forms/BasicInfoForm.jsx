import React from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
  InputAdornment,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const roomTypes = [
  '一室一厅',
  '两室一厅',
  '两室两厅',
  '三室一厅',
  '三室两厅',
  '四室两厅',
  '复式',
  '别墅',
  '其他',
];

const BasicInfoForm = ({ formData, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const handleBudgetChange = (field, value) => {
    onChange({
      ...formData,
      budgetRange: {
        ...formData.budgetRange,
        [field]: value,
      },
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        基本信息
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        请填写您的房屋基本信息，帮助我们了解装修需求
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="房屋面积"
            type="number"
            value={formData.area || ''}
            onChange={(e) => handleChange('area', Number(e.target.value))}
            InputProps={{
              endAdornment: <InputAdornment position="end">平方米</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            select
            label="房型"
            value={formData.roomType || ''}
            onChange={(e) => handleChange('roomType', e.target.value)}
          >
            {roomTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="预算范围（最低）"
            type="number"
            value={formData.budgetRange?.min || ''}
            onChange={(e) => handleBudgetChange('min', Number(e.target.value))}
            InputProps={{
              endAdornment: <InputAdornment position="end">元</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="预算范围（最高）"
            type="number"
            value={formData.budgetRange?.max || ''}
            onChange={(e) => handleBudgetChange('max', Number(e.target.value))}
            InputProps={{
              endAdornment: <InputAdornment position="end">元</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="期望完工时间"
              value={formData.expectedCompletionTime || null}
              onChange={(date) => handleChange('expectedCompletionTime', date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BasicInfoForm; 