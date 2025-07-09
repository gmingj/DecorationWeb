import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchRequirement = createAsyncThunk(
  'requirements/fetchRequirement',
  async (requirementId) => {
    const response = await axios.get(`/api/requirements/${requirementId}`);
    return response.data;
  }
);

export const updateRequirement = createAsyncThunk(
  'requirements/updateRequirement',
  async ({ requirementId, requirementData }) => {
    const response = await axios.put(`/api/requirements/${requirementId}`, requirementData);
    return response.data;
  }
);

const requirementSlice = createSlice({
  name: 'requirements',
  initialState: {
    currentRequirement: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    formData: {
      basicInfo: {
        area: 0,
        roomType: '',
        budgetRange: { min: 0, max: 0 },
        expectedCompletionTime: null
      },
      stylePreferences: {
        style: '',
        colorPreference: '',
        referenceImages: []
      },
      materialChoices: {
        floorMaterial: '',
        wallMaterial: '',
        kitchenBathroomMaterial: '',
        doorWindowMaterial: ''
      },
      functionalRequirements: {
        storageNeeds: '',
        lightingPreference: '',
        smartHomeNeeds: [],
        specialFunctionalAreas: []
      },
      specialRequirements: {
        elderlyChildFriendly: false,
        petFriendly: false,
        ecoFriendly: false,
        otherSpecialRequirements: ''
      }
    }
  },
  reducers: {
    updateFormData: (state, action) => {
      // Update specific section of form data
      const { section, data } = action.payload;
      state.formData[section] = { ...state.formData[section], ...data };
    },
    resetForm: (state) => {
      state.formData = {
        basicInfo: {
          area: 0,
          roomType: '',
          budgetRange: { min: 0, max: 0 },
          expectedCompletionTime: null
        },
        stylePreferences: {
          style: '',
          colorPreference: '',
          referenceImages: []
        },
        materialChoices: {
          floorMaterial: '',
          wallMaterial: '',
          kitchenBathroomMaterial: '',
          doorWindowMaterial: ''
        },
        functionalRequirements: {
          storageNeeds: '',
          lightingPreference: '',
          smartHomeNeeds: [],
          specialFunctionalAreas: []
        },
        specialRequirements: {
          elderlyChildFriendly: false,
          petFriendly: false,
          ecoFriendly: false,
          otherSpecialRequirements: ''
        }
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequirement.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRequirement.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentRequirement = action.payload;
        // Also update form data with current requirement
        if (action.payload.requirements && action.payload.requirements.length > 0) {
          const req = action.payload.requirements[0];
          state.formData = {
            basicInfo: req.basicInfo || state.formData.basicInfo,
            stylePreferences: req.stylePreferences || state.formData.stylePreferences,
            materialChoices: req.materialChoices || state.formData.materialChoices,
            functionalRequirements: req.functionalRequirements || state.formData.functionalRequirements,
            specialRequirements: req.specialRequirements || state.formData.specialRequirements
          };
        }
      })
      .addCase(fetchRequirement.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateRequirement.fulfilled, (state, action) => {
        state.currentRequirement = action.payload;
      });
  },
});

export const { updateFormData, resetForm } = requirementSlice.actions;

export default requirementSlice.reducer; 