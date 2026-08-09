import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

const CoverLetterContext = createContext(null);

/* =========================================================
   Initial Cover Letter Data
========================================================= */

const initialCoverLetterData = {
  template: "modern",

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
    greeting: "Dear Hiring Manager,",
    opening: "",
    body: "",
    closing:
      "Thank you for considering my application. I look forward to the opportunity to discuss how my skills and experience can contribute to your team.",
    signature: "",
  },
};

/* =========================================================
   Provider
========================================================= */

export function CoverLetterProvider({
  children,
  initialData,
}) {
  const [coverLetterData, setCoverLetterData] =
    useState(() => ({
      ...initialCoverLetterData,
      ...(initialData || {}),

      personalInfo: {
        ...initialCoverLetterData.personalInfo,
        ...(initialData?.personalInfo || {}),
      },

      recipient: {
        ...initialCoverLetterData.recipient,
        ...(initialData?.recipient || {}),
      },

      letter: {
        ...initialCoverLetterData.letter,
        ...(initialData?.letter || {}),
      },
    }));

  /* =======================================================
     Template
  ======================================================= */

  const setTemplate = useCallback((template) => {
    setCoverLetterData((prev) => ({
      ...prev,
      template,
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
    setCoverLetterData({
      ...initialCoverLetterData,

      personalInfo: {
        ...initialCoverLetterData.personalInfo,
      },

      recipient: {
        ...initialCoverLetterData.recipient,
      },

      letter: {
        ...initialCoverLetterData.letter,
      },
    });
  }, []);

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
    }),
    [
      coverLetterData,

      setTemplate,

      updatePersonalInfo,

      updateRecipient,

      updateLetter,

      updateCoverLetter,

      resetCoverLetter,
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