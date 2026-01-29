import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../AxiosInstance.js";

// 🔹 Thunk for deleting note
export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/notes/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return data; // { success, message }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

const initialState = {
  loadingss: false,   // 🔹 loading state
  successss: false,   // 🔹 success state
  messages: null,     // 🔹 success/error message
  errorss: null       // 🔹 error state
};

const deleteNoteSlice = createSlice({
  name: "deleteNote",
  initialState,
  reducers: {
    resetDeleteSuccess: (state) => {
      state.successss = false;
      state.messages = null;
    },
    clearDeleteError: (state) => {
      state.errorss = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteNote.pending, (state) => {
        state.loadingss = true;
        state.successss = false;
        state.errorss = null;
        state.messages = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loadingss = false;
        state.successss = true;
        state.messages = action.payload.message;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loadingss = false;
        state.successss = false;
        state.errorss = action.payload;
      });
  },
});

export const { resetDeleteSuccess, clearDeleteError } = deleteNoteSlice.actions;
export default deleteNoteSlice.reducer;
