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

export const postImage = createAsyncThunk(
  "image/postImage",
  async ({ albumId, imageData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(imageData).forEach((key) => {
        formData.append(key, imageData[key]);
      });

      const response = await API_CONFIG.post(
        `/albums/${albumId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to upload image",
          error: error.message,
        }
      );
    }
  }
);

export const fetchImages = createAsyncThunk(
  "image/fetchImages",
  async ({ albumId, tags }, { rejectWithValue }) => {
    try {
      const response = await API_CONFIG.get(`/albums/${albumId}/images`, {
        params: tags ? { tags } : {},
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch images",
          error: error.message,
        }
      );
    }
  }
);

export const toggleFav = createAsyncThunk(
  "image/toggleFav",
  async ({ albumId, imageId }, { rejectWithValue }) => {
    try {
      const response = await API_CONFIG.put(
        `/albums/${albumId}/images/${imageId}/favorite`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to toggle favorite",
          error: error.message,
        }
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "image/addComment",
  async ({ albumId, imageId, text }) => {
    try {
      const response = await API_CONFIG.post(
        `/albums/${albumId}/images/${imageId}/comments`,
        { text }
      );

      return {
        ...response.data,
        imageId,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to add comment",
          error: error.message,
        }
      );
    }
  }
);

export const deleteImage = createAsyncThunk(
  "image/deleteImage",
  async ({ albumId, imageId }) => {
    try {
      const response = await API_CONFIG.delete(
        `/albums/${albumId}/images/${imageId}`
      );

      return { responseData: response.data, imageId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to delete image",
          error: error.message,
        }
      );
    }
  }
);

export const imageSlice = createSlice({
  name: "image",
  initialState: {
    images: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.images = action.payload.images;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch images";
      })

      .addCase(postImage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(postImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.images.push(action.payload.image);
      })
      .addCase(postImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to upload image";
      })

      .addCase(toggleFav.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(toggleFav.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.images.findIndex(
          (img) => img._id === action.payload.image._id
        );
        if (index !== -1) {
          state.images[index] = action.payload.image;
        }
      })
      .addCase(toggleFav.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to toggle favorite";
      })

      .addCase(deleteImage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.images = state.images.filter(
          (img) => img._id !== action.payload.imageId
        );
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to delete image";
      })

      .addCase(addComment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.images.findIndex(
          (img) => img._id === action.payload.imageId
        );
        if (index !== -1) {
          if (!state.images[index].comments) {
            state.images[index].comments = [];
          }
          state.images[index].comments.push(action.payload.comment);
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to add comment";
      });
  },
});

export const { clearError } = imageSlice.actions;
export default imageSlice.reducer;
