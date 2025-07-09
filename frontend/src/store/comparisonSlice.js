import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// 创建报价对比
export const createComparison = createAsyncThunk(
  'comparison/create',
  async ({ quotationIds, name }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/comparison`, { quotationIds, name });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 获取所有报价对比
export const fetchComparisons = createAsyncThunk(
  'comparison/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/comparison`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 获取特定报价对比
export const fetchComparison = createAsyncThunk(
  'comparison/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/comparison/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  comparisons: [],
  currentComparison: null,
  selectedQuotations: [],
  loading: false,
  error: null
};

const comparisonSlice = createSlice({
  name: 'comparison',
  initialState,
  reducers: {
    // 添加或移除选中的报价
    toggleSelectedQuotation: (state, action) => {
      const quotationId = action.payload;
      const index = state.selectedQuotations.indexOf(quotationId);
      
      if (index >= 0) {
        // 移除
        state.selectedQuotations.splice(index, 1);
      } else {
        // 添加
        state.selectedQuotations.push(quotationId);
      }
    },
    
    // 清空选中的报价
    clearSelectedQuotations: (state) => {
      state.selectedQuotations = [];
    },
    
    // 清空当前对比
    clearCurrentComparison: (state) => {
      state.currentComparison = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 创建对比
      .addCase(createComparison.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComparison.fulfilled, (state, action) => {
        state.loading = false;
        state.currentComparison = action.payload;
        state.comparisons.unshift(action.payload); // 添加到列表开头
        state.selectedQuotations = []; // 清空选中
      })
      .addCase(createComparison.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '创建报价对比失败';
      })
      
      // 获取所有对比
      .addCase(fetchComparisons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComparisons.fulfilled, (state, action) => {
        state.loading = false;
        state.comparisons = action.payload;
      })
      .addCase(fetchComparisons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '获取报价对比列表失败';
      })
      
      // 获取特定对比
      .addCase(fetchComparison.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComparison.fulfilled, (state, action) => {
        state.loading = false;
        state.currentComparison = action.payload;
      })
      .addCase(fetchComparison.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '获取报价对比详情失败';
      });
  }
});

export const {
  toggleSelectedQuotation,
  clearSelectedQuotations,
  clearCurrentComparison
} = comparisonSlice.actions;

export default comparisonSlice.reducer; 