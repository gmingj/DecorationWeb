import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
} from '@mui/material';
import { fetchProjects } from '../store/projectSlice';
import { calculateQuotation } from '../store/quotationSlice';
import ProjectSelector from '../components/calculator/ProjectSelector';
import QuotationSummary from '../components/calculator/QuotationSummary';
import QuotationDetails from '../components/calculator/QuotationDetails';

const PriceCalculatorPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedRequirementId, setSelectedRequirementId] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  const { items: projects, status: projectsStatus } = useSelector((state) => state.projects);
  const { currentQuotation, status: quotationStatus } = useSelector((state) => state.quotations);

  // Load projects on mount
  useEffect(() => {
    if (projectsStatus === 'idle') {
      dispatch(fetchProjects());
    }
  }, [dispatch, projectsStatus]);

  // Set selected project from location state if available
  useEffect(() => {
    if (location.state?.projectId && location.state?.requirementId) {
      setSelectedProjectId(location.state.projectId);
      setSelectedRequirementId(location.state.requirementId);
    }
  }, [location.state]);

  const handleProjectSelect = (projectId, requirementId) => {
    setSelectedProjectId(projectId);
    setSelectedRequirementId(requirementId);
  };

  const handleCalculate = async () => {
    if (!selectedRequirementId) {
      setError('请先选择一个项目');
      return;
    }

    setError('');
    setIsCalculating(true);
    try {
      await dispatch(calculateQuotation(selectedRequirementId));
    } catch (error) {
      setError('计算报价时出错，请重试');
      console.error('计算报价失败:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const isLoading = projectsStatus === 'loading' || quotationStatus === 'loading' || isCalculating;

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: { xs: 2, md: 3 }, my: { xs: 3, md: 6 } }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          装修价格计算器
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          根据您的需求自动计算装修预算，提供透明的价格明细
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  选择项目
                </Typography>
                <ProjectSelector
                  projects={projects}
                  isLoading={projectsStatus === 'loading'}
                  selectedProjectId={selectedProjectId}
                  onSelect={handleProjectSelect}
                />
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCalculate}
                    disabled={!selectedRequirementId || isCalculating}
                    fullWidth
                  >
                    {isCalculating ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 1 }} />
                        计算中...
                      </>
                    ) : (
                      '计算报价'
                    )}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : currentQuotation ? (
              <Box>
                <QuotationSummary quotation={currentQuotation} />
                <Divider sx={{ my: 3 }} />
                <QuotationDetails quotation={currentQuotation} />
              </Box>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  请选择一个项目并点击"计算报价"按钮
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PriceCalculatorPage; 