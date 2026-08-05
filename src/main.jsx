import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import AppRoutes from "./router/AppRoutes";

import { AuthProvider } from "./context/AuthContext";
import { ResumeProvider } from "./context/ResumeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ResumeProvider>
        <AppRoutes />
      </ResumeProvider>
    </AuthProvider>
  </React.StrictMode>
);