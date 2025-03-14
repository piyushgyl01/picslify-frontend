import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  BsGrid,
  BsList,
  BsUpload,
  BsPeople,
  BsTrash,
  BsStar,
  BsStarFill,
  BsChatDots,
  BsX,
} from "react-icons/bs";
import { fetchAlbumDetails } from "../features/album/albumSlice";
import {
  addComment,
  deleteImage,
  fetchImages,
  toggleFav,
} from "../features/imageFeature/imageSlice";

export default function AlbumDetails() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { albumId } = useParams();

  const isSharedAlbum = location.state?.isSharedAlbum || false;

  const {
    albumDetails,
    status: albumStatus,
    error: albumError,
  } = useSelector((state) => state.album);
  const {
    images,
    status: imageStatus,
    error: imageError,
  } = useSelector((state) => state.image);

  const [viewMode, setViewMode] = useState("grid");
  const [sortedImages, setSortedImages] = useState([]);
  const [tags, setTags] = useState("");
  const [deletingImageIds, setDeletingImageIds] = useState([]);
  const [togglingFavoriteIds, setTogglingFavoriteIds] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const [expandedCommentImageId, setExpandedCommentImageId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [submittingCommentImageId, setSubmittingCommentImageId] =
    useState(null);

  useEffect(() => {
    if (albumId) {
      dispatch(fetchAlbumDetails(albumId));
    }
  }, [dispatch, albumId]);

  useEffect(() => {
    if (albumId) {
      dispatch(fetchImages({ albumId }));
    }
  }, [dispatch, albumId]);

  useEffect(() => {
    if (images && Array.isArray(images)) {
      if (showOnlyFavorites) {
        setSortedImages(images.filter((image) => image.isFavorite));
      } else {
        setSortedImages(images);
      }
    }
  }, [images, showOnlyFavorites]);

  function handleFilterByTags() {
    if (tags.trim() && albumId) {
      dispatch(fetchImages({ albumId, tags }));
      setShowOnlyFavorites(false);
    }
  }

  function handleShowAllImages() {
    if (albumId) {
      dispatch(fetchImages({ albumId }));
      setTags("");
      setShowOnlyFavorites(false);
    }
  }

  function handleToggleFavoriteFilter() {
    setShowOnlyFavorites(!showOnlyFavorites);
  }

  function toggleViewMode() {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  }

  function handleToggleFavorite(e, imageId, currentStatus) {
    e.preventDefault();
    e.stopPropagation();

    if (albumId && imageId) {
      setTogglingFavoriteIds((prev) => [...prev, imageId]);

      setSortedImages((prev) =>
        prev.map((image) =>
          image._id === imageId
            ? { ...image, isFavorite: !image.isFavorite }
            : image
        )
      );

      dispatch(toggleFav({ albumId, imageId }))
        .unwrap()
        .then(() => {
          setTogglingFavoriteIds((prev) => prev.filter((id) => id !== imageId));
        })
        .catch((e) => {
          console.error("Failed to toggle favorite:", e);
          setSortedImages((prev) =>
            prev.map((img) =>
              img._id === imageId ? { ...img, isFavorite: currentStatus } : img
            )
          );
          setTogglingFavoriteIds((prev) => prev.filter((id) => id !== imageId));
        });
    }
  }

  function toggleComments(imageId) {
    setExpandedCommentImageId(
      expandedCommentImageId === imageId ? null : imageId
    );
    setCommentText("");
  }

  function handleCommentSubmit(e, imageId) {
    e.preventDefault();

    if (!commentText.trim() || !albumId || !imageId) return;

    setSubmittingCommentImageId(imageId);

    dispatch(
      addComment({
        albumId,
        imageId,
        text: commentText,
      })
    )
      .unwrap()
      .then(() => {
        setCommentText("");
        setSubmittingCommentImageId(null);
      })
      .catch((error) => {
        console.error("Failed to add comment:", error);
        setSubmittingCommentImageId(null);
      });
  }

  function handleDeleteImage(e, imageId) {
    e.preventDefault();
    e.stopPropagation();

    if (
      albumId &&
      imageId &&
      window.confirm("Are you sure you want to delete this image?")
    ) {
      setDeletingImageIds((prev) => [...prev, imageId]);

      setSortedImages((prev) => prev.filter((img) => img._id !== imageId));

      dispatch(deleteImage({ albumId, imageId }))
        .unwrap()
        .then(() => {
          setDeletingImageIds((prev) => prev.filter((id) => id !== imageId));
        })
        .catch((e) => {
          console.log(e);
          dispatch(fetchImages({ albumId }));
          setDeletingImageIds((prev) => prev.filter((id) => id !== imageId));
        });
    }
  }

  function renderComments(image) {
    const isExpanded = expandedCommentImageId === image._id;
    const hasComments = image.comments && image.comments.length > 0;

    if (!isExpanded && !hasComments) {
      return (
        <div className="mt-2">
          <button
            className="btn btn-outline-secondary btn-sm w-100"
            onClick={() => toggleComments(image._id)}
          >
            <BsChatDots className="me-2" /> Add Comment
          </button>
        </div>
      );
    }

    return (
      <div className="mt-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0 fw-bold">
            <BsChatDots className="me-2" />
            Comments {hasComments && `(${image.comments.length})`}
          </h6>
          <button
            className="btn btn-sm btn-link text-muted p-0"
            onClick={() => toggleComments(image._id)}
          >
            {isExpanded ? <BsX size={20} /> : "Show"}
          </button>
        </div>

        {isExpanded && (
          <>
            {hasComments ? (
              <div className="comment-list mb-3 border-bottom pb-2">
                {image.comments.map((comment, index) => (
                  <div className="comment mb-2 pb-2 border-bottom" key={index}>
                    <div className="d-flex justify-content-between">
                      <strong className="text-primary">
                        {comment.user?.username || comment.user?.name || "User"}
                      </strong>
                      {/* <small className="text-muted">
                        {new Date(image.)}
                      </small> */}
                    </div>
                    <p className="mb-0 text-break">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted small mb-3">
                No comments yet. Be the first to comment!
              </p>
            )}

            <form onSubmit={(e) => handleCommentSubmit(e, image._id)}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={submittingCommentImageId === image._id}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={
                    !commentText.trim() ||
                    submittingCommentImageId === image._id
                  }
                >
                  {submittingCommentImageId === image._id ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "Post"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    );
  }

  // Loading states
  if (
    (albumStatus === "loading" || imageStatus === "loading") &&
    (!sortedImages || sortedImages.length === 0) &&
    !albumDetails
  ) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center py-5"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Error states
  if (
    (albumStatus === "failed" || imageStatus === "failed") &&
    (albumError || imageError)
  ) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger shadow-sm" role="alert">
          <h4 className="alert-heading">Error Loading Album</h4>
          <p>
            {albumError ||
              imageError ||
              "There was a problem loading the album. Please try again later."}
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Link to="/albums" className="btn btn-outline-danger">
              Back to Albums
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const albumName = albumDetails?.album?.name || "Album";
  const albumDescription =
    albumDetails?.album?.description || "No description available";
  const sharedUsers = albumDetails?.album?.sharedUsers || [];

  return (
    <div className="container">
      <div className="row align-items-start mb-4">
        <div className="col-12 col-lg-8 mb-3">
          <div className="d-flex align-items-center mb-2">
            <Link to="/albums" className="text-decoration-none text-muted me-2">
              <small>Albums</small>
            </Link>
            <small className="text-muted">/</small>
            <span className="ms-2 text-truncate">
              <small>{albumName}</small>
            </span>
          </div>
          <h1 className="fw-bold mb-2">{albumName}</h1>
          <p className="text-muted">{albumDescription}</p>

          {!isSharedAlbum && sharedUsers.length > 0 && (
            <div className="d-flex align-items-center mb-2">
              <BsPeople className="text-primary me-2" />
              <span className="text-muted">
                Shared with {sharedUsers.length} user
                {sharedUsers.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {isSharedAlbum && (
            <div className="badge bg-info text-white mb-3">
              <BsPeople className="me-1" /> Shared with you
            </div>
          )}
        </div>

        <div className="col-12 col-lg-4 d-flex flex-wrap justify-content-start justify-content-lg-end gap-2">
          {!isSharedAlbum && (
            <Link to={`/addImage/${albumId}`} className="btn btn-primary">
              <BsUpload className="me-2" />
              Add Images
            </Link>
          )}
        </div>
      </div>
      <div className="bg-light rounded p-3 mb-4">
        <div className="row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <div className="d-flex gap-2 flex-wrap">
              <button
                className="btn btn-outline-secondary"
                onClick={handleShowAllImages}
              >
                <i className="bi bi-grid me-2"></i>
                All Images
              </button>

              <button
                className={`btn ${
                  showOnlyFavorites ? "btn-warning" : "btn-outline-warning"
                }`}
                onClick={handleToggleFavoriteFilter}
              >
                {showOnlyFavorites ? (
                  <BsStarFill className="me-2" />
                ) : (
                  <BsStar className="me-2" />
                )}
                Favorites
              </button>

              <button className="btn btn-outline-dark" onClick={toggleViewMode}>
                {viewMode === "grid" ? (
                  <BsList size={18} />
                ) : (
                  <BsGrid size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="col-md-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search by tags..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleFilterByTags()}
              />
              <button className="btn btn-primary" onClick={handleFilterByTags}>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      {viewMode === "grid" && (
        <div className="row">
          {sortedImages && sortedImages.length > 0 ? (
            sortedImages.map((image) => (
              <div key={image._id} className="col-md-4 col-lg-3 mb-4">
                <div className="card shadow-sm border-0 position-relative h-100">
                  <div className="position-relative">
                    <img
                      src={image.file}
                      alt="image"
                      className="card-img-top"
                      style={{ objectFit: "cover", height: "320px" }}
                    />
                    {!isSharedAlbum && (
                      <button
                        className={`btn ${
                          image.isFavorite ? "btn-warning" : "btn-light"
                        } btn-sm position-absolute top-0 end-0 m-2 rounded-circle shadow-sm`}
                        style={{
                          width: "32px",
                          height: "32px",
                          padding: "0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={(e) =>
                          handleToggleFavorite(e, image._id, image.isFavorite)
                        }
                        disabled={togglingFavoriteIds.includes(image._id)}
                      >
                        {togglingFavoriteIds.includes(image._id) ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : image.isFavorite ? (
                          <BsStarFill size={16} />
                        ) : (
                          <BsStar size={16} />
                        )}
                      </button>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-center">
                      {image.name || "Untitled"}
                    </h5>
                    <p className="card-text text-muted text-center">
                      <strong>Uploaded:</strong>{" "}
                      {image.uploadedAt
                        ? new Date(image.uploadedAt).toLocaleString()
                        : "Unknown date"}
                    </p>
                    <div className="mt-auto">
                      <div className="mb-2">
                        {image.tags && image.tags.length > 0 && (
                          <div className="d-flex flex-wrap gap-1 my-2">
                            {image.tags.map((tag, index) => (
                              <span
                                className="badge bg-primary"
                                key={index}
                                style={{ fontSize: "0.85" }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {renderComments(image)}
                      {!isSharedAlbum && (
                        <div className="mt-2">
                          <button
                            className="btn btn-outline-danger btn-sm w-100"
                            onClick={(e) => handleDeleteImage(e, image._id)}
                            fetchAlbumDetails={deletingImageIds.includes(
                              image._id
                            )}
                          >
                            {deletingImageIds.includes(image._id) ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <BsTrash className="me-2" /> Delete Image
                              </>
                            )}
                          </button>
                        </div>
                      )}{" "}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="mb-4">
                <i
                  className="bi bi-images"
                  style={{ fontSize: "3rem", color: "#ccc" }}
                ></i>
              </div>
              <h3>No Images Found</h3>
              <p className="text-muted">
                {showOnlyFavorites
                  ? "No favorite images in this album."
                  : tags
                  ? `No images match your search for "${tags}".`
                  : "This album doesn't have any images yet."}
              </p>
              {!isSharedAlbum && !tags && !showOnlyFavorites && albumId && (
                <Link
                  to={`/addImage/${albumId}`}
                  className="btn btn-primary mt-3"
                >
                  <BsUpload className="me-2" />
                  Add Your First Image
                </Link>
              )}
              {(tags || showOnlyFavorites) && (
                <button
                  className="btn btn-outline-secondary mt-3"
                  onClick={handleShowAllImages}
                >
                  Show All Images
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {viewMode === "list" && (
        <div className="row">
          <div className="col-12">
            {sortedImages && sortedImages.length > 0 ? (
              <div className="list-group">
                {sortedImages.map((image) => (
                  <div key={image._id}>
                    <div className="list-group-item list-group-item-action d-flex align-items-center p-3">
                      <img
                        src={image.file}
                        className="rounded me-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                        alt={image.name || "Image"}
                      />
                      <div className="flex-grow-1">
                        <h5 className="mb-1">
                          {image.name || "Untitled"}
                          {image.isFavorite && (
                            <BsStarFill
                              className="text-warning ms-2"
                              size={14}
                            />
                          )}
                        </h5>
                        <p className="mb-1 text-muted small">
                          {image.tags && image.tags.length > 0 && (
                            <span className="me-3">
                              <i className="bi bi-tags me-1"></i>
                              {image.tags.join(", ")}
                            </span>
                          )}
                          {image.person && (
                            <span className="me-3">
                              <i className="bi bi-person me-1"></i>
                              {image.person}
                            </span>
                          )}
                          <span className="me-3">
                            <i className="bi bi-clock me-1"></i>
                            {image.uploadedAt
                              ? new Date(image.uploadedAt).toLocaleDateString()
                              : "Unknown date"}
                          </span>
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => toggleComments(image._id)}
                        >
                          <BsChatDots />
                          {image.comments &&
                            image.comments.length > 0 &&
                            ` (${image.comments.length})`}
                        </button>
                        {!isSharedAlbum && (
                          <button
                            className={`btn btn-sm ${
                              image.isFavorite
                                ? "btn-warning"
                                : "btn-outline-warning"
                            }`}
                            onClick={(e) =>
                              handleToggleFavorite(
                                e,
                                image._id,
                                image.isFavorite
                              )
                            }
                            disabled={togglingFavoriteIds.includes(image._id)}
                          >
                            {togglingFavoriteIds.includes(image._id) ? (
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                            ) : image.isFavorite ? (
                              <BsStarFill />
                            ) : (
                              <BsStar />
                            )}
                          </button>
                        )}
                        {!isSharedAlbum && (
                          <button
                            className="btn btn-danger"
                            onClick={(e) => handleDeleteImage(e, image._id)}
                            disabled={deletingImageIds.includes(image._id)}
                          >
                            {deletingImageIds.includes(image._id) ? (
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                            ) : (
                              <BsTrash />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    {expandedCommentImageId === image._id && (
                      <div className="px-2 py-3 border-bottom bg-light">
                        {renderComments(image)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="col-12 text-center py-5">
                <div className="mb-4">
                  <i
                    className="bi bi-images"
                    style={{ fontSize: "3rem", color: "#ccc" }}
                  ></i>
                </div>
                <h3>No Images Found</h3>
                <p className="text-muted">
                  {showOnlyFavorites
                    ? "No favorite images in this album."
                    : tags
                    ? `No images match your search for "${tags}".`
                    : "This album doesn't have any images yet."}
                </p>
                {!isSharedAlbum && !tags && !showOnlyFavorites && albumId && (
                  <Link
                    to={`/addImage/${albumId}`}
                    className="btn btn-primary mt-3"
                  >
                    <BsUpload className="me-2" />
                    Add Your First Image
                  </Link>
                )}
                {(tags || showOnlyFavorites) && (
                  <button
                    className="btn btn-outline-secondary mt-3"
                    onClick={handleShowAllImages}
                  >
                    Show All Images
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
