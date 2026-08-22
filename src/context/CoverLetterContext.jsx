import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

const CoverLetterContext = createContext(null);

const STORAGE_KEY = "cover_letter_data";
const MIGRATED_STORAGE_KEY = "cover_letter_data_v2";
const TEMPLATE_STORAGE_KEY = "cover_letter_template";

/* =========================================================
   Initial Cover Letter Data
========================================================= */

const initialCoverLetterData = {
  selectedTemplate: "professional",

  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
  },

  recipient: {
    hiringManager: "",
    company: "",
    jobTitle: "",
    companyAddress: "",
  },

  letter: {
    date: "",
    recipientName: "",
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    subject: "",
    greeting: "Dear Hiring Manager,",
    opening: "",
    body: "",
    closing:
      "Thank you for considering my application. I look forward to the opportunity to discuss how my skills and experience can contribute to your team.",
    signOff: "Sincerely,",
  },
};

function normalizeCoverLetterData(data = {}) {
  const legacyLetter = data?.letter || {};
  const flatData = data?.letter
    ? legacyLetter
    : data;

  return {
    ...initialCoverLetterData,
    selectedTemplate:
      data?.selectedTemplate ||
      data?.template ||
      "professional",
    personalInfo: {
      ...initialCoverLetterData.personalInfo,
      ...(data?.personalInfo || {}),
    },
    recipient: {
      ...initialCoverLetterData.recipient,
      ...(data?.recipient || {}),
    },
    letter: {
      ...initialCoverLetterData.letter,
      ...flatData,
    },
  };
}

function readStoredCoverLetter() {
  try {
    const migratedData = localStorage.getItem(
      MIGRATED_STORAGE_KEY
    );
    const legacyData = localStorage.getItem(STORAGE_KEY);
    const template = localStorage.getItem(
      TEMPLATE_STORAGE_KEY
    );
    const parsed = migratedData
      ? JSON.parse(migratedData)
      : legacyData
        ? JSON.parse(legacyData)
        : {};

    return {
      data: normalizeCoverLetterData({
        ...parsed,
        selectedTemplate:
          parsed?.selectedTemplate ||
          template ||
          "professional",
      }),
      hasLegacyData: Boolean(legacyData) && !migratedData,
    };
  } catch (error) {
    console.error("Failed to load saved cover letter:", error);

    return {
      data: normalizeCoverLetterData(),
      hasLegacyData: false,
    };
  }
}

/* =========================================================
   Provider
========================================================= */

export function CoverLetterProvider({
  children,
  initialData,
}) {
  const stored = readStoredCoverLetter();
  const [coverLetterData, setCoverLetterData] =
    useState(() =>
      normalizeCoverLetterData(
        initialData || stored.data
      )
    );
  const [hasLegacyData, setHasLegacyData] =
    useState(stored.hasLegacyData);

  /* =======================================================
     Template
  ======================================================= */

  const setTemplate = useCallback((template) => {
    setCoverLetterData((prev) => ({
      ...prev,
      selectedTemplate: template,
    }));
  }, []);

  /* =======================================================
     Personal Information
  ======================================================= */

  const updatePersonalInfo = useCallback(
    (field, value) => {
      setCoverLetterData((prev) => ({
        ...prev,

        personalInfo: {
          ...prev.personalInfo,
          [field]: value,
        },
      }));
    },
    []
  );

  /* =======================================================
     Recipient Information
  ======================================================= */

  const updateRecipient = useCallback(
    (field, value) => {
      setCoverLetterData((prev) => ({
        ...prev,

        recipient: {
          ...prev.recipient,
          [field]: value,
        },
      }));
    },
    []
  );

  /* =======================================================
     Letter Content
  ======================================================= */

  const updateLetter = useCallback(
    (field, value) => {
      setCoverLetterData((prev) => ({
        ...prev,

        letter: {
          ...prev.letter,
          [field]: value,
        },
      }));
    },
    []
  );

  /* =======================================================
     Update Entire Cover Letter
  ======================================================= */

  const updateCoverLetter = useCallback(
    (updatedData) => {
      setCoverLetterData((prev) => ({
        ...prev,
        ...updatedData,

        personalInfo: {
          ...prev.personalInfo,
          ...(updatedData.personalInfo || {}),
        },

        recipient: {
          ...prev.recipient,
          ...(updatedData.recipient || {}),
        },

        letter: {
          ...prev.letter,
          ...(updatedData.letter || {}),
        },
      }));
    },
    []
  );

  /* =======================================================
     Reset
  ======================================================= */

  const resetCoverLetter = useCallback(() => {
    setCoverLetterData(normalizeCoverLetterData());
    setHasLegacyData(false);
  }, []);

  const saveCoverLetter = useCallback(() => {
    const storedData = {
      version: 2,
      selectedTemplate: coverLetterData.selectedTemplate,
      letter: coverLetterData.letter,
    };

    try {
      localStorage.setItem(
        MIGRATED_STORAGE_KEY,
        JSON.stringify(storedData)
      );

      const savedValue = localStorage.getItem(
        MIGRATED_STORAGE_KEY
      );

      if (savedValue !== JSON.stringify(storedData)) {
        throw new Error("Cover letter verification failed.");
      }

      if (hasLegacyData) {
        localStorage.removeItem(STORAGE_KEY);
        setHasLegacyData(false);
      }

      localStorage.setItem(
        TEMPLATE_STORAGE_KEY,
        coverLetterData.selectedTemplate
      );
    } catch (error) {
      console.error("Failed to save cover letter:", error);
      throw error;
    }
  }, [coverLetterData, hasLegacyData]);

  /* =======================================================
     Context Value
  ======================================================= */

  const value = useMemo(
    () => ({
      coverLetterData,

      setCoverLetterData,

      /* Template */
      setTemplate,

      /* Personal */
      updatePersonalInfo,

      /* Recipient */
      updateRecipient,

      /* Letter */
      updateLetter,

      /* Entire Cover Letter */
      updateCoverLetter,

      /* Reset */
      resetCoverLetter,
      saveCoverLetter,
    }),
    [
      coverLetterData,

      setTemplate,

      updatePersonalInfo,

      updateRecipient,

      updateLetter,

      updateCoverLetter,

      resetCoverLetter,
      saveCoverLetter,
    ]
  );

  /* =======================================================
     Provider
  ======================================================= */

  return (
    <CoverLetterContext.Provider value={value}>
      {children}
    </CoverLetterContext.Provider>
  );
}

/* =========================================================
   Hook
========================================================= */

export function useCoverLetter() {
  const context = useContext(CoverLetterContext);

  if (!context) {
    throw new Error(
      "useCoverLetter must be used inside CoverLetterProvider."
    );
  }

  return context;
}