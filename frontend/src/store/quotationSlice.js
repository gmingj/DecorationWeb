import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const calculateQuotation = createAsyncThunk(
  'quotations/calculateQuotation',
  async (requirementId) => {
    const response = await axios.post('/api/pricing/calculate', { requirementId });
    return response.data;
  }
);

export const fetchQuotations = createAsyncThunk(
  'quotations/fetchQuotations',
  async (projectId) => {
    const response = await axios.get(`/api/pricing/project/${projectId}`);
    return response.data;
  }
);

export const fetchQuotation = createAsyncThunk(
  'quotations/fetchQuotation',
  async (quotationId) => {
    const response = await axios.get(`/api/pricing/${quotationId}`);
    return response.data;
  }
);

const quotationSlice = createSlice({
  name: 'quotations',
  initialState: {
    items: [],
    currentQuotation: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    setCurrentQuotation: (state, action) => {
      state.currentQuotation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculateQuotation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(calculateQuotation.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentQuotation = action.payload.quotation;
        // Add to items if not already there
        const exists = state.items.some(item => item._id === action.payload.quotation._id);
        if (!exists) {
          state.items.push(action.payload.quotation);
        }
      })
      .addCase(calculateQuotation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchQuotations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuotations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchQuotations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchQuotation.fulfilled, (state, action) => {
        state.currentQuotation = action.payload;
        // Update in items if exists
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      });
  },
});

export const { setCurrentQuotation } = quotationSlice.actions;

export default quotationSlice.reducer; 