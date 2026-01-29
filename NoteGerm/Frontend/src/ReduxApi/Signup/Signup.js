import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../AxiosInstance.js"; 

// 🔹 SIGNUP API CALL
export const signupUser = createAsyncThunk(
  "signup/signupUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/user/signup", formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || "Signup failed");
    }
  }
);

const SignupSlice = createSlice({
  name: "signup",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

 
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("isAuthenticated", "true");
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default SignupSlice.reducer;
