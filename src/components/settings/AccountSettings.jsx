import { useEffect, useState } from "react";
import {
  Check,
  Mail,
  User,
  CalendarDays,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

/* =========================================================
   ACCOUNT SETTINGS
========================================================= */

export default function AccountSettings() {
  const [user, setUser] = useState(null);

  const [fullName, setFullName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* =======================================================
     LOAD CURRENT USER
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      setLoading(true);
      setError("");

      const {
        data,
        error: userError,
      } = await supabase.auth.getUser();

      if (!mounted) {
        return;
      }

      if (userError) {
        console.error(
          "Failed to load user:",
          userError
        );

        setError(
          "Unable to load your account information."
        );

        setLoading(false);
        return;
      }

      const currentUser = data?.user || null;

      setUser(currentUser);

      setFullName(
        currentUser?.user_metadata?.full_name || ""
      );

      setLoading(false);
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     SAVE ACCOUNT INFORMATION
  ======================================================= */

  const handleSave = async () => {
    if (!user) {
      return;
    }

    setSaving(true);
    setSuccess("");
    setError("");

    const cleanName = fullName.trim();

    const {
      data,
      error: updateError,
    } = await supabase.auth.updateUser({
      data: {
        full_name: cleanName,
      },
    });

    if (updateError) {
      console.error(
        "Failed to update account:",
        updateError
      );

      setError(
        updateError.message ||
          "Failed to update your account."
      );

      setSaving(false);
      return;
    }

    if (data?.user) {
      setUser(data.user);
    }

    setSuccess(
      "Your account information has been updated."
    );

    setSaving(false);

    window.setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
          <Loader2
            size={20}
            className="animate-spin"
          />

          Loading account information...
        </div>
      </div>
    );
  }

  /* =======================================================
     NOT AUTHENTICATED
  ======================================================= */

  if (!user) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <div>
            <h3 className="font-black text-amber-900">
              No authenticated account
            </h3>

            <p className="mt-1 text-sm leading-6 text-amber-700">
              Please sign in to manage your account
              settings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <div className="space-y-8">
      {/* ===================================================
          ACCOUNT OVERVIEW
      =================================================== */}

      <section>
        <div className="mb-5">
          <h3 className="text-base font-black text-slate-900">
            Account Overview
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Basic information associated with your account.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* =================================================
              ACCOUNT STATUS
          ================================================= */}

          <InfoCard
            icon={ShieldCheck}
            label="Account Status"
            value="Active"
            valueClassName="text-emerald-600"
          />

          {/* =================================================
              EMAIL
          ================================================= */}

          <InfoCard
            icon={Mail}
            label="Email Address"
            value={user.email || "Not available"}
          />

          {/* =================================================
              CREATED DATE
          ================================================= */}

          <InfoCard
            icon={CalendarDays}
            label="Member Since"
            value={formatDate(user.created_at)}
          />

          {/* =================================================
              USER ID
          ================================================= */}

          <InfoCard
            icon={User}
            label="Account ID"
            value={formatAccountId(user.id)}
          />
        </div>
      </section>

      {/* ===================================================
          PERSONAL ACCOUNT INFORMATION
      =================================================== */}

      <section>
        <div className="mb-5">
          <h3 className="text-base font-black text-slate-900">
            Account Information
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Update the name associated with your account.
          </p>
        </div>

        <div className="space-y-5">
          {/* =================================================
              FULL NAME
          ================================================= */}

          <div>
            <label
              htmlFor="account-full-name"
              className="mb-1.5 block text-sm font-bold text-slate-700"
            >
              Full Name
            </label>

            <input
              id="account-full-name"
              type="text"
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value);
                setSuccess("");
                setError("");
              }}
              placeholder="Your full name"
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
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
          </div>

          {/* =================================================
              EMAIL
          ================================================= */}

          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={17}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="email"
                value={user.email || ""}
                disabled
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  pl-11
                  pr-4
                  text-sm
                  text-slate-500
                  outline-none
                  cursor-not-allowed
                "
              />
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Your login email is managed by your
              authentication provider.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================
          MESSAGES
      =================================================== */}

      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <Check
            size={19}
            className="mt-0.5 shrink-0 text-emerald-600"
          />

          <div>
            <p className="text-sm font-bold text-emerald-800">
              Saved successfully
            </p>

            <p className="mt-0.5 text-xs text-emerald-700">
              {success}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <div>
            <p className="text-sm font-bold text-red-800">
              Something went wrong
            </p>

            <p className="mt-0.5 text-xs text-red-700">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* ===================================================
          SAVE
      =================================================== */}

      <div className="flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold text-slate-800">
            Keep your account information up to date
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Your name can be reused across your resumes
            and cover letters.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="
            inline-flex
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-blue-600
            px-5
            py-2.5
            text-sm
            font-black
            text-white
            shadow-md
            shadow-blue-500/20
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {saving ? (
            <>
              <Loader2
                size={17}
                className="animate-spin"
              />

              Saving...
            </>
          ) : (
            <>
              <Check size={17} />

              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  icon: Icon,
  label,
  value,
  valueClassName = "text-slate-900",
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p
            className={`mt-1 truncate text-sm font-black ${valueClassName}`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date) {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* =========================================================
   FORMAT ACCOUNT ID
========================================================= */

function formatAccountId(id) {
  if (!id) {
    return "Not available";
  }

  if (id.length <= 12) {
    return id;
  }

  return `${id.slice(0, 8)}...${id.slice(-4)}`;
}