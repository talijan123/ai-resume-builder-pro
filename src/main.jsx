import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import AppRoutes from "./router/AppRoutes";

import { AuthProvider } from "./context/AuthContext";
import { ResumeProvider } from "./context/ResumeContext";
import { PricingProvider } from "./context/PricingContext";
import { ProfileProvider } from "./context/ProfileContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <AuthProvider>
      <ResumeProvider>
        <PricingProvider>
          <ProfileProvider>
            <AppRoutes />
          </ProfileProvider>
        </PricingProvider>
      </ResumeProvider>
    </AuthProvider>
  </React.StrictMode>
);