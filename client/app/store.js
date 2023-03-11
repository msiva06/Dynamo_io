import { configureStore } from "@reduxjs/toolkit";
import dependencySlice from "../features/dependencySlice";

const store = configureStore({
  reducer: {
    dependency: dependencySlice,
  },
});
export default store;
