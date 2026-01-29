// ReduxApi/Users/UserStatsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../AxiosInstance.js";

// 🔹 Thunk for fetching user stats
export const fetchUserStats = createAsyncThunk(
  "users/fetchUserStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/notes/allStats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return data; // { totalUsers, activeUsers, otherStats... }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

const initialState = {
  loadingStats: false,
  successStats: false,
  stats: null,
  errorStats: null,
};

const userStatsSlice = createSlice({
  name: "userStats",
  initialState,
  reducers: {
    resetStats: (state) => {
      state.successStats = false;
      state.stats = null;
      state.errorStats = null;
    },
    clearStatsError: (state) => {
      state.errorStats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.loadingStats = true;
        state.successStats = false;
        state.errorStats = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loadingStats = false;
        state.successStats = true;
        state.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loadingStats = false;
        state.successStats = false;
        state.errorStats = action.payload;
      });
  },
});

export const { resetStats, clearStatsError } = userStatsSlice.actions;
export default userStatsSlice.reducer;
