import { configureStore } from "@reduxjs/toolkit";
import dependencySlice from "../features/dependencySlice";
import generateProjSlice from "../features/generateProjSlice";

const store = configureStore({
  reducer: {
    dependency: dependencySlice,
    project: generateProjSlice,
  },
});
export default store;
