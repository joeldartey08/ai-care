import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthStore from "./stores/AuthStore.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthStore>
        <App />
      </AuthStore>
    </BrowserRouter>
  </StrictMode>,
);
