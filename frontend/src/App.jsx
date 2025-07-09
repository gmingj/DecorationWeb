import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page components
import HomePage from './pages/HomePage';
import RequirementFormPage from './pages/RequirementFormPage';
import PriceCalculatorPage from './pages/PriceCalculatorPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/requirements" element={<RequirementFormPage />} />
          <Route path="/calculator" element={<PriceCalculatorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
};

export default App; 