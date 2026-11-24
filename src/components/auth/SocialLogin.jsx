import { FcGoogle } from "react-icons/fc";
import { supabase } from "../../lib/supabase";

export default function SocialLogin() {
  async function handleGoogleLogin() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        alert(`Authentication failed: ${error.message}`);
      }
    } catch (err) {
      alert(`An error occurred: ${err.message}`);
    }
  }

  return (
    <div className="space-y-6">

      {/* Divider */}

      <div className="flex items-center gap-4">

        <div className="h-px flex-1 bg-slate-200" />

        <span
          className="
            text-sm

            font-medium

            text-slate-500
          "
        >
          OR
        </span>

        <div className="h-px flex-1 bg-slate-200" />

      </div>

      {/* Google Button */}

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="
          flex
          w-full

          items-center
          justify-center

          gap-3

          rounded-2xl

          border
          border-slate-300

          bg-white

          py-4

          font-semibold

          text-slate-700

          shadow-sm

          transition-all
          duration-300

          hover:border-blue-500
          hover:bg-blue-50
          hover:shadow-md

          active:scale-[0.98]
        "
      >
        <FcGoogle size={24} />

        <span>
          Continue with Google
        </span>
      </button>

    </div>
  );
}