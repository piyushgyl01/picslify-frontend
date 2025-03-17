import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";

export default function Nav() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  function handleLogout() {
    dispatch(logoutUser());
  }
  return (
    <div className="position-absolute top-0 start-0 w-100">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-dark py-3">
          <div className="container-fluid">
            <Link className="navbar-brand fs-3 fw-bold" to="/">
              Picsilfy
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                {user && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/albums">
                        Albums
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/create-album">
                       Create Album
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/albums/shared">
                        Shared
                      </Link>
                    </li>
                  </>
                )}
                {user ? (
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      {user.name}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          Profile
                        </Link>
                      </li>
                      {/* <li>
                        <Link className="dropdown-item" to="/settings">
                          Settings
                        </Link>
                      </li> */}
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" to="/auth">
                      Register / Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
