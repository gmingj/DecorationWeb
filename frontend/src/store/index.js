import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './projectSlice';
import requirementReducer from './requirementSlice';
import quotationReducer from './quotationSlice';
import styleTestReducer from './styleTestSlice';
import floorplanReducer from './floorplanSlice';
import comparisonReducer from './comparisonSlice';

const store = configureStore({
  reducer: {
    project: projectReducer,
    requirement: requirementReducer,
    quotation: quotationReducer,
    styleTest: styleTestReducer,
    floorplan: floorplanReducer,
    comparison: comparisonReducer
  }
});

export default store; 