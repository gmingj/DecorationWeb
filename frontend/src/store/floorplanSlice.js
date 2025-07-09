import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// 上传并分析户型图
export const analyzeFloorplan = createAsyncThunk(
  'floorplan/analyze',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/floorplan/analyze`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 获取所有户型分析
export const fetchFloorplanAnalyses = createAsyncThunk(
  'floorplan/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/floorplan`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 获取特定户型分析
export const fetchFloorplanAnalysis = createAsyncThunk(
  'floorplan/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/floorplan/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  analyses: [],
  currentAnalysis: null,
  loading: false,
  error: null,
  uploadProgress: 0
};

const floorplanSlice = createSlice({
  name: 'floorplan',
  initialState,
  reducers: {
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    clearCurrentAnalysis: (state) => {
      state.currentAnalysis = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 分析户型图
      .addCase(analyzeFloorplan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(analyzeFloorplan.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAnalysis = action.payload;
        state.analyses.unshift(action.payload); // 添加到列表开头
        state.uploadProgress = 100;
      })
      .addCase(analyzeFloorplan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '户型分析失败';
        state.uploadProgress = 0;
      })
      
      // 获取所有分析
      .addCase(fetchFloorplanAnalyses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFloorplanAnalyses.fulfilled, (state, action) => {
        state.loading = false;
        state.analyses = action.payload;
      })
      .addCase(fetchFloorplanAnalyses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '获取户型分析列表失败';
      })
      
      // 获取特定分析
      .addCase(fetchFloorplanAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFloorplanAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAnalysis = action.payload;
      })
      .addCase(fetchFloorplanAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '获取户型分析详情失败';
      });
  }
});

export const { setUploadProgress, clearCurrentAnalysis } = floorplanSlice.actions;

export default floorplanSlice.reducer; 