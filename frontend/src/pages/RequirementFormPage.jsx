import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
} from '@mui/material';
import { createProject } from '../store/projectSlice';
import { updateFormData, resetForm } from '../store/requirementSlice';

// Form step components
import BasicInfoForm from '../components/forms/BasicInfoForm';
import StylePreferencesForm from '../components/forms/StylePreferencesForm';
import MaterialChoicesForm from '../components/forms/MaterialChoicesForm';
import FunctionalRequirementsForm from '../components/forms/FunctionalRequirementsForm';
import SpecialRequirementsForm from '../components/forms/SpecialRequirementsForm';
import FormReview from '../components/forms/FormReview';

const steps = [
  '基本信息',
  '风格偏好',
  '材料选择',
  '功能需求',
  '特殊需求',
  '确认提交',
];

const RequirementFormPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formData = useSelector((state) => state.requirements.formData);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    dispatch(resetForm());
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Prepare project data
      const projectData = {
        projectName: '新装修项目',
        projectDescription: `${formData.basicInfo.area}平米 ${formData.basicInfo.roomType} 装修`,
        ...formData,
      };

      // Dispatch action to create project
      const resultAction = await dispatch(createProject(projectData));
      if (createProject.fulfilled.match(resultAction)) {
        // Navigate to calculator page with the new project
        navigate('/calculator', { 
          state: { 
            projectId: resultAction.payload.project._id,
            requirementId: resultAction.payload.requirement._id
          } 
        });
      }
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (section, data) => {
    dispatch(updateFormData({ section, data }));
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BasicInfoForm
            formData={formData.basicInfo}
            onChange={(data) => handleFormChange('basicInfo', data)}
          />
        );
      case 1:
        return (
          <StylePreferencesForm
            formData={formData.stylePreferences}
            onChange={(data) => handleFormChange('stylePreferences', data)}
          />
        );
      case 2:
        return (
          <MaterialChoicesForm
            formData={formData.materialChoices}
            onChange={(data) => handleFormChange('materialChoices', data)}
          />
        );
      case 3:
        return (
          <FunctionalRequirementsForm
            formData={formData.functionalRequirements}
            onChange={(data) => handleFormChange('functionalRequirements', data)}
          />
        );
      case 4:
        return (
          <SpecialRequirementsForm
            formData={formData.specialRequirements}
            onChange={(data) => handleFormChange('specialRequirements', data)}
          />
        );
      case 5:
        return <FormReview formData={formData} />;
      default:
        return '未知步骤';
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: { xs: 2, md: 3 }, my: { xs: 3, md: 6 } }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          装修需求收集表单
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          请填写以下表单，帮助我们了解您的装修需求
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === steps.length ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              需求提交成功！
            </Typography>
            <Typography variant="subtitle1">
              我们已收到您的装修需求，接下来您可以使用价格计算器获取报价。
            </Typography>
            <Button
              variant="contained"
              onClick={handleReset}
              sx={{ mt: 3, ml: 1 }}
            >
              创建新需求
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/calculator')}
              sx={{ mt: 3, ml: 1 }}
            >
              前往价格计算器
            </Button>
          </Box>
        ) : (
          <>
            {getStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  上一步
                </Button>
              )}
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      提交中...
                    </>
                  ) : (
                    '提交需求'
                  )}
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleNext}>
                  下一步
                </Button>
              )}
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default RequirementFormPage; 