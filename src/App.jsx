import { useDispatch, useSelector } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import CreateAlbum from "./pages/CreateAlbum";
import AlbumDetails from "./pages/AlbumDetails";
import AddImage from "./pages/AddImage";
import SharedAlbums from "./pages/SharedAlbums";
import AlbumsPage from "./pages/AlbumsPage";
import ProfilePage from "./pages/Profile.jsx";
import Homepage from "./pages/Homepage";
import Auth from "./features/auth/Auth";
import { useEffect } from "react";
import { getCurrentUser } from "./features/auth/authSlice.js";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import PrivateRoute from "./PrivateRoute.jsx";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/create-album",
        element: (
          <PrivateRoute>
            <CreateAlbum />
          </PrivateRoute>
        ),
      },
      {
        path: "/album/:albumId",
        element: (
          <PrivateRoute>
            <AlbumDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/addImage/:albumId",
        element: (
          <PrivateRoute>
            <AddImage />
          </PrivateRoute>
        ),
      },
      {
        path: "/albums/shared",
        element: (
          <PrivateRoute>
            <SharedAlbums />
          </PrivateRoute>
        ),
      },
      {
        path: "/albums",
        element: (
          <PrivateRoute>
            <AlbumsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);

export default function App() {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
