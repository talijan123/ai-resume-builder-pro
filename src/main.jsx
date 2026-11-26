import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import AppRoutes from "./router/AppRoutes";

import { AuthProvider } from "./context/AuthContext";
import { ResumeProvider } from "./context/ResumeContext";
import { PricingProvider } from "./context/PricingContext";
import { ProfileProvider } from "./context/ProfileContext";
import { SettingsProvider } from "./context/SettingsContext";

// Optional Google Analytics 4 (GA4) Environment Loader
const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (gaMeasurementId && typeof window !== "undefined") {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", gaMeasurementId, {
    send_page_view: true,
  });
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <AuthProvider>
      <ResumeProvider>
        <PricingProvider>
          <ProfileProvider>
            <SettingsProvider>
              <AppRoutes />
            </SettingsProvider>
          </ProfileProvider>
        </PricingProvider>
      </ResumeProvider>
    </AuthProvider>
  </React.StrictMode>
);