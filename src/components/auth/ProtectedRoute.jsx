import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait until Supabase finishes checking the session
  if (loading) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-slate-50
        "
      >
        <div className="text-center">

          <div
            className="
              mx-auto
              mb-6

              h-12
              w-12

              animate-spin

              rounded-full

              border-4
              border-blue-200
              border-t-blue-600
            "
          />

          <p
            className="
              text-lg

              font-medium

              text-slate-600
            "
          >
            Loading...
          </p>

        </div>
      </div>
    );
  }

  // User is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is logged in
  return children;
}