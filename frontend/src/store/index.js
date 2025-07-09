import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './projectSlice';
import requirementReducer from './requirementSlice';
import quotationReducer from './quotationSlice';

export default configureStore({
  reducer: {
    projects: projectReducer,
    requirements: requirementReducer,
    quotations: quotationReducer,
  },
}); 