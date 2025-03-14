import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_CONFIG = axios.create({
  baseURL: "https://playground-021-backend.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

API_CONFIG.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API_CONFIG.get("/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch profile",
          error: error.message,
        }
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await API_CONFIG.put("/profile", profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update profile",
          error: error.message,
        }
      );
    }
  }
);

export const updatePassword = createAsyncThunk(
  "profile/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await API_CONFIG.put("/profile/password", passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update password",
          error: error.message,
        }
      );
    }
  }
);

export const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null,
    status: "idle",
    passwordStatus: "idle",
    error: null,
    passwordError: null,
    message: null,
    passwordMessage: null,
  },
  reducers: {
    clearProfileMessage: (state) => {
      state.message = null;
    },
    clearProfileError: (state) => {
      state.error = null;
    },
    clearPasswordMessage: (state) => {
      state.passwordMessage = null;
    },
    clearPasswordError: (state) => {
      state.passwordError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch profile";
      })

      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.message = "Profile updated successfully";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to update profile";
      })

      .addCase(updatePassword.pending, (state) => {
        state.passwordStatus = "loading";
        state.passwordError = null;
        state.passwordMessage = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.passwordStatus = "succeeded";
        state.passwordMessage = "Password updated successfully";
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.passwordError = "failed";
        state.passwordError =
          action.payload?.message || "Failed to update password";
      });
  },
});

export const {
  clearProfileMessage,
  clearProfileError,
  clearPasswordError,
  clearPasswordMessage,
} = profileSlice.actions;

export default profileSlice.reducer;
