import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { Download as DownloadIcon, Print as PrintIcon } from '@mui/icons-material';

const QuotationDetails = ({ quotation }) => {
  if (!quotation) return null;

  // Format number to Chinese currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format number with 2 decimal places
  const formatNumber = (value) => {
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle download (in a real app, this would generate a PDF)
  const handleDownload = () => {
    alert('在实际应用中，这里会生成一个PDF报价单供下载');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">详细报价明细</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{ mr: 1 }}
            size="small"
          >
            打印
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            size="small"
          >
            下载PDF
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="报价明细表">
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white' }}>项目</TableCell>
              <TableCell sx={{ color: 'white' }}>描述</TableCell>
              <TableCell align="right" sx={{ color: 'white' }}>单价</TableCell>
              <TableCell align="right" sx={{ color: 'white' }}>数量</TableCell>
              <TableCell align="right" sx={{ color: 'white' }}>金额</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotation.details.map((detail, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {detail.item}
                </TableCell>
                <TableCell>{detail.description}</TableCell>
                <TableCell align="right">{formatCurrency(detail.unitPrice)}</TableCell>
                <TableCell align="right">{formatNumber(detail.quantity)}</TableCell>
                <TableCell align="right">{formatCurrency(detail.total)}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold' }}>
                总计
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(quotation.totalPrice)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          注意：此报价单仅供参考，实际价格可能会根据现场情况、材料价格波动等因素有所调整。
          报价有效期为30天。详细条款请咨询客服。
        </Typography>
      </Box>
    </Box>
  );
};

export default QuotationDetails; 