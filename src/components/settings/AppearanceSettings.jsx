import { useEffect, useState } from "react";
import {
  Check,
  Monitor,
  Moon,
  Sun,
  Layout,
} from "lucide-react";

import { useSettings } from "../../context/SettingsContext";

/* =========================================================
   APPEARANCE SETTINGS
========================================================= */

export default function AppearanceSettings() {
  const {
    settings,
    updateAppearance,
  } = useSettings();

  const appearance = settings?.appearance || {};

  const [theme, setTheme] = useState(
    appearance.theme || "system"
  );

  const [density, setDensity] = useState(
    appearance.density || "comfortable"
  );

  const [saved, setSaved] = useState(false);

  /* =======================================================
     SYNC WITH CONTEXT
  ======================================================= */

  useEffect(() => {
    setTheme(
      appearance.theme || "system"
    );

    setDensity(
      appearance.density || "comfortable"
    );
  }, [
    appearance.theme,
    appearance.density,
  ]);

  /* =======================================================
     THEME CHANGE
  ======================================================= */

  const handleThemeChange = (value) => {
    setTheme(value);

    updateAppearance("theme", value);

    setSaved(false);

    /*
      Apply theme immediately.
      The actual SettingsContext can also
      persist this preference.
    */

    applyTheme(value);
  };

  /* =======================================================
     DENSITY CHANGE
  ======================================================= */

  const handleDensityChange = (value) => {
    setDensity(value);

    updateAppearance(
      "density",
      value
    );

    setSaved(false);
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave = () => {
    updateAppearance("theme", theme);
    updateAppearance(
      "density",
      density
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="space-y-8">
      {/* ===================================================
          THEME
      =================================================== */}

      <section>
        <div className="mb-5">
          <h3 className="text-base font-black text-slate-900">
            Theme
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Choose how Resume Builder should appear on
            your device.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <ThemeOption
            value="light"
            selected={theme === "light"}
            onClick={() =>
              handleThemeChange("light")
            }
            icon={Sun}
            title="Light"
            description="Always use the light theme."
          />

          <ThemeOption
            value="dark"
            selected={theme === "dark"}
            onClick={() =>
              handleThemeChange("dark")
            }
            icon={Moon}
            title="Dark"
            description="Always use the dark theme."
            dark
          />

          <ThemeOption
            value="system"
            selected={theme === "system"}
            onClick={() =>
              handleThemeChange("system")
            }
            icon={Monitor}
            title="System"
            description="Follow your device preference."
          />
        </div>
      </section>

      {/* ===================================================
          INTERFACE DENSITY
      =================================================== */}

      <section>
        <div className="mb-5">
          <h3 className="text-base font-black text-slate-900">
            Interface Density
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Choose how much spacing you want throughout
            the application.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <DensityOption
            value="comfortable"
            selected={
              density === "comfortable"
            }
            onClick={() =>
              handleDensityChange(
                "comfortable"
              )
            }
            title="Comfortable"
            description="More spacing and easier reading."
          />

          <DensityOption
            value="compact"
            selected={
              density === "compact"
            }
            onClick={() =>
              handleDensityChange(
                "compact"
              )
            }
            title="Compact"
            description="Less spacing and more information on screen."
          />
        </div>
      </section>

      {/* ===================================================
          PREVIEW
      =================================================== */}

      <section>
        <div className="mb-5">
          <h3 className="text-base font-black text-slate-900">
            Preview
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Preview how your selected appearance settings
            will feel.
          </p>
        </div>

        <div
          className={`
            overflow-hidden
            rounded-2xl
            border
            transition-all
            duration-300
            ${
              theme === "dark"
                ? "border-slate-700 bg-slate-900"
                : "border-slate-200 bg-white"
            }
          `}
        >
          {/* Preview Header */}

          <div
            className={`
              flex
              items-center
              justify-between
              border-b
              px-5
              py-4
              ${
                theme === "dark"
                  ? "border-slate-700"
                  : "border-slate-100"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  ${
                    theme === "dark"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-blue-50 text-blue-600"
                  }
                `}
              >
                <Layout size={18} />
              </div>

              <div>
                <p
                  className={`
                    text-sm
                    font-black
                    ${
                      theme === "dark"
                        ? "text-white"
                        : "text-slate-900"
                    }
                  `}
                >
                  Resume Builder
                </p>

                <p
                  className={`
                    text-xs
                    ${
                      theme === "dark"
                        ? "text-slate-400"
                        : "text-slate-500"
                    }
                  `}
                >
                  Appearance preview
                </p>
              </div>
            </div>

            <div
              className={`
                rounded-full
                px-3
                py-1
                text-xs
                font-bold
                ${
                  theme === "dark"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-emerald-50 text-emerald-600"
                }
              `}
            >
              Live
            </div>
          </div>

          {/* Preview Content */}

          <div
            className={`
              ${
                density === "compact"
                  ? "space-y-3 p-5"
                  : "space-y-5 p-7"
              }
            `}
          >
            <div>
              <div
                className={`
                  h-3
                  w-40
                  rounded-full
                  ${
                    theme === "dark"
                      ? "bg-slate-700"
                      : "bg-slate-200"
                  }
                `}
              />

              <div
                className={`
                  mt-3
                  h-2
                  w-64
                  rounded-full
                  ${
                    theme === "dark"
                      ? "bg-slate-800"
                      : "bg-slate-100"
                  }
                `}
              />
            </div>

            <div
              className={`
                rounded-xl
                border
                ${
                  density === "compact"
                    ? "p-3"
                    : "p-5"
                }
                ${
                  theme === "dark"
                    ? "border-slate-700 bg-slate-800"
                    : "border-slate-200 bg-slate-50"
                }
              `}
            >
              <div
                className={`
                  h-2
                  w-24
                  rounded-full
                  ${
                    theme === "dark"
                      ? "bg-slate-600"
                      : "bg-slate-200"
                  }
                `}
              />

              <div className="mt-3 space-y-2">
                <div
                  className={`
                    h-2
                    rounded-full
                    ${
                      theme === "dark"
                        ? "bg-slate-700"
                        : "bg-white"
                    }
                  `}
                />

                <div
                  className={`
                    h-2
                    w-4/5
                    rounded-full
                    ${
                      theme === "dark"
                        ? "bg-slate-700"
                        : "bg-white"
                    }
                  `}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          SAVE MESSAGE
      =================================================== */}

      {saved && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Check size={17} />
          </div>

          <div>
            <p className="text-sm font-black text-emerald-800">
              Appearance saved
            </p>

            <p className="text-xs text-emerald-700">
              Your appearance preferences have been
              updated.
            </p>
          </div>
        </div>
      )}

      {/* ===================================================
          SAVE AREA
      =================================================== */}

      <div className="flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold text-slate-800">
            Appearance preferences
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Your preferences will be remembered on your
            account.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="
            inline-flex
            items-center
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
          "
        >
          <Check size={17} />

          {saved
            ? "Saved"
            : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   THEME OPTION
========================================================= */

function ThemeOption({
  selected,
  onClick,
  icon: Icon,
  title,
  description,
  dark = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative
        text-left
        rounded-2xl
        border
        p-5
        transition
        ${
          selected
            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
        }
      `}
    >
      {/* Selected */}

      {selected && (
        <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
          <Check size={14} />
        </div>
      )}

      {/* Icon */}

      <div
        className={`
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          ${
            dark
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700"
          }
        `}
      >
        <Icon size={20} />
      </div>

      <h4 className="mt-4 text-sm font-black text-slate-900">
        {title}
      </h4>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </button>
  );
}

/* =========================================================
   DENSITY OPTION
========================================================= */

function DensityOption({
  selected,
  onClick,
  title,
  description,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative
        rounded-2xl
        border
        p-5
        text-left
        transition
        ${
          selected
            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
        }
      `}
    >
      {selected && (
        <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
          <Check size={14} />
        </div>
      )}

      {/* Spacing Preview */}

      <div className="flex items-center gap-2">
        <div className="space-y-1">
          <div className="h-2 w-20 rounded-full bg-slate-300" />
          <div className="h-2 w-14 rounded-full bg-slate-200" />
          <div className="h-2 w-17 rounded-full bg-slate-200" />
        </div>

        <div
          className={`
            ml-2
            h-12
            w-px
            ${
              selected
                ? "bg-blue-300"
                : "bg-slate-200"
            }
          `}
        />

        <div className="space-y-1">
          <div className="h-2 w-16 rounded-full bg-slate-300" />
          <div className="h-2 w-12 rounded-full bg-slate-200" />
          <div className="h-2 w-20 rounded-full bg-slate-200" />
        </div>
      </div>

      <h4 className="mt-5 text-sm font-black text-slate-900">
        {title}
      </h4>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </button>
  );
}

/* =========================================================
   APPLY THEME
========================================================= */

function applyTheme(theme) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
    return;
  }

  if (theme === "light") {
    root.classList.remove("dark");
    return;
  }

  /* =======================================================
     SYSTEM
  ======================================================= */

  const prefersDark =
    window.matchMedia &&
    window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

  root.classList.toggle(
    "dark",
    prefersDark
  );
}