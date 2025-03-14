import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import store from "./app/store.js";
import { Provider } from "react-redux";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>{" "}
  </StrictMode>
);
