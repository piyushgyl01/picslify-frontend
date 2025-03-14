import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  BsThreeDotsVertical,
  BsCollection,
  BsCalendarDate,
} from "react-icons/bs";
import { fetchSharedAlbums } from "../features/album/albumSlice";
import LoadingSpinner from "../components/LoadingSpinner";

export default function SharedAlbums() {
  const dispatch = useDispatch();
  const { sharedAlbums, status, error } = useSelector((state) => state.album);

  useEffect(() => {
    dispatch(fetchSharedAlbums());
  }, [dispatch]);

  function getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  }

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (status === "failed") {
    return (
      <div className="container py-5">
        <div className="alert alert-danger shadow-sm" role="alert">
          <h4 className="alert-heading">Error Loading Shared Albums</h4>
          <p>
            {error ||
              "There was a problem loading shared albums. Please try again later."}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="container">
      <div className="row mb-5">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="fw-bold mb-1">Shared Albums</h1>
              <p className="text-muted mb-0">
                Albums shared with you by friends and family
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {sharedAlbums && sharedAlbums.length > 0 ? (
          sharedAlbums.map((album) => {
            const formattedDate = album.createdAt
              ? new Date(album.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Unknown date";

            return (
              <div key={album._id} className="col-lg-4 col-md-6 mb-4">
                <div className="card h-100 border-0 shadow-sm hover-shadow">
                  <div
                    className="card-img-top d-flex align-items-center justify-content-center text-white"
                    style={{
                      backgroundImage: album.albumCover
                        ? `url(${album.albumCover})`
                        : null,
                      backgroundColor: !album.albumCover
                        ? album.coverColor || getRandomColor()
                        : null,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: "512px",
                      position: "relative",
                    }}
                  >
                    <div className="bg-dark bg-opacity-50 w-100 h-100 d-flex align-items-center justify-content-center position-absolute">
                      <h3 className="m-0 text-center px-3">{album.name}</h3>
                    </div>
                    <div className="position-absolute top-0 end-0 mt-2 me-2">
                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn btn-sm btn-light rounded-circle shadow-sm"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{ width: "32px", height: "32px" }}
                        >
                          <BsThreeDotsVertical />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                          <li>
                            <span className="dropdown-item text-muted">
                              <i className="bi bi-people me-2"></i>
                              Shared by: {album.owner || "Unknown"}
                            </span>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <span className="dropdown-item text-muted">
                              <i className="bi bi-person-check me-2"></i>
                              Shared with:{" "}
                              {album.sharedUsers?.join(", ") ||
                                "No other users"}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-3">{album.name}</h5>
                    <p
                      className="card-text text-muted mb-3"
                      style={{ minHeight: "48px" }}
                    >
                      {album.description || "NO description available"}
                    </p>
                    <div className="d-flex align-items-center text-muted small mb-3">
                      <BsCalendarDate className="me-2" />
                      <span>{formattedDate}</span>
                    </div>
                    <Link
                      to={`/album/${album._id}`}
                      state={{ isSharedAlbum: true }}
                      className="btn btn-outline-primary w-100"
                    >
                      View Shared Album
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-md-8 col-lg-6 mx-auto">
            <div className="card border-0 shadow-sm text-center py-5">
              <div className="card-body">
                <div className="mb-4">
                  <BsCollection size={48} className="text-muted" />
                  <h3 className="card-title mb-3">No Shared Albums</h3>
                  <p className="card-text text-muted mb-4">
                    No albums have been shared with you yet. When someone shares
                    an album, it will appear here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
