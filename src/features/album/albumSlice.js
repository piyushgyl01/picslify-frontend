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

export const postAlbum = createAsyncThunk(
  "album/postAlbum",
  async (newAlbum, { rejectWithValue }) => {
    try {
      const response = await API_CONFIG.post("/albums", newAlbum);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAlbums = createAsyncThunk(
  "album/fetchAlbums",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API_CONFIG.get("/albums");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch albums",
          error: error.message,
        }
      );
    }
  }
);

export const fetchAlbumDetails = createAsyncThunk(
  "album/fetchAlbumDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API_CONFIG.get(`/albums/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSharedAlbums = createAsyncThunk(
  "album/fetchSharedAlbums",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API_CONFIG.get("/albums/shared");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch shared albums",
          error: error.message,
        }
      );
    }
  }
);

export const updateAlbum = createAsyncThunk(
  "album/updateAlbum",
  async ({ id, albumData }, { rejectWithValue }) => {
    try {
      const response = await API_CONFIG.put(`/albums/${id}`, albumData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteAlbum = createAsyncThunk(
  "album/deleteAlbum",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API_CONFIG.delete(`/albums/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addSharedUsers = createAsyncThunk(
  "album/addSharedUsers",
  async ({ id, usernames }, {rejectWithValue}) => {
    try {
      const response = await API_CONFIG.post(`/albums/${id}/share`, {
        usernames,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const albumSlice = createSlice({
  name: "album",
  initialState: {
    albums: [],
    albumDetails: null,
    sharedAlbums: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postAlbum.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postAlbum.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.albums.push(action.payload.album);
      })
      .addCase(postAlbum.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchAlbums.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.albums = action.payload.albums;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchAlbumDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAlbumDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.albumDetails = action.payload;
      })
      .addCase(fetchAlbumDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchSharedAlbums.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSharedAlbums.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sharedAlbums = action.payload.albums;
      })
      .addCase(fetchSharedAlbums.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(updateAlbum.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAlbum.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.albums.findIndex(
          (album) => album._id === action.payload.album._id
        );
        if (index !== -1) {
          state.albums[index] = action.payload.album;
        }
        state.albumDetails = action.payload.album;
      })
      .addCase(updateAlbum.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(deleteAlbum.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        state.status = "succeeded";
        const deletedId = action.meta.arg;
        state.albums = state.albums.filter((album) => album._id !== deletedId);
      })
      .addCase(deleteAlbum.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(addSharedUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addSharedUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.albums.findIndex(
          (album) => album._id === action.payload.album._id
        );
        if (index !== -1) {
          state.albums[index] = action.payload.album;
        }
        state.albumDetails = action.payload.album;
      })
      .addCase(addSharedUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default albumSlice.reducer;
