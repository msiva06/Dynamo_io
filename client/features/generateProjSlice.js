import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const generateProjAsync = createAsyncThunk(
  "generateProj",
  async (reqbody) => {
    try {
      const { data, status } = await axios.post("/api/project", reqbody);
      console.log("Data and Status:", data, status);
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

const initialState = {};
export const generateProjSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(generateProjAsync.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default generateProjSlice.reducer;
