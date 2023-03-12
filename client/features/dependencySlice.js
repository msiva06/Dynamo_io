import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDependencyAsync = createAsyncThunk(
  "dependency",
  async (pkgName) => {
    try {
      const { data, status } = await axios.get("/api/project", {
        params: { pkgName },
      });
      return data;
    } catch (err) {
      throw new Error(`Requested Package :${pkgName} not found in npm`);
    }
  }
);

const initialState = {};
export const dependencySlice = createSlice({
  name: "dependency",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDependencyAsync.fulfilled, (state, action) => {
        //console.log("Payload:", action.payload);
        return action.payload;
      })
      .addCase(fetchDependencyAsync.rejected, (state, action) => {
        return action.error;
      });
  },
});

export const selectDependency = (state) => state.dependency;

export default dependencySlice.reducer;
