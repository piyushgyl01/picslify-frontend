import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { postAlbum, updateAlbum } from "../features/album/albumSlice";

export default function CreateAlbum() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const existingAlbum = location.state;
  const isEditMode = !!existingAlbum;

  const { status, error } = useSelector((state) => state.album);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [albumData, setAlbumData] = useState({
    name: "",
    description: "",
    albumCover: "",
  });
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (isEditMode && existingAlbum) {
      setAlbumData({
        name: existingAlbum.name || "",
        description: existingAlbum.description || "",
        albumCover: existingAlbum.albumCover || "",
      });
    }
  }, [isEditMode, existingAlbum]);

  useEffect(() => {
    if (status === "succeeded" && formSubmitted) {
      const timer = setTimeout(() => {
        navigate("/albums");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [status, navigate, formSubmitted]);

  function handleChange(e) {
    const { name, value } = e.target;
    setAlbumData({
      ...albumData,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setFormSubmitted(true);

    if (isEditMode) {
      dispatch(
        updateAlbum({
          id: existingAlbum._id,
          albumData: {
            name: albumData.name,
            description: albumData.description,
            albumCover: albumData.albumCover,
          },
        })
      );
    } else {
      dispatch(postAlbum(albumData));
    }
  }

  const showSuccessMessage = status === "succeeded" && formSubmitted;

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="bg-white rounded-3 shadow-sm border-0">
            <div className="p-4 border-bottom">
              <h3 className="fw-light">
                {isEditMode ? "Edit Album" : "Create New Album"}
              </h3>
              <p className="text-muted mb-0">
                {isEditMode
                  ? "Update your album information"
                  : "Add a new photo collection to your gallery"}
              </p>
            </div>
            <div className="p-4">
              {error && formSubmitted && (
                <div
                  className="alert alert-danger bg-danger-subtle text-danger border-0 rounded-3"
                  role="alert"
                >
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}
              {showSuccessMessage && (
                <div
                  className="alert alert-success bg-success-subtle text-success border-0 rounded-3"
                  role="alert"
                >
                  <i className="bi bi-check-circle me-2"></i>
                  {isEditMode
                    ? "Album updated successfully!"
                    : "Album created successfully!"}
                </div>
              )}
              <form
                className={validated ? "was-validated" : ""}
                noValidate
                onSubmit={handleSubmit}
              >
                <div className="mb-4">
                  <label
                    htmlFor="albumName"
                    className="form-label small text-muted fw-semibold"
                  >
                    ALBUM NAME
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="albumName"
                    className="form-control form-control-lg border-0 bg-light"
                    value={albumData.name}
                    onChange={handleChange}
                    required
                    placeholder="My Amazing Collection"
                  />
                  <div className="invalid-feedback">
                    Please provide an album name.
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="albumDescription"
                    className="form-label small text-muted fw-semibold"
                  >
                    DESCRIPTION
                  </label>
                  <textarea
                    className="form-control border-0 bg-light"
                    name="description"
                    id="albumDescription"
                    value={albumData.description}
                    onChange={handleChange}
                    placeholder="Describe what's special about this collection"
                    rows="3"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="albumCover"
                    className="form-label small text-muted fw-semibold"
                  >
                    COVER IMAGE URL
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <i className="bi bi-link-45deg"></i>
                    </span>
                    <input
                      type="url"
                      className="form-control border-0 bg-light"
                      name="albumCover"
                      id="albumCover"
                      value={albumData.albumCover}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="form-text">
                    This image will be displayed as the album thumbnail
                  </div>
                  {albumData.albumCover && (
                    <div className="mt-3 text-center">
                      <p className="text-muted small mb-2">Preview:</p>
                      <img
                        src={albumData.albumCover}
                        alt="Album cover preview"
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: "512px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/400x300?text=Invalid+Image+URL";
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="d-grid gap-2 pt-3">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg rounded-3 text-white fw-semibold"
                    disabled={status === "loading"}
                  >
                    {status === "loading" && formSubmitted ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {isEditMode ? "Updating Album..." : "Creating Album..."}
                      </>
                    ) : isEditMode ? (
                      "Update Album"
                    ) : (
                      "Create Album"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="text-center mt-4">
            <Link to="/albums" className="text-decoration-none">
              <i className="bi bi-arrow-left me-1"></i> Back to Albums
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
