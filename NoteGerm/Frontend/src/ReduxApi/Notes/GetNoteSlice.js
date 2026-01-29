import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../AxiosInstance.js";

// 🔹 Thunk to fetch all notes
export const getNotes = createAsyncThunk(
  "notes/getNotes",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/notes/notes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return data; // ✅ data expected: { success, notes: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

const initialState = {
  loading: false,
  notes: [],   // backend se sare notes store karenge
  error: null,
};

// 🔹 Create Slice
const getNotesSlice = createSlice({
  name: "getNotes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetNotes: (state) => {
      state.notes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload.notes; // backend se notes
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch notes";
      });
  },
});

export const { clearError, resetNotes } = getNotesSlice.actions;
export default getNotesSlice.reducer;
