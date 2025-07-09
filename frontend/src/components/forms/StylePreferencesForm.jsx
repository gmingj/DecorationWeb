import React from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Card,
  CardMedia,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Button,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

const styles = [
  {
    value: '现代简约',
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: '简洁、实用、线条简单流畅，色彩对比强烈',
  },
  {
    value: '北欧',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: '自然、舒适、实用，以白色为主色调，搭配木质元素',
  },
  {
    value: '中式',
    image: 'https://images.unsplash.com/photo-1545529468-42764ef8c85f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: '传统文化元素，讲究对称和层次感，色彩沉稳',
  },
  {
    value: '美式',
    image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: '自由、随意、舒适，混搭风格，自然材质',
  },
  {
    value: '工业风',
    image: 'https://images.unsplash.com/photo-1505912628658-bce4cc2d7797?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: '粗犷、原始、未完成感，裸露材质，如水泥、金属等',
  },
  {
    value: '其他',
    image: 'https://images.unsplash.com/photo-1618219944342-824e40a13285?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: '其他风格或混合风格',
  },
];

const colorPreferences = [
  '冷色调',
  '暖色调',
  '中性色调',
];

const StylePreferencesForm = ({ formData, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    // In a real app, we would upload these files to a server
    // For now, we'll just store the file names
    const fileNames = files.map(file => URL.createObjectURL(file));
    
    handleChange('referenceImages', [
      ...(formData.referenceImages || []),
      ...fileNames,
    ]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.referenceImages];
    updatedImages.splice(index, 1);
    handleChange('referenceImages', updatedImages);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        风格偏好
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        请选择您喜欢的装修风格和色彩倾向
      </Typography>

      <Box sx={{ mb: 4 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">装修风格</FormLabel>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {styles.map((style) => (
              <Grid item xs={12} sm={6} md={4} key={style.value}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    border: formData.style === style.value ? '2px solid' : 'none',
                    borderColor: 'primary.main',
                    height: '100%',
                  }}
                  onClick={() => handleChange('style', style.value)}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={style.image}
                    alt={style.value}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {style.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {style.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </FormControl>
      </Box>

      <Box sx={{ mb: 4 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">色彩倾向</FormLabel>
          <RadioGroup
            row
            value={formData.colorPreference || ''}
            onChange={(e) => handleChange('colorPreference', e.target.value)}
          >
            {colorPreferences.map((color) => (
              <FormControlLabel
                key={color}
                value={color}
                control={<Radio />}
                label={color}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>

      <Box sx={{ mb: 4 }}>
        <FormLabel component="legend">参考图片上传</FormLabel>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
          您可以上传喜欢的装修效果图作为参考
        </Typography>
        
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
        >
          上传图片
          <input
            type="file"
            hidden
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
        </Button>

        {formData.referenceImages && formData.referenceImages.length > 0 && (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {formData.referenceImages.map((image, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="100"
                    image={image}
                    alt={`参考图片 ${index + 1}`}
                  />
                  <CardContent sx={{ p: 1 }}>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemoveImage(index)}
                      fullWidth
                    >
                      删除
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default StylePreferencesForm; 