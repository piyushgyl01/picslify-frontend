import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, registerUser, clearError } from "./authSlice";

export default function Auth() {
  const location = useLocation();
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(
    location.state?.isLogin !== undefined ? location.state.isLogin : true
  );
  const [success, setSuccess] = useState("");

  const dispatch = useDispatch();
  const { status, error, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (error || !location.state) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(clearError());
    }
  }, []);

  useEffect(() => {
    if (status === "succeeded" && isAuthenticated) {
      navigate("/");
    }
  }, [status, isAuthenticated, navigate]);

  useEffect(() => {
    if (status === "succeeded" && !isAuthenticated && !isLogin) {
      setSuccess(
        "Registration successful! Please login with your credentials."
      );
      setIsLogin(true);
      setUserData({
        name: "",
        username: userData.username,
        password: "",
      });
    }
  }, [status, isLogin, isAuthenticated, userData.username]);

  function handleChange(e) {
    setUserData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSuccess("");

    if (isLogin) {
      dispatch(loginUser(userData));
    } else {
      dispatch(registerUser(userData));
    }
  }

  return (
    <main className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="text-center mb-4">
            <div
              className="btn-group mb-4"
              role="group"
              aria-label="Login/Register"
            >
              <input
                type="radio"
                name="authType"
                id="login"
                className="btn-check"
                autoComplete="off"
                checked={isLogin}
                onChange={() => setIsLogin(true)}
              />
              <label htmlFor="login" className="btn btn-outline-primary">
                Login
              </label>
              <input
                type="radio"
                name="authType"
                id="register"
                className="btn-check"
                autoComplete="off"
                checked={!isLogin}
                onChange={() => setIsLogin(false)}
              />
              <label htmlFor="register" className="btn btn-outline-primary">
                Register
              </label>
            </div>
          </div>

          <h2 className="text-center mb-4">{isLogin ? "Login" : "Register"}</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="name" className="form-label">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  value={userData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="username" className="form-label">
                Username:
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={userData.username}
                onChange={handleChange}
                required
                placeholder="johndoe_1234"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={userData.password}
                onChange={handleChange}
                required
                placeholder="Password should be strong"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === "loading"}
              >
                {status === "loading"
                  ? "Loading..."
                  : isLogin
                  ? "Login"
                  : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}