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
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';

const materials = {
  floorMaterial: [
    {
      value: '木地板',
      image: 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: '温暖舒适，适合卧室、客厅等区域',
    },
    {
      value: '瓷砖',
      image: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: '耐磨易清洁，适合厨房、卫生间等区域',
    },
    {
      value: '大理石',
      image: 'https://images.unsplash.com/photo-1597975371270-cf70411f792a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: '高档奢华，适合入户、客厅等区域',
    },
    {
      value: '其他',
      image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: '其他地面材料',
    },
  ],
  wallMaterial: [
    {
      value: '乳胶漆',
      image: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: '经济实用，色彩丰富，易于更换',
    },
    {
      value: '壁纸',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: '图案丰富，可增加空间层次感',
    },
    {
      value: '硅藻泥',
      image: 'https://images.unsplash.com/photo-1617975178760-4c7d8e3dd3d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: '环保健康，具有调节湿度、净化空气的功能',
    },
    {
      value: '其他',
      image: 'https://images.unsplash.com/photo-1618219944342-824e40a13285?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: '其他墙面材料',
    },
  ],
  kitchenBathroomMaterial: [
    {
      value: '普通台面',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: '经济实用，种类多样',
    },
    {
      value: '石英石台面',
      image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: '耐磨耐高温，不易渗透污渍',
    },
    {
      value: '大理石台面',
      image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: '美观大方，质感好，但需要定期保养',
    },
    {
      value: '其他',
      image: 'https://images.unsplash.com/photo-1556911073-38141963c9e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: '其他台面材料',
    },
  ],
  doorWindowMaterial: [
    {
      value: '实木门',
      image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: '质感好，隔音效果好，但价格较高',
    },
    {
      value: '复合门',
      image: 'https://images.unsplash.com/photo-1508022713622-df2d8fb7b4cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: '价格适中，款式多样',
    },
    {
      value: '铝合金门窗',
      image: 'https://images.unsplash.com/photo-1583073600538-f219abfb20bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: '轻便耐用，适合阳台等区域',
    },
    {
      value: '其他',
      image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: '其他门窗材料',
    },
  ],
};

const MaterialChoicesForm = ({ formData, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        材料选择
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        请选择您偏好的装修材料
      </Typography>

      {Object.entries(materials).map(([materialType, options]) => (
        <Box key={materialType} sx={{ mb: 4 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">
              {materialType === 'floorMaterial' && '地面材料'}
              {materialType === 'wallMaterial' && '墙面材料'}
              {materialType === 'kitchenBathroomMaterial' && '厨卫材料'}
              {materialType === 'doorWindowMaterial' && '门窗材料'}
            </FormLabel>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {options.map((material) => (
                <Grid item xs={12} sm={6} md={3} key={material.value}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: formData[materialType] === material.value ? '2px solid' : 'none',
                      borderColor: 'primary.main',
                      height: '100%',
                    }}
                    onClick={() => handleChange(materialType, material.value)}
                  >
                    <CardMedia
                      component="img"
                      height="120"
                      image={material.image}
                      alt={material.value}
                    />
                    <CardContent>
                      <Typography variant="subtitle1" component="div">
                        {material.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {material.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </FormControl>
        </Box>
      ))}
    </Box>
  );
};

export default MaterialChoicesForm; 