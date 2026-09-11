import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

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
import MyCoverLetters from "../pages/MyCoverLetters";
import CoverLetter from "../pages/CoverLetter";
import MyProfile from "../pages/MyProfile";
import NotFound from "../pages/NotFound";
import Checkout from "../pages/Checkout";
import PaymentCallback from "../pages/PaymentCallback";
import TestCheckout from "../pages/TestCheckout";
import Blog from "../pages/Blog";
import BlogPost from "../pages/BlogPost";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService";
import Contact from "../pages/Contact";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import TopLoader from "../components/common/TopLoader";
import ScrollToTop from "../components/common/ScrollToTop";
import PageTransition from "../components/common/PageTransition";
import { Toaster } from "sonner";

import { CoverLetterProvider } from "../context/CoverLetterContext";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <TopLoader />
      <ScrollToTop />
      <Toaster
        theme="dark"
        position="top-right"
        duration={3000}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#0f172a",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#f8fafc",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
            borderRadius: "16px",
            padding: "14px 18px",
          },
          className: "border border-white/10 bg-[#0f172a] text-white shadow-2xl rounded-2xl font-sans",
        }}
      />
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={location.pathname}>
          <Routes location={location}>
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
          path="/blog"
          element={<Blog />}
        />

        <Route
          path="/blog/:slug"
          element={<BlogPost />}
        />

        <Route
          path="/privacy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/terms"
          element={<TermsOfService />}
        />

        <Route
          path="/contact"
          element={<Contact />}
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

        <Route
          path="/my-cover-letters"
          element={
            <ProtectedRoute>
              <CoverLetterProvider>
                <MyCoverLetters />
              </CoverLetterProvider>
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

        <Route
          path="/cover-letter/:id"
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
              <Settings />
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
    </PageTransition>
  </AnimatePresence>
</>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}