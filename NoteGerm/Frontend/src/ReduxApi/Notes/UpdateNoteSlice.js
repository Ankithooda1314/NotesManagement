import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../AxiosInstance.js";

// 🔹 Thunk for updating note
export const updateNote = createAsyncThunk(
  "notes/updateNote",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/notes/notes/${id}`, // 👈 update API
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      return data; // { success, message, note }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

const initialState = {
  loadings: false,
  successs: false,
  note: null,
  errors: null
};

const updateNoteSlice = createSlice({
  name: "updateNote",
  initialState,
  reducers: {
    resetUpdateSuccess: (state) => {
      state.successs = false;
      state.note = null;
    },
    clearUpdateError: (state) => {
      state.errors = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateNote.pending, (state) => {
        state.loadings = true;
        state.successs = false;
        state.errors = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loadings = false;
        state.successs = true;
        state.notes = action.payload.note;
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loadings = false;
        state.successs = false;
        state.errors = action.payload;
      });
  }
});

export const { resetUpdateSuccess, clearUpdateError } = updateNoteSlice.actions;
export default updateNoteSlice.reducer;
