import React from 'react';
import {
  Box,
  Grid,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Chip,
  TextField,
  Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const storageNeeds = ['高', '中', '低'];
const lightingPreferences = ['自然光', '人工光', '混合'];
const smartHomeOptions = [
  '智能照明',
  '智能安防',
  '智能门锁',
  '智能窗帘',
  '智能音响',
  '智能家电',
  '智能温控',
];
const functionalAreaOptions = [
  '书房',
  '健身区',
  '影音区',
  '儿童游戏区',
  '阳台花园',
  '储物间',
  '衣帽间',
];

const FunctionalRequirementsForm = ({ formData, onChange }) => {
  const [customArea, setCustomArea] = React.useState('');

  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const handleCheckboxChange = (field, value) => {
    const currentValues = formData[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
    
    handleChange(field, newValues);
  };

  const handleAddCustomArea = () => {
    if (customArea.trim() !== '') {
      const currentAreas = formData.specialFunctionalAreas || [];
      if (!currentAreas.includes(customArea)) {
        handleChange('specialFunctionalAreas', [...currentAreas, customArea]);
      }
      setCustomArea('');
    }
  };

  const handleRemoveArea = (area) => {
    const currentAreas = formData.specialFunctionalAreas || [];
    handleChange(
      'specialFunctionalAreas',
      currentAreas.filter((item) => item !== area)
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        功能需求
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        请选择您对房屋功能的需求
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <FormControl component="fieldset">
            <FormLabel component="legend">收纳需求</FormLabel>
            <RadioGroup
              value={formData.storageNeeds || ''}
              onChange={(e) => handleChange('storageNeeds', e.target.value)}
            >
              {storageNeeds.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl component="fieldset">
            <FormLabel component="legend">照明需求</FormLabel>
            <RadioGroup
              value={formData.lightingPreference || ''}
              onChange={(e) => handleChange('lightingPreference', e.target.value)}
            >
              {lightingPreferences.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">智能家居需求</FormLabel>
            <FormGroup row>
              {smartHomeOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={(formData.smartHomeNeeds || []).includes(option)}
                      onChange={() => handleCheckboxChange('smartHomeNeeds', option)}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">特殊功能区</FormLabel>
            <FormGroup row>
              {functionalAreaOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={(formData.specialFunctionalAreas || []).includes(option)}
                      onChange={() => handleCheckboxChange('specialFunctionalAreas', option)}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>

            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <TextField
                label="添加自定义功能区"
                variant="outlined"
                size="small"
                value={customArea}
                onChange={(e) => setCustomArea(e.target.value)}
                sx={{ mr: 1 }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddCustomArea}
                disabled={!customArea.trim()}
              >
                添加
              </Button>
            </Box>

            {formData.specialFunctionalAreas && formData.specialFunctionalAreas.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.specialFunctionalAreas
                  .filter((area) => !functionalAreaOptions.includes(area))
                  .map((area) => (
                    <Chip
                      key={area}
                      label={area}
                      onDelete={() => handleRemoveArea(area)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
              </Box>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FunctionalRequirementsForm; 