import React from 'react';
import {
  Box,
  Grid,
  Typography,
  FormControlLabel,
  Switch,
  TextField,
  Paper,
} from '@mui/material';

const SpecialRequirementsForm = ({ formData, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const handleSwitchChange = (field) => (event) => {
    handleChange(field, event.target.checked);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        特殊需求
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        请告诉我们您是否有以下特殊需求
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.elderlyChildFriendly || false}
                      onChange={handleSwitchChange('elderlyChildFriendly')}
                      color="primary"
                    />
                  }
                  label="适老化/儿童友好设计"
                />
                {formData.elderlyChildFriendly && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    我们将考虑安全扶手、防滑地面、圆角设计等适老化和儿童友好的设计元素。
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.petFriendly || false}
                      onChange={handleSwitchChange('petFriendly')}
                      color="primary"
                    />
                  }
                  label="宠物友好设计"
                />
                {formData.petFriendly && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    我们将考虑宠物活动空间、易清洁材料、宠物专用设施等设计元素。
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.ecoFriendly || false}
                      onChange={handleSwitchChange('ecoFriendly')}
                      color="primary"
                    />
                  }
                  label="环保材料需求"
                />
                {formData.ecoFriendly && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    我们将优先选用环保认证材料，减少有害物质，提高室内空气质量。
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="其他特殊要求"
            placeholder="请详细描述您的其他特殊需求，例如：过敏考虑、特殊空间需求、特定材料偏好等..."
            value={formData.otherSpecialRequirements || ''}
            onChange={(e) => handleChange('otherSpecialRequirements', e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SpecialRequirementsForm; 