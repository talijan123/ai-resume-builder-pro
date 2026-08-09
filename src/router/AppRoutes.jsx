import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ResumeBuilder from "../pages/ResumeBuilder";
import Templates from "../pages/Templates";
import Settings from "../pages/Settings";
import MyResumes from "../pages/MyResumes";
import CoverLetter from "../pages/CoverLetter";
import MyProfile from "../pages/MyProfile";
import NotFound from "../pages/NotFound";

import ProtectedRoute from "../components/auth/ProtectedRoute";

import { ProfileProvider } from "../context/ProfileContext";

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
              <CoverLetter />
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
              <ProfileProvider>
                <MyProfile />
              </ProfileProvider>
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
              <Settings />
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