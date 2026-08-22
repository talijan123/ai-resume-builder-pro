import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../pages/Dashboard";
import ResumeBuilder from "../pages/ResumeBuilder";
import Templates from "../pages/Templates";
import Settings from "../pages/Settings";
import MyResumes from "../pages/MyResumes";
import CoverLetter from "../pages/CoverLetter";
import MyProfile from "../pages/MyProfile";
import NotFound from "../pages/NotFound";
import Checkout from "../pages/Checkout";
import PaymentCallback from "../pages/PaymentCallback";
import TestCheckout from "../pages/TestCheckout";

import ProtectedRoute from "../components/auth/ProtectedRoute";

import { ProfileProvider } from "../context/ProfileContext";
import { SettingsProvider } from "../context/SettingsContext";
import { CoverLetterProvider } from "../context/CoverLetterContext";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================================================
            PUBLIC ROUTES
        ====================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/templates"
          element={<Templates />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* =====================================================
            PROTECTED ROUTES
        ====================================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            RESUME BUILDER
        ====================================================== */}

        {/* Create New Resume */}

        <Route
          path="/builder"
          element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          }
        />

        {/* Edit Existing Resume */}

        <Route
          path="/builder/:id"
          element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            MY RESUMES
        ====================================================== */}

        <Route
          path="/my-resumes"
          element={
            <ProtectedRoute>
              <MyResumes />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            COVER LETTER
        ====================================================== */}

        <Route
          path="/cover-letter"
          element={
            <ProtectedRoute>
              <CoverLetterProvider>
                <CoverLetter />
              </CoverLetterProvider>
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            MY PROFILE
        ====================================================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            SETTINGS
        ====================================================== */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsProvider>
                <Settings />
              </SettingsProvider>
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            PAYMENT CALLBACK (SAFEPAY REDIRECT)
        ====================================================== */}

        <Route
          path="/payment/callback"
          element={
            <ProtectedRoute>
              <PaymentCallback />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            NORMAL CHECKOUT
        ====================================================== */}

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            TEST CHECKOUT
        ======================================================

            Examples:

            /test-checkout?plan=pro&billing=monthly

            /test-checkout?plan=pro&billing=yearly

            /test-checkout?plan=team&billing=monthly

            /test-checkout?plan=team&billing=yearly

            This is only for testing our payment flow.
            No real money is charged.

        ====================================================== */}

        <Route
          path="/test-checkout"
          element={
            <ProtectedRoute>
              <TestCheckout />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            404
        ====================================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}