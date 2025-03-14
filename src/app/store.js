import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../features/auth/authSlice";
import { albumSlice } from "../features/album/albumSlice";
import { imageSlice } from "../features/imageFeature/imageSlice";
import { profileSlice } from "../features/profile/profileSlice";

export default configureStore({
  reducer: {
    auth: authSlice.reducer,
    album: albumSlice.reducer,
    image: imageSlice.reducer,
    profile: profileSlice.reducer,
  },
});
