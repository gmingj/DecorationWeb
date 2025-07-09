import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async () => {
    const response = await axios.get('/api/requirements');
    return response.data;
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData) => {
    const response = await axios.post('/api/requirements', projectData);
    return response.data;
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId) => {
    await axios.delete(`/api/requirements/${projectId}`);
    return projectId;
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    currentProject: null,
  },
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.currentProject = action.payload;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter(project => project._id !== action.payload);
        if (state.currentProject && state.currentProject._id === action.payload) {
          state.currentProject = null;
        }
      });
  },
});

export const { setCurrentProject } = projectSlice.actions;

export default projectSlice.reducer; 