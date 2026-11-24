import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/* =========================================================
   SETTINGS CONTEXT
========================================================= */

const SettingsContext = createContext(null);

/* =========================================================
   LOCAL STORAGE KEY
========================================================= */

const SETTINGS_STORAGE_KEY = "resume_builder_settings";

/* =========================================================
   INITIAL SETTINGS
========================================================= */

const initialSettings = {
  /* =======================================================
     APPEARANCE
  ======================================================= */

  appearance: {
    theme: "system",
    density: "comfortable",
  },

  /* =======================================================
     DOCUMENT PREFERENCES
  ======================================================= */

  documents: {
    resumeTemplate: "modern",
    coverLetterTemplate: "modern",
    paperSize: "A4",
    downloadFormat: "PDF",
  },
};

/* =========================================================
   CREATE SETTINGS
========================================================= */

function createSettings(data = {}) {
  return {
    ...initialSettings,

    appearance: {
      ...initialSettings.appearance,
      ...(data?.appearance || {}),
    },

    documents: {
      ...initialSettings.documents,
      ...(data?.documents || {}),
    },
  };
}

/* =========================================================
   LOAD SETTINGS
========================================================= */

function loadStoredSettings() {
  if (typeof window === "undefined") {
    return createSettings();
  }

  try {
    const storedSettings = localStorage.getItem(
      SETTINGS_STORAGE_KEY
    );

    if (!storedSettings) {
      return createSettings();
    }

    const parsedSettings = JSON.parse(
      storedSettings
    );

    return createSettings(parsedSettings);
  } catch (error) {
    console.error(
      "Failed to load settings:",
      error
    );

    return createSettings();
  }
}

/* =========================================================
   PROVIDER
========================================================= */

export function SettingsProvider({
  children,
  initialData,
}) {
  /* =======================================================
     SETTINGS STATE
  ======================================================= */

  const [settings, setSettings] = useState(() => {
    /*
      Priority:

      1. initialData
      2. saved localStorage settings
      3. default settings
    */

    if (initialData) {
      return createSettings(initialData);
    }

    return loadStoredSettings();
  });

  /* =======================================================
     SAVE SETTINGS
  ======================================================= */

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error(
        "Failed to save settings:",
        error
      );
    }
  }, [settings]);

  /* Apply appearance globally and follow OS theme changes. */
  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    const root = document.documentElement;
    const theme = settings.appearance.theme;
    const mediaQuery = window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;

    const applyAppearance = () => {
      const isDark =
        theme === "dark" ||
        (theme === "system" && Boolean(mediaQuery?.matches));

      root.classList.toggle("dark", isDark);
      root.dataset.theme = isDark ? "dark" : "light";
      root.dataset.density = settings.appearance.density;
    };

    applyAppearance();

    if (theme !== "system" || !mediaQuery) {
      return undefined;
    }

    mediaQuery.addEventListener("change", applyAppearance);

    return () => {
      mediaQuery.removeEventListener("change", applyAppearance);
    };
  }, [
    settings.appearance.theme,
    settings.appearance.density,
  ]);

  /* =======================================================
     APPEARANCE
  ======================================================= */

  const updateAppearance = useCallback(
    (field, value) => {
      const allowedValues = {
        theme: ["light", "dark", "system"],
        density: ["compact", "comfortable", "spacious"],
      };

      if (
        !allowedValues[field]?.includes(value)
      ) {
        return;
      }

      setSettings((prev) => ({
        ...prev,

        appearance: {
          ...prev.appearance,
          [field]: value,
        },
      }));
    },
    []
  );

  /* =======================================================
     THEME
  ======================================================= */

  const setTheme = useCallback((theme) => {
    const allowedThemes = [
      "light",
      "dark",
      "system",
    ];

    if (!allowedThemes.includes(theme)) {
      return;
    }

    setSettings((prev) => ({
      ...prev,

      appearance: {
        ...prev.appearance,
        theme,
      },
    }));
  }, []);

  /* =======================================================
     DOCUMENT SETTINGS
  ======================================================= */

  const updateDocumentSetting = useCallback(
    (field, value) => {
      setSettings((prev) => ({
        ...prev,

        documents: {
          ...prev.documents,
          [field]: value,
        },
      }));
    },
    []
  );

  /* =======================================================
     RESUME TEMPLATE
  ======================================================= */

  const setResumeTemplate = useCallback(
    (template) => {
      const allowedTemplates = [
        "modern",
        "professional",
        "minimal",
      ];

      if (!allowedTemplates.includes(template)) {
        return;
      }

      setSettings((prev) => ({
        ...prev,

        documents: {
          ...prev.documents,
          resumeTemplate: template,
        },
      }));
    },
    []
  );

  /* =======================================================
     COVER LETTER TEMPLATE
  ======================================================= */

  const setCoverLetterTemplate = useCallback(
    (template) => {
      const allowedTemplates = [
        "modern",
        "professional",
        "minimal",
      ];

      if (!allowedTemplates.includes(template)) {
        return;
      }

      setSettings((prev) => ({
        ...prev,

        documents: {
          ...prev.documents,
          coverLetterTemplate: template,
        },
      }));
    },
    []
  );

  /* =======================================================
     PAPER SIZE
  ======================================================= */

  const setPaperSize = useCallback((paperSize) => {
    const allowedSizes = [
      "A4",
      "Letter",
    ];

    if (!allowedSizes.includes(paperSize)) {
      return;
    }

    setSettings((prev) => ({
      ...prev,

      documents: {
        ...prev.documents,
        paperSize,
      },
    }));
  }, []);

  /* =======================================================
     DOWNLOAD FORMAT
  ======================================================= */

  const setDownloadFormat = useCallback(
    (format) => {
      const allowedFormats = [
        "PDF",
      ];

      if (!allowedFormats.includes(format)) {
        return;
      }

      setSettings((prev) => ({
        ...prev,

        documents: {
          ...prev.documents,
          downloadFormat: format,
        },
      }));
    },
    []
  );

  /* =======================================================
     UPDATE ENTIRE SETTINGS
  ======================================================= */

  const updateSettings = useCallback(
    (updatedSettings) => {
      if (!updatedSettings) {
        return;
      }

      setSettings((prev) => ({
        ...prev,

        ...updatedSettings,

        appearance: {
          ...prev.appearance,
          ...(updatedSettings.appearance || {}),
        },

        documents: {
          ...prev.documents,
          ...(updatedSettings.documents || {}),
        },
      }));
    },
    []
  );

  /* =======================================================
     RESET SETTINGS
  ======================================================= */

  const resetSettings = useCallback(() => {
    const defaultSettings = createSettings();

    setSettings(defaultSettings);

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(
          SETTINGS_STORAGE_KEY
        );
      } catch (error) {
        console.error(
          "Failed to clear settings:",
          error
        );
      }
    }
  }, []);

  /* =======================================================
     SET SETTINGS
  ======================================================= */

  const setAllSettings = useCallback((data) => {
    if (!data) {
      return;
    }

    setSettings(createSettings(data));
  }, []);

  /* =======================================================
     CLEAR STORED SETTINGS
  ======================================================= */

  const clearStoredSettings = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.removeItem(
        SETTINGS_STORAGE_KEY
      );
    } catch (error) {
      console.error(
        "Failed to clear stored settings:",
        error
      );
    }
  }, []);

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = useMemo(
    () => ({
      /* Main settings */

      settings,

      setSettings,

      setAllSettings,

      updateSettings,

      /* Appearance */

      updateAppearance,
      setTheme,

      /* Documents */

      updateDocumentSetting,
      setResumeTemplate,
      setCoverLetterTemplate,
      setPaperSize,
      setDownloadFormat,

      /* Reset */

      resetSettings,

      /* Storage */

      clearStoredSettings,
    }),
    [
      settings,

      setAllSettings,
      updateSettings,

      updateAppearance,
      setTheme,

      updateDocumentSetting,
      setResumeTemplate,
      setCoverLetterTemplate,
      setPaperSize,
      setDownloadFormat,

      resetSettings,
      clearStoredSettings,
    ]
  );

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings must be used inside SettingsProvider."
    );
  }

  return context;
}

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default SettingsContext;