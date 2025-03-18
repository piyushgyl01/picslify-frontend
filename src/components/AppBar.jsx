import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BsSearch, BsX, BsImage, BsPerson, BsTag } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser } from "../features/auth/authSlice";

const api = axios.create({
  baseURL: "https://playground-021-backend.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default function AppBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user: authUser } = useSelector((state) => state.auth);
  const { user: profileUser } = useSelector((state) => state.profile);
  const user = profileUser || authUser;

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    query: "",
    tags: "",
    person: "",
    favorite: false,
  });

  const searchInputRef = useRef(null);
  const searchBoxRef = useRef(null);

  function handleLogout() {
    dispatch(logoutUser());
  }

  function toggleSearch() {
    setShowSearch(!showSearch);
    setSearchResults([]);
    setSearchQuery("");
    setSearchFilters({
      query: "",
      tags: "",
      person: "",
      favorite: false,
    });
  }

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setShowSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleSearchSubmit(e) {
    e?.preventDefault();

    if (
      !searchQuery.trim() &&
      !searchFilters.tags &&
      !searchFilters.person &&
      !searchFilters.favorite
    ) {
      return;
    }

    setIsSearching(true);

    try {
      const params = {};

      if (searchQuery.trim()) {
        params.query = searchQuery;
      }

      if (searchFilters.tags) {
        params.tags = searchFilters.tags;
      }

      if (searchFilters.person) {
        params.person = searchFilters.person;
      }

      if (searchFilters.favorite) {
        params.favorite = searchFilters.favorite;
      }
      const response = await api.get("/search/images", { params });
      setSearchResults(response.data.images || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (
        showSearch &&
        (searchQuery.trim() ||
          searchFilters.tags ||
          searchFilters.person ||
          searchFilters.favorite)
      ) {
        handleSearchSubmit();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchFilters, showSearch]);

  function goToImage(albumId, imageId) {
    navigate(`/album/${albumId}`, { state: { highlightImageId: imageId } });
    setShowSearch(false);
  }

  function handleFilterChange(filterName, value) {
    setSearchFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  }
  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light position-sticky top-0 z-3 py-3 shadow-sm"
        style={{
          backgroundColor: "#f8f9fc",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <div className="container-fluid px-4">
          <Link
            className="navbar-brand d-flex align-items-center fs-3 fw-bold text-decoration-none 
              text-dark
              transition transform hover:scale-105 hover:opacity-80"
            to="/"
          >
            <i className="bi bi-image-fill me-3 text-primary"></i>
            Picsilfy
          </Link>

          <button
            className="navbar-toggler p-2 border-0 
              bg-light 
              focus:ring-2 focus:ring-primary 
              transition-all duration-300"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center gap-2">
              {user && (
                <li className="nav-item">
                  <button
                    className={`btn ${
                      showSearch ? "btn-primary" : "btn-outline-secondary"
                    } rounded-circle d-flex align-items-center justify-content-center`}
                    style={{ width: "44px", height: "44px" }}
                    onClick={toggleSearch}
                  >
                    {showSearch ? <BsX size={20} /> : <BsSearch size={16} />}
                  </button>
                </li>
              )}
              <li className="nav-item">
                <Link
                  className="nav-link text-dark px-3 py-2 rounded-3 
                    transition-all duration-300 
                    hover:bg-light 
                    hover:text-primary"
                  to="/albums"
                >
                  Albums
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/create-album">
                  Create Album
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-dark px-3 py-2 rounded-3 
                    transition-all duration-300 
                    hover:bg-light 
                    hover:text-primary"
                  to="/albums/shared"
                >
                  Shared
                </Link>
              </li>
              {user ? (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-dark px-3 py-2 rounded-3 
                      d-flex align-items-center 
                      transition-all duration-300 
                      hover:bg-light 
                      hover:text-primary"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        style={{
                          width: "24px",
                          height: "24px",
                          objectFit: "cover",
                        }}
                        className="rounded-circle me-2"
                      />
                    ) : (
                      <i
                        className="bi bi-person-circle me-2 text-primary"
                        style={{ fontSize: "1.5rem" }}
                      ></i>
                    )}
                    {user.name}
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end 
                    bg-white border-light shadow-lg rounded-4 p-2 mt-2"
                    style={{
                      backgroundColor: "#f8f9fc",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <li>
                      <Link
                        className="dropdown-item rounded-3 d-flex align-items-center 
                          text-dark
                          transition-all duration-300 
                          hover:bg-light"
                        to="/profile"
                      >
                        <i className="bi bi-person me-3 text-primary"></i>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger rounded-3 d-flex align-items-center 
                          transition-all duration-300 
                          hover:bg-light"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-3"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link text-dark px-3 py-2 rounded-3 
                        transition-all duration-300 
                        hover:bg-light 
                        hover:text-primary"
                      to="/auth"
                    >
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="btn btn-primary rounded-pill px-4 py-2 
                        shadow-sm border-0 
                        transition-all duration-300 
                        hover:shadow-lg 
                        active:scale-95"
                      to="/auth"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      {showSearch && (
        <div
          className="position-fixed w-100 px-3"
          style={{ top: "80px", left: 0, zIndex: 1040 }}
        >
          <div
            ref={searchBoxRef}
            className="container mx-auto bg-white rounded-4 shadow-lg overflow-hidden"
            style={{ maxWidth: "800px" }}
          >
            <form onSubmit={handleSearchSubmit} className="p-3 border-bottom">
              <div className="d-flex align-items-center">
                <BsSearch className="text-muted me-3" size={20} />
                <input
                  type="text"
                  ref={searchInputRef}
                  className="form-control form-control-lg border-0 shadow-none"
                  placeholder="Search for images"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="d-flex flex-wrap gap-2 mt-3">
                <div className="input-group" style={{ maxWidth: "200px" }}>
                  <span className="input-group-text bg-light border-0">
                    <BsTag />
                  </span>
                  <input
                    type="text"
                    placeholder="Tags"
                    className="form-control bg-light border-0"
                    value={searchFilters.tags}
                    onChange={(e) => handleFilterChange("tags", e.target.value)}
                  />
                </div>
                <div className="input-group" style={{ maxWidth: "200px" }}>
                  <span className="input-group-text bg-light border-0">
                    <BsPerson />
                  </span>
                  <input
                    type="text"
                    placeholder="Person"
                    className="form-control bg-light border-0"
                    value={searchFilters.person}
                    onChange={(e) =>
                      handleFilterChange("person", e.target.value)
                    }
                  />
                </div>
                <div className="form-check form-switch ms-2 d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    id="favoriteFilter"
                    checked={searchFilters.favorite}
                    onChange={(e) =>
                      handleFilterChange("favorite", e.target.checked)
                    }
                  />
                  <label htmlFor="favoriteFilter" className="form-check-label">
                    Favorites only
                  </label>
                </div>
              </div>
            </form>
            <div className="p-0 overflow-auto" style={{ maxHeight: "500px" }}>
              {isSearching ? (
                <div className="text-center p-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="list-group list-group-flush">
                  {searchResults.map((image) => (
                    <div
                      key={image._id}
                      className="list-group-item list-group-item-action border-0 px-4 py-3"
                      onClick={() => goToImage(image.albumId, image._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex">
                        <div className="flex-shrink-0 me-3">
                          <img
                            src={image.file}
                            alt={image.name}
                            className="rounded"
                            style={{
                              width: "70px",
                              height: "70px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between">
                            <h6>{image.name || "Untitled Image"}</h6>
                            {image.isFavorite && (
                              <span className="text-warning">
                                <i className="bi bi-star-fill"></i>
                              </span>
                            )}
                          </div>
                          {image.tags && image.tags.length > 0 && (
                            <p className="mb-1 small text-muted">
                              <i className="bi bi-tags me-1"></i>
                              {image.tags.join(", ")}
                            </p>
                          )}
                          {image.person && (
                            <p className="mb-1 small text-muted">
                              <i className="bi bi-person me-1"></i>
                              {image.person}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-5">
                  <BsSearch size={48} className="text-muted mb-3" />
                  <h5>Search for images</h5>
                  <p className="text-muted mb-0">
                    Use the filters above to find images
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
