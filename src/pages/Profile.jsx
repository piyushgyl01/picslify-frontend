import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BsPersonCircle,
  BsKey,
  BsCheckCircle,
  BsExclamationCircle,
} from "react-icons/bs";
import {
  clearPasswordError,
  clearPasswordMessage,
  clearProfileMessage,
  fetchProfile,
  updatePassword,
  updateProfile,
} from "../features/profile/profileSlice";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Profile() {
  const dispatch = useDispatch();
  const {
    user,
    status,
    error,
    message,
    passwordStatus,
    passwordError,
    passwordMessage,
  } = useSelector((state) => state.profile);

  const [profileData, setProfileData] = useState({
    name: "",
    profilePicture: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        profilePicture: user.profilePicture || "",
      });
    }
  }, [user]);

  useEffect(() => {
    let timeoutId;
    if (message) {
      timeoutId = setTimeout(() => {
        dispatch(clearProfileMessage());
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [message, dispatch]);

  useEffect(() => {
    let timeoutId;
    if (passwordMessage) {
      timeoutId = setTimeout(() => {
        dispatch(clearPasswordMessage());
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [passwordMessage, dispatch]);

  // Add this useEffect
  useEffect(() => {
    if (passwordMessage && !passwordError && passwordStatus === "succeeded") {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [passwordMessage, passwordError, passwordStatus]);

  function handleProfileChange(e) {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleProfileUpdate(e) {
    e.preventDefault();
    dispatch(updateProfile(profileData));
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handlePasswordUpdate(e) {
    e.preventDefault();

    dispatch(clearPasswordError());

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return dispatch({
        type: "profile/updatePassword/rejected",
        payload: { message: "New passwords do not match" },
      });
    }

    if (passwordData.newPassword.length < 6) {
      return dispatch({
        type: "profile/updatePassword/rejected",
        payload: { message: "New password must be at least 6 characters long" },
      });
    }

    dispatch(
      updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
    );
  }

  if (status === "loading" && !user) {
    return <LoadingSpinner />;
  }
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white p-4 border-0">
              <h2 className="card-title mb-0 fw-bold">Your Profile</h2>
            </div>
            <div className="card-body p-4">
              <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "profile" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <BsPersonCircle className="me-2" />
                    Profile
                  </button>
                </li>{" "}
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "password" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("password")}
                  >
                    <BsKey className="me-2" />
                    Change Password
                  </button>
                </li>
              </ul>
              {activeTab === "profile" && (
                <div>
                  {error && (
                    <div
                      className="alert alert-danger d-flex align-items-center"
                      role="alert"
                    >
                      <BsExclamationCircle className="me-2" />
                      {error}
                    </div>
                  )}
                  {message && (
                    <div
                      className="alert alert-success d-flex align-items-center"
                      role="alert"
                    >
                      <BsCheckCircle className="me-2" />
                      {message}
                    </div>
                  )}
                  <form onSubmit={handleProfileUpdate}>
                    <div className="mb-4">
                      <label
                        htmlFor="username"
                        className="form-label text-muted small fw-semibold"
                      >
                        USERNAME
                      </label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        id="username"
                        name="username"
                        value={user?.username || ""}
                        disabled
                      />
                      <div className="form-text">
                        Username cannot be changed
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="form-label text-muted small fw-semibold"
                      >
                        NAME
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="profilePicture"
                        className="form-label text-muted small fw-semibold"
                      >
                        PROFILE PICTURE URL
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        id="profilePicture"
                        name="profilePicture"
                        value={profileData.profilePicture}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    {profileData.profilePicture && (
                      <div className="mb-4 text-center">
                        <label
                          htmlFor="profilePicture"
                          className="form-label text-muted small fw-semibold"
                        >
                          PROFILE PICTURE PREVIEW
                        </label>
                        <img
                          src={profileData.profilePicture}
                          alt="profile-pic"
                          className="rounded-circle img-thumbnail"
                          style={{
                            width: "150px",
                            objectFit: "cover",
                            height: "150px",
                          }}
                        />
                      </div>
                    )}
                    <div className="d-grid gap-2 mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={status === "loading"}
                      >
                        {status === "loading" ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Updating...
                          </>
                        ) : (
                          "Update Profile"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "password" && (
                <div>
                  {passwordError && (
                    <div
                      className="alert alert-danger d-flex align-items-center"
                      role="alert"
                    >
                      <BsExclamationCircle className="me-2" />
                      {passwordError}
                    </div>
                  )}
                  {passwordMessage && (
                    <div
                      className="alert alert-success d-flex align-items-center"
                      role="alert"
                    >
                      <BsCheckCircle className="me-2" />
                      {passwordMessage}
                    </div>
                  )}
                  <form onSubmit={handlePasswordUpdate}>
                    <div className="mb-4">
                      <label
                        htmlFor="currentPassword"
                        className="form-label text-muted small fw-semibold"
                      >
                        CURRENT PASSWORD
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="newPassword"
                        className="form-label text-muted small fw-semibold"
                      >
                        NEW PASSWORD
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                      <div className="form-text">
                        Password must be at least 6 characters long
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="confirmPassword"
                        className="form-label text-muted small fw-semibold"
                      >
                        CONFIRM NEW PASSWORD
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    <div className="d-grid gap-2 mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={passwordStatus === "loading"}
                      >
                        {passwordStatus === "loading" ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Updating Password...
                          </>
                        ) : (
                          "Change Password"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
