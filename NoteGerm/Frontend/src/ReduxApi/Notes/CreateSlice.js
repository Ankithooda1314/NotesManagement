import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../AxiosInstance.js";

// Thunk for creating note
export const createNote = createAsyncThunk(
  "notes/createNote",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/notes/notes", // relative URL
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      return data; // ✅ data contains { success, message, note }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

const initialState = {
  loading: false,
  success: false,
  note: null,  // <-- backend se note store karenge
  error: null
};

// 🔹 Rename variable from createSlice to notesSlice
const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
      state.note = null; // reset note
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNote.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.note = action.payload.note; // backend se note
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Something went wrong";
      });
  }
});

export const { resetSuccess, clearError } = notesSlice.actions;
export default notesSlice.reducer;
