import { useState } from "react";
import { supabase } from "../../lib/supabase";

/* =========================================================
   SECURITY SETTINGS
========================================================= */

export default function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =======================================================
     CHANGE PASSWORD
  ======================================================= */

  const handleChangePassword = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    /* Validation */

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "Your new password must be at least 8 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "New password and confirmation password do not match."
      );
      return;
    }

    try {
      setLoading(true);

      /* -----------------------------------------------
         Get current authenticated user
      ------------------------------------------------ */

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user?.email) {
        throw new Error(
          "No authenticated user was found."
        );
      }

      /* -----------------------------------------------
         Verify current password
         
         Supabase does not provide a direct
         "verify password" method.

         We re-authenticate using the current
         credentials.
      ------------------------------------------------ */

      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });

      if (signInError) {
        throw new Error(
          "Your current password is incorrect."
        );
      }

      /* -----------------------------------------------
         Update password
      ------------------------------------------------ */

      const { error: updateError } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (updateError) {
        throw updateError;
      }

      /* -----------------------------------------------
         Success
      ------------------------------------------------ */

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage(
        "Your password has been updated successfully."
      );
    } catch (err) {
      console.error(
        "Password update error:",
        err
      );

      setError(
        err?.message ||
          "Something went wrong while updating your password."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     SIGN OUT OTHER SESSIONS
  ======================================================= */

  const handleSignOutOtherSessions = async () => {
    setMessage("");
    setError("");

    try {
      setLoading(true);

      /*
        Supabase supports global sign-out.

        This signs the user out of all sessions,
        including the current session.
      */

      const { error: signOutError } =
        await supabase.auth.signOut({
          scope: "global",
        });

      if (signOutError) {
        throw signOutError;
      }

      setMessage(
        "You have been signed out from all active sessions."
      );
    } catch (err) {
      console.error(
        "Global sign-out error:",
        err
      );

      setError(
        err?.message ||
          "Unable to sign out from other sessions."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <div className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
          Security
        </div>

        <h2 className="text-2xl font-black text-slate-900">
          Security Settings
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Manage your password and protect access to your
          account.
        </p>
      </div>

      {/* =================================================
          SECURITY STATUS
      ================================================= */}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-xl">
              🛡️
            </div>

            <div>
              <h3 className="font-black text-slate-900">
                Account Security
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Keep your password strong and never share it
                with anyone.
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Protected
          </div>
        </div>
      </section>

      {/* =================================================
          CHANGE PASSWORD
      ================================================= */}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-7">
          <h3 className="text-lg font-black text-slate-900">
            Change Password
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Choose a strong password that you do not use
            elsewhere.
          </p>
        </div>

        <form
          onSubmit={handleChangePassword}
          className="space-y-5"
        >
          {/* Current Password */}

          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            visible={showCurrentPassword}
            onToggle={() =>
              setShowCurrentPassword(
                (previous) => !previous
              )
            }
            placeholder="Enter your current password"
          />

          {/* New Password */}

          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            visible={showNewPassword}
            onToggle={() =>
              setShowNewPassword(
                (previous) => !previous
              )
            }
            placeholder="Enter your new password"
          />

          {/* Password requirements */}

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold text-slate-700">
              Password requirements
            </p>

            <ul className="mt-3 space-y-2 text-xs text-slate-500">
              <li>
                • At least 8 characters
              </li>

              <li>
                • Avoid using easily guessed information
              </li>

              <li>
                • Do not reuse passwords from other accounts
              </li>
            </ul>
          </div>

          {/* Confirm Password */}

          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            visible={showConfirmPassword}
            onToggle={() =>
              setShowConfirmPassword(
                (previous) => !previous
              )
            }
            placeholder="Confirm your new password"
          />

          {/* Error */}

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* Success */}

          {message && (
            <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {message}
            </div>
          )}

          {/* Submit */}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                px-6
                py-3
                text-sm
                font-black
                text-white
                shadow-md
                shadow-blue-500/20
                transition
                hover:-translate-y-0.5
                hover:shadow-lg
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading
                ? "Updating..."
                : "Update Password"}
            </button>
          </div>
        </form>
      </section>

      {/* =================================================
          SESSION SECURITY
      ================================================= */}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Active Sessions
            </h3>

            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
              If you think someone else has access to your
              account, sign out from all active sessions.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignOutOtherSessions}
            disabled={loading}
            className="
              shrink-0
              rounded-xl
              border
              border-slate-200
              bg-white
              px-5
              py-2.5
              text-sm
              font-bold
              text-slate-700
              transition
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            Sign Out All Sessions
          </button>
        </div>
      </section>

      {/* =================================================
          SECURITY TIPS
      ================================================= */}

      <section className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
        <h3 className="font-black text-slate-900">
          Security Tips
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <SecurityTip
            title="Use a strong password"
            text="Use a password that is difficult for others to guess."
          />

          <SecurityTip
            title="Never share your password"
            text="Our team will never ask you for your password."
          />

          <SecurityTip
            title="Check your account"
            text="If something looks unusual, change your password immediately."
          />
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   PASSWORD INPUT
========================================================= */

function PasswordInput({
  label,
  value,
  onChange,
  visible,
  onToggle,
  placeholder,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          autoComplete="off"
          className="
            h-11
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            pr-12
            text-sm
            text-slate-800
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-100
          "
        />

        <button
          type="button"
          onClick={onToggle}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            rounded-lg
            px-2
            py-1
            text-xs
            font-bold
            text-slate-500
            transition
            hover:bg-slate-100
            hover:text-slate-800
          "
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </label>
  );
}

/* =========================================================
   SECURITY TIP
========================================================= */

function SecurityTip({
  title,
  text,
}) {
  return (
    <div className="rounded-2xl bg-white/70 p-4">
      <h4 className="text-sm font-bold text-slate-800">
        {title}
      </h4>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}