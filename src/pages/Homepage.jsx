import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Nav from "../components/Nav";

export default function Homepage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="homepage">
      <div className="position-relative hero-section">
        <div
          className="hero-overlay position-absolute w-100 h-100 bg-dark"
          style={{ opacity: 0.7 }}
        ></div>
        <img
          src="https://th.bing.com/th/id/OIG2.qw_Fdlgz38BZN8ywyx3K?pid=ImgGn"
          className="img-fluid w-100"
          alt="Landing Page"
        />

        <Nav />

        {/* Hero Content */}
        <div className="position-absolute top-50 start-50 translate-middle text-center text-white w-75">
          <h1 className="display-4 fw-bold mb-4">
            Preserve Your Precious Memories
          </h1>
          <p className="lead mb-4">
            Organize, share, and relive your special moments in one beautiful
            place
          </p>
          {user ? (
            <Link
              to="/create-album"
              className="btn btn-primary btn-lg rounded-pill px-5 py-3"
            >
              Create New Album <i className="bi bi-plus-circle ms-2"></i>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="btn btn-primary btn-lg rounded-pill px-5 py-3"
            >
              Get Started <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          )}
        </div>
      </div>

      <div className="container py-5">
        {user && (
          <div
            className="alert alert-success d-flex align-items-center mb-5"
            role="alert"
          >
            <i className="bi bi-check-circle-fill me-2"></i>
            <div>
              Welcome to Picslify, <strong>{user.name}</strong>! Ready to create more
              memories?
            </div>
          </div>
        )}

        <h2 className="text-center mb-5 position-relative">
          <span className="position-relative px-4">
            Organize Your Memories
            <div
              className="position-absolute bottom-0 start-50 translate-middle-x"
              style={{
                height: "4px",
                width: "60px",
                backgroundColor: "#0d6efd",
              }}
            ></div>
          </span>
        </h2>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm rounded-4 text-center hover-card">
              <div className="card-body d-flex flex-column p-4">
                <div
                  className="icon-circle mx-auto mb-3 d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-images fs-2"></i>
                </div>
                <h4 className="card-title mb-3">Your Albums</h4>
                <p className="card-text text-muted flex-grow-1">
                  Access and manage all your personal collections in one
                  organized place.
                </p>
                <Link
                  to="/albums"
                  className="btn btn-outline-primary rounded-pill mt-3"
                >
                  Browse Albums <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm rounded-4 text-center hover-card">
              <div className="card-body d-flex flex-column p-4">
                <div
                  className="icon-circle mx-auto mb-3 d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-plus-circle fs-2"></i>
                </div>
                <h4 className="card-title mb-3">Create New Album</h4>
                <p className="card-text text-muted flex-grow-1">
                  Start a fresh collection to preserve your special moments and
                  memories.
                </p>
                <Link
                  to="/create-album"
                  className="btn btn-success rounded-pill mt-3"
                >
                  Create Album <i className="bi bi-plus-lg ms-2"></i>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm rounded-4 text-center hover-card">
              <div className="card-body d-flex flex-column p-4">
                <div
                  className="icon-circle mx-auto mb-3 d-flex align-items-center justify-content-center bg-info bg-opacity-10 text-info rounded-circle"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-people fs-2"></i>
                </div>
                <h4 className="card-title mb-3">Shared With You</h4>
                <p className="card-text text-muted flex-grow-1">
                  Discover albums that friends and family have shared with you.
                </p>
                <Link
                  to="/albums/shared"
                  className="btn btn-outline-info rounded-pill mt-3"
                >
                  View Shared <i className="bi bi-share ms-2"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row align-items-center mt-5 pt-5">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <img
              src="https://th.bing.com/th/id/OIG4.JjMVsGleD8btg9lVtKI.?pid=ImgGn"
              className="img-fluid rounded-4 shadow"
              alt="Features"
            />
          </div>
          <div className="col-lg-6">
            <h2 className="mb-4">Why Choose Our Platform?</h2>
            <div className="d-flex mb-3">
              <div
                className="feature-icon me-3 d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-3"
                style={{ minWidth: "48px", height: "48px" }}
              >
                <i className="bi bi-shield-check text-primary"></i>
              </div>
              <div>
                <h5>Secure Storage</h5>
                <p className="text-muted">
                  Your memories are safely stored with the highest security
                  standards.
                </p>
              </div>
            </div>
            <div className="d-flex mb-3">
              <div
                className="feature-icon me-3 d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-3"
                style={{ minWidth: "48px", height: "48px" }}
              >
                <i className="bi bi-share text-primary"></i>
              </div>
              <div>
                <h5>Easy Sharing</h5>
                <p className="text-muted">
                  Share your albums with friends and family with just a few
                  clicks.
                </p>
              </div>
            </div>
            <div className="d-flex">
              <div
                className="feature-icon me-3 d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-3"
                style={{ minWidth: "48px", height: "48px" }}
              >
                <i className="bi bi-phone text-primary"></i>
              </div>
              <div>
                <h5>Mobile Friendly</h5>
                <p className="text-muted">
                  Access your memories from any device, anytime, anywhere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary bg-opacity-10 py-5 mt-5">
        <div className="container text-center">
          <h2 className="mb-3">Ready to Start Preserving Your Memories?</h2>
          <p className="text-muted mb-4">
            Join thousands of users who trust us with their precious moments
          </p>
          <Link
            to={user ? "/create-album" : "/auth"}
            className="btn btn-primary btn-lg rounded-pill px-5"
          >
            {user ? "Create Your First Album" : "Sign Up For Free"}
          </Link>
        </div>
      </div>
    </div>
  );
}
