import { useState } from "react";

import {
  Eye,
  EyeOff,
  Lock,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from "lucide-react";

import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

/* =========================================================
   SECURITY SETTINGS
========================================================= */

export default function SecuritySettings() {
  const { user } = useAuth();

  /* =======================================================
     STATE
  ======================================================= */

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [signingOut, setSigningOut] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  /* =======================================================
     PASSWORD STRENGTH
  ======================================================= */

  const getPasswordStrength = (password) => {
    if (!password) {
      return {
        label: "",
        percentage: 0,
        level: 0,
      };
    }

    let score = 0;

    if (password.length >= 8) {
      score += 1;
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    }

    if (score <= 2) {
      return {
        label: "Weak",
        percentage: 35,
        level: 1,
      };
    }

    if (score === 3) {
      return {
        label: "Fair",
        percentage: 55,
        level: 2,
      };
    }

    if (score === 4) {
      return {
        label: "Good",
        percentage: 75,
        level: 3,
      };
    }

    return {
      label: "Strong",
      percentage: 100,
      level: 4,
    };
  };

  const passwordStrength =
    getPasswordStrength(newPassword);

  /* =======================================================
     VALIDATE PASSWORD
  ======================================================= */

  const validatePassword = () => {
    if (!newPassword) {
      return "Please enter a new password.";
    }

    if (newPassword.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (!/[A-Z]/.test(newPassword)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(newPassword)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (!/[0-9]/.test(newPassword)) {
      return "Password must contain at least one number.";
    }

    if (newPassword !== confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  /* =======================================================
     CHANGE PASSWORD
  ======================================================= */

  const handleChangePassword = async (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const validationError =
      validatePassword();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (!user) {
      setErrorMessage(
        "You must be logged in to change your password."
      );
      return;
    }

    try {
      setSaving(true);

      /*
        Supabase Auth handles the password update.

        Passwords are NOT stored in the profiles table.
      */

      const {
        error,
      } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccessMessage(
        "Your password has been updated successfully."
      );
    } catch (error) {
      console.error(
        "Password update failed:",
        error
      );

      setErrorMessage(
        error?.message ||
          "Unable to update your password. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     SIGN OUT
  ======================================================= */

  const handleSignOutEverywhere =
    async () => {
      setSuccessMessage("");
      setErrorMessage("");

      try {
        setSigningOut(true);

        const {
          error,
        } = await supabase.auth.signOut({
          scope: "global",
        });

        if (error) {
          throw error;
        }

        /*
          AuthContext should detect the
          SIGNED_OUT event and redirect
          the user according to your app's
          authentication flow.
        */
      } catch (error) {
        console.error(
          "Global sign out failed:",
          error
        );

        setErrorMessage(
          error?.message ||
            "Unable to sign out from all sessions."
        );
      } finally {
        setSigningOut(false);
      }
    };

  /* =======================================================
     USER EMAIL
  ======================================================= */

  const email =
    user?.email || "Your account";

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="space-y-6">

      {/* ===================================================
          SECURITY OVERVIEW
      =================================================== */}

      <section
        className="
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <div
          className="
            border-b
            border-slate-100
            bg-gradient-to-br
            from-slate-50
            via-white
            to-blue-50/40
            dark:from-slate-900
            dark:via-slate-900
            dark:to-blue-500/10
            p-6
            sm:p-7
          "
        >
          <div className="flex items-start gap-4">

            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-blue-100
                text-blue-600
              "
            >
              <ShieldCheck
                size={24}
              />
            </div>

            <div>
              <h2
                className="
                  text-xl
                  font-black
                  tracking-tight
                  text-slate-900
                "
              >
                Security
              </h2>

              <p
                className="
                  mt-1
                  max-w-2xl
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                Manage your password and
                protect your account.
              </p>
            </div>

          </div>
        </div>

        {/* Account information */}

        <div className="p-6 sm:p-7">

          <div
            className="
              flex
              flex-col
              gap-4
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-white
                  text-slate-600
                  shadow-sm
                "
              >
                <Lock size={18} />
              </div>

              <div>
                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Signed in as
                </p>

                <p
                  className="
                    mt-0.5
                    break-all
                    text-sm
                    font-bold
                    text-slate-800
                  "
                >
                  {email}
                </p>
              </div>

            </div>

            <div
              className="
                inline-flex
                w-fit
                items-center
                gap-1.5
                rounded-full
                bg-emerald-50
                px-3
                py-1.5
                text-xs
                font-bold
                text-emerald-700
              "
            >
              <CheckCircle2 size={14} />
              Account secured
            </div>

          </div>

        </div>
      </section>

      {/* ===================================================
          CHANGE PASSWORD
      =================================================== */}

      <section
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
          sm:p-7
        "
      >
        <div
          className="
            mb-7
            flex
            items-start
            gap-4
          "
        >

          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-indigo-50
              text-indigo-600
            "
          >
            <KeyRound size={21} />
          </div>

          <div>
            <h3
              className="
                text-lg
                font-black
                text-slate-900
              "
            >
              Change Password
            </h3>

            <p
              className="
                mt-1
                text-sm
                leading-6
                text-slate-500
              "
            >
              Choose a strong password that
              you don't use on other websites.
            </p>
          </div>

        </div>

        {/* Messages */}

        {successMessage && (
          <div
            className="
              mb-6
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-emerald-200
              bg-emerald-50
              p-4
              text-sm
              font-semibold
              text-emerald-700
            "
          >
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span>
              {successMessage}
            </span>
          </div>
        )}

        {errorMessage && (
          <div
            className="
              mb-6
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-red-200
              bg-red-50
              p-4
              text-sm
              font-semibold
              text-red-700
            "
          >
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span>
              {errorMessage}
            </span>
          </div>
        )}

        <form
          onSubmit={
            handleChangePassword
          }
          className="space-y-5"
        >

          {/* Current password */}

          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChange={
              setCurrentPassword
            }
            visible={
              showCurrentPassword
            }
            onToggle={() =>
              setShowCurrentPassword(
                (value) => !value
              )
            }
          />

          {/* New password */}

          <div>
            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              visible={
                showNewPassword
              }
              onToggle={() =>
                setShowNewPassword(
                  (value) => !value
                )
              }
            />

            {/* Password strength */}

            {newPassword && (
              <div className="mt-3">

                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      text-xs
                      font-semibold
                      text-slate-500
                    "
                  >
                    Password strength
                  </span>

                  <span
                    className="
                      text-xs
                      font-bold
                      text-slate-700
                    "
                  >
                    {passwordStrength.label}
                  </span>
                </div>

                <div
                  className="
                    h-1.5
                    overflow-hidden
                    rounded-full
                    bg-slate-100
                  "
                >
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-blue-600
                      transition-all
                      duration-300
                    "
                    style={{
                      width: `${passwordStrength.percentage}%`,
                    }}
                  />
                </div>

              </div>
            )}
          </div>

          {/* Confirm password */}

          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChange={
              setConfirmPassword
            }
            visible={
              showConfirmPassword
            }
            onToggle={() =>
              setShowConfirmPassword(
                (value) => !value
              )
            }
          />

          {/* Requirements */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-4
            "
          >
            <p
              className="
                mb-3
                text-xs
                font-black
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Password requirements
            </p>

            <div
              className="
                grid
                gap-2
                sm:grid-cols-2
              "
            >
              <Requirement
                valid={
                  newPassword.length >= 8
                }
                text="At least 8 characters"
              />

              <Requirement
                valid={
                  /[A-Z]/.test(
                    newPassword
                  )
                }
                text="One uppercase letter"
              />

              <Requirement
                valid={
                  /[a-z]/.test(
                    newPassword
                  )
                }
                text="One lowercase letter"
              />

              <Requirement
                valid={
                  /[0-9]/.test(
                    newPassword
                  )
                }
                text="One number"
              />
            </div>
          </div>

          {/* Submit */}

          <div className="flex justify-end pt-2">

            <button
              type="submit"
              disabled={saving}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
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
              <Lock size={16} />

              {saving
                ? "Updating..."
                : "Update Password"}
            </button>

          </div>

        </form>
      </section>

      {/* ===================================================
          SESSION SECURITY
      =================================================== */}

      <section
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
          sm:p-7
        "
      >

        <div
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div className="flex items-start gap-4">

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-slate-100
                text-slate-600
              "
            >
              <LogOut size={20} />
            </div>

            <div>
              <h3
                className="
                  text-lg
                  font-black
                  text-slate-900
                "
              >
                Active Sessions
              </h3>

              <p
                className="
                  mt-1
                  max-w-xl
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                Sign out of your account on
                all other devices and browsers.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={
              handleSignOutEverywhere
            }
            disabled={signingOut}
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
              hover:border-red-200
              hover:bg-red-50
              hover:text-red-600
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {signingOut
              ? "Signing out..."
              : "Sign Out Everywhere"}
          </button>

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
}) {
  return (
    <label className="block">

      <span
        className="
          mb-1.5
          block
          text-sm
          font-bold
          text-slate-700
        "
      >
        {label}
      </span>

      <div className="relative">

        <input
          type={
            visible
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
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
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-100
          "
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            visible
              ? "Hide password"
              : "Show password"
          }
          className="
            absolute
            right-2
            top-1/2
            flex
            h-8
            w-8
            -translate-y-1/2
            items-center
            justify-center
            rounded-lg
            text-slate-400
            transition
            hover:bg-slate-100
            hover:text-slate-700
          "
        >
          {visible ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>

      </div>

    </label>
  );
}

/* =========================================================
   REQUIREMENT
========================================================= */

function Requirement({
  valid,
  text,
}) {
  return (
    <div
      className={`
        flex
        items-center
        gap-2
        text-xs
        font-semibold
        ${
          valid
            ? "text-emerald-600"
            : "text-slate-400"
        }
      `}
    >
      <CheckCircle2
        size={14}
        className="shrink-0"
      />

      <span>{text}</span>
    </div>
  );
}