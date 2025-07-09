import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// 获取风格测试问题
export const fetchStyleQuestions = createAsyncThunk(
  'styleTest/fetchQuestions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/style-test/questions`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 提交风格测试答案并获取分析结果
export const submitStyleAnswers = createAsyncThunk(
  'styleTest/submitAnswers',
  async (answers, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/style-test/analyze`, { answers });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 获取历史风格报告
export const fetchStyleReports = createAsyncThunk(
  'styleTest/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/style-test`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 获取特定风格报告
export const fetchStyleReport = createAsyncThunk(
  'styleTest/fetchReport',
  async (reportId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/style-test/${reportId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  questions: [],
  answers: [],
  report: null,
  reports: [],
  loading: false,
  error: null
};

const styleTestSlice = createSlice({
  name: 'styleTest',
  initialState,
  reducers: {
    // 添加或更新答案
    updateAnswer: (state, action) => {
      const { questionId, optionId } = action.payload;
      
      // 查找是否已存在该问题的答案
      const existingAnswerIndex = state.answers.findIndex(
        answer => answer.questionId === questionId
      );
      
      if (existingAnswerIndex >= 0) {
        // 更新已有答案
        state.answers[existingAnswerIndex].optionId = optionId;
      } else {
        // 添加新答案
        state.answers.push({ questionId, optionId });
      }
    },
    
    // 清空答案
    clearAnswers: (state) => {
      state.answers = [];
      state.report = null;
    },
    
    // 清空报告
    clearReport: (state) => {
      state.report = null;
    },
    
    // 设置当前报告
    setCurrentReport: (state, action) => {
      state.report = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取问题
      .addCase(fetchStyleQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStyleQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchStyleQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '获取风格测试问题失败';
      })
      
      // 提交答案
      .addCase(submitStyleAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitStyleAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
        // 添加到历史报告中
        if (!state.reports.find(r => r._id === action.payload._id)) {
          state.reports.unshift(action.payload);
        }
      })
      .addCase(submitStyleAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '提交风格测试答案失败';
      })
      
      // 获取历史报告
      .addCase(fetchStyleReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStyleReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchStyleReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '获取历史风格报告失败';
      })
      
      // 获取特定报告
      .addCase(fetchStyleReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStyleReport.fulfilled, (state, action) => {
        state.loading = false;
        // 如果报告不在历史列表中，添加它
        if (!state.reports.find(r => r._id === action.payload._id)) {
          state.reports.push(action.payload);
        }
      })
      .addCase(fetchStyleReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '获取风格报告失败';
      });
  }
});

export const { updateAnswer, clearAnswers, clearReport, setCurrentReport } = styleTestSlice.actions;

export default styleTestSlice.reducer; 