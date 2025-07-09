import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { format } from 'date-fns';

const FormReview = ({ formData }) => {
  const formatDate = (date) => {
    if (!date) return '未设置';
    try {
      return format(new Date(date), 'yyyy-MM-dd');
    } catch (error) {
      return '日期格式错误';
    }
  };

  const formatList = (items) => {
    if (!items || items.length === 0) return '无';
    return items.join(', ');
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        需求确认
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        请确认以下信息是否准确，如需修改请返回相应步骤
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          基本信息
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">房屋面积</Typography>
            <Typography variant="body1">{formData.basicInfo.area || 0} 平方米</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">房型</Typography>
            <Typography variant="body1">{formData.basicInfo.roomType || '未设置'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">预算范围</Typography>
            <Typography variant="body1">
              {formData.basicInfo.budgetRange?.min || 0} - {formData.basicInfo.budgetRange?.max || 0} 元
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">期望完工时间</Typography>
            <Typography variant="body1">
              {formatDate(formData.basicInfo.expectedCompletionTime)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          风格偏好
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">装修风格</Typography>
            <Typography variant="body1">{formData.stylePreferences.style || '未设置'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">色彩倾向</Typography>
            <Typography variant="body1">{formData.stylePreferences.colorPreference || '未设置'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">参考图片</Typography>
            {formData.stylePreferences.referenceImages && formData.stylePreferences.referenceImages.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {formData.stylePreferences.referenceImages.map((image, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={image}
                    alt={`参考图片 ${index + 1}`}
                    sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body1">无参考图片</Typography>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          材料选择
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">地面材料</Typography>
            <Typography variant="body1">{formData.materialChoices.floorMaterial || '未设置'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">墙面材料</Typography>
            <Typography variant="body1">{formData.materialChoices.wallMaterial || '未设置'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">厨卫材料</Typography>
            <Typography variant="body1">{formData.materialChoices.kitchenBathroomMaterial || '未设置'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">门窗材料</Typography>
            <Typography variant="body1">{formData.materialChoices.doorWindowMaterial || '未设置'}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          功能需求
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">收纳需求</Typography>
            <Typography variant="body1">{formData.functionalRequirements.storageNeeds || '未设置'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">照明需求</Typography>
            <Typography variant="body1">{formData.functionalRequirements.lightingPreference || '未设置'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">智能家居需求</Typography>
            {formData.functionalRequirements.smartHomeNeeds && formData.functionalRequirements.smartHomeNeeds.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {formData.functionalRequirements.smartHomeNeeds.map((item) => (
                  <Chip key={item} label={item} size="small" />
                ))}
              </Box>
            ) : (
              <Typography variant="body1">无</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">特殊功能区</Typography>
            {formData.functionalRequirements.specialFunctionalAreas && formData.functionalRequirements.specialFunctionalAreas.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {formData.functionalRequirements.specialFunctionalAreas.map((item) => (
                  <Chip key={item} label={item} size="small" />
                ))}
              </Box>
            ) : (
              <Typography variant="body1">无</Typography>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          特殊需求
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="适老化/儿童友好设计"
                  secondary={formData.specialRequirements.elderlyChildFriendly ? '是' : '否'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="宠物友好设计"
                  secondary={formData.specialRequirements.petFriendly ? '是' : '否'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="环保材料需求"
                  secondary={formData.specialRequirements.ecoFriendly ? '是' : '否'}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">其他特殊要求</Typography>
            <Typography variant="body1">
              {formData.specialRequirements.otherSpecialRequirements || '无'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default FormReview; 