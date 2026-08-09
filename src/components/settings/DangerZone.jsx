import { useState } from "react";
import { useSettings } from "../../context/SettingsContext";

export default function DangerZone() {
  const {
    deleteAccount,
    resetSettings,
  } = useSettings();

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [showResetConfirm, setShowResetConfirm] =
    useState(false);

  const [deleteText, setDeleteText] = useState("");

  /* =========================================================
     RESET SETTINGS
  ========================================================= */

  const handleResetSettings = () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      return;
    }

    resetSettings();
    setShowResetConfirm(false);
  };

  /* =========================================================
     DELETE ACCOUNT
  ========================================================= */

  const handleDeleteAccount = () => {
    if (deleteText !== "DELETE") {
      return;
    }

    deleteAccount();
    setShowDeleteConfirm(false);
    setDeleteText("");
  };

  return (
    <section className="rounded-3xl border border-red-200 bg-white shadow-sm">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-red-100 bg-red-50/60 p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-xl">
            ⚠️
          </div>

          <div>
            <h2 className="text-lg font-black text-red-700">
              Danger Zone
            </h2>

            <p className="mt-1 text-sm leading-6 text-red-600/80">
              These actions can affect your saved settings
              and account data. Please proceed carefully.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          RESET SETTINGS
      ===================================================== */}

      <div className="border-b border-slate-200 p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-black text-slate-900">
              Reset Settings
            </h3>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Restore all application settings to their
              default values. Your profile, resumes, and
              cover letters will not be deleted.
            </p>
          </div>

          {!showResetConfirm ? (
            <button
              type="button"
              onClick={handleResetSettings}
              className="
                shrink-0
                rounded-xl
                border
                border-slate-300
                bg-white
                px-5
                py-2.5
                text-sm
                font-bold
                text-slate-700
                transition
                hover:border-slate-400
                hover:bg-slate-50
              "
            >
              Reset Settings
            </button>
          ) : (
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setShowResetConfirm(false)
                }
                className="
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-slate-600
                  transition
                  hover:bg-slate-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleResetSettings}
                className="
                  rounded-xl
                  bg-slate-900
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-slate-800
                "
              >
                Confirm Reset
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          DELETE ACCOUNT
      ===================================================== */}

      <div className="p-6">
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="font-black text-red-700">
              Delete Account
            </h3>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Permanently delete your account and associated
              application data. This action cannot be undone.
            </p>
          </div>

          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() =>
                setShowDeleteConfirm(true)
              }
              className="
                w-fit
                rounded-xl
                border
                border-red-200
                bg-white
                px-5
                py-2.5
                text-sm
                font-bold
                text-red-600
                transition
                hover:border-red-300
                hover:bg-red-50
              "
            >
              Delete Account
            </button>
          ) : (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <div className="mb-5">
                <h4 className="font-black text-red-700">
                  Are you absolutely sure?
                </h4>

                <p className="mt-1 text-sm leading-6 text-red-600/80">
                  This will permanently remove your account
                  and its data. There is no undo after this
                  action.
                </p>
              </div>

              {/* Confirmation */}

              <div className="max-w-md">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-wider text-red-700">
                    Type DELETE to confirm
                  </span>

                  <input
                    type="text"
                    value={deleteText}
                    onChange={(event) =>
                      setDeleteText(
                        event.target.value
                      )
                    }
                    placeholder="DELETE"
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-red-200
                      bg-white
                      px-4
                      text-sm
                      font-semibold
                      text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-red-400
                      focus:ring-4
                      focus:ring-red-100
                    "
                  />
                </label>
              </div>

              {/* Actions */}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteText("");
                  }}
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-bold
                    text-slate-600
                    transition
                    hover:bg-slate-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    deleteText !== "DELETE"
                  }
                  onClick={handleDeleteAccount}
                  className="
                    rounded-xl
                    bg-red-600
                    px-5
                    py-2.5
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-red-700
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  Permanently Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}