import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

const CoverLetterContext = createContext(null);

const STORAGE_KEY = "cover_letter_data";
const MIGRATED_STORAGE_KEY = "cover_letter_data_v2";
const TEMPLATE_STORAGE_KEY = "cover_letter_template";
const IMPORT_DISMISSED_STORAGE_KEY = "cover_letter_import_dismissed";

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
  const flatData = data?.letter ? data.letter : data;

  return {
    ...initialCoverLetterData,
    selectedTemplate:
      data?.selectedTemplate || data?.template || "professional",
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


export function getStoredCoverLetterForImport() {
  try {
    const migratedData = localStorage.getItem(MIGRATED_STORAGE_KEY);
    const legacyData = localStorage.getItem(STORAGE_KEY);
    const template = localStorage.getItem(TEMPLATE_STORAGE_KEY);

    if (!migratedData && !legacyData && !template) return null;

    const parsed = migratedData
      ? JSON.parse(migratedData)
      : legacyData
        ? JSON.parse(legacyData)
        : {};
    const normalizedData = normalizeCoverLetterData({
      ...parsed,
      selectedTemplate:
        parsed?.selectedTemplate || template || "professional",
    });
    const hasContent = [
      normalizedData.personalInfo.fullName,
      normalizedData.recipient.company,
      normalizedData.recipient.jobTitle,
      normalizedData.letter.companyName,
      normalizedData.letter.jobTitle,
      normalizedData.letter.jobDescription,
      normalizedData.letter.opening,
      normalizedData.letter.body,
    ].some((value) => typeof value === "string" && value.trim());

    return hasContent ? normalizedData : null;
  } catch (error) {
    console.error("Failed to prepare cover letter import:", error);
    return null;
  }
}

export function clearStoredCoverLetter() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(MIGRATED_STORAGE_KEY);
  localStorage.removeItem(TEMPLATE_STORAGE_KEY);
}

export function isCoverLetterImportDismissed() {
  return localStorage.getItem(IMPORT_DISMISSED_STORAGE_KEY) === "true";
}

export function dismissCoverLetterImport() {
  localStorage.setItem(IMPORT_DISMISSED_STORAGE_KEY, "true");
}

export function CoverLetterProvider({ children, initialData }) {
  const [coverLetterData, setCoverLetterData] = useState(() =>
    normalizeCoverLetterData(initialData)
  );
  const [coverLetters, setCoverLetters] = useState([]);
  const [activeCoverLetterId, setActiveCoverLetterId] = useState(null);

  const loadCoverLetters = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setCoverLetters([]);
      return [];
    }

    const { data, error } = await supabase
      .from("cover_letters")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    setCoverLetters(data || []);
    return data || [];
  }, []);

  useEffect(() => {
    loadCoverLetters().catch((error) => {
      console.error("Failed to load cover letters:", error);
    });
  }, [loadCoverLetters]);

  const setTemplate = useCallback((template) => {
    setCoverLetterData((previous) => ({ ...previous, selectedTemplate: template }));
  }, []);

  const updatePersonalInfo = useCallback((field, value) => {
    setCoverLetterData((previous) => ({
      ...previous,
      personalInfo: { ...previous.personalInfo, [field]: value },
    }));
  }, []);

  const updateRecipient = useCallback((field, value) => {
    setCoverLetterData((previous) => ({
      ...previous,
      recipient: { ...previous.recipient, [field]: value },
    }));
  }, []);

  const updateLetter = useCallback((field, value) => {
    setCoverLetterData((previous) => ({
      ...previous,
      letter: { ...previous.letter, [field]: value },
    }));
  }, []);

  const updateCoverLetter = useCallback((updatedData) => {
    setCoverLetterData((previous) => ({
      ...previous,
      ...updatedData,
      personalInfo: {
        ...previous.personalInfo,
        ...(updatedData.personalInfo || {}),
      },
      recipient: { ...previous.recipient, ...(updatedData.recipient || {}) },
      letter: { ...previous.letter, ...(updatedData.letter || {}) },
    }));
  }, []);

  const resetCoverLetter = useCallback(() => {
    setCoverLetterData(normalizeCoverLetterData());
    setActiveCoverLetterId(null);
  }, []);

  const createCoverLetter = useCallback((initialData) => {
    setActiveCoverLetterId(null);
    setCoverLetterData(normalizeCoverLetterData(initialData));
  }, []);

  const loadCoverLetter = useCallback(async (id) => {
    const { data, error } = await supabase
      .from("cover_letters")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    setActiveCoverLetterId(data.id);
    setCoverLetterData(
      normalizeCoverLetterData({
        ...data.letter_data,
        selectedTemplate:
          data.selected_template || data.letter_data?.selectedTemplate,
      })
    );
    return data;
  }, []);

  const deleteCoverLetter = useCallback(async (id) => {
    const { error } = await supabase
      .from("cover_letters")
      .delete()
      .eq("id", id);

    if (error) throw error;
    setCoverLetters((previous) =>
      previous.filter((coverLetter) => coverLetter.id !== id)
    );

    if (activeCoverLetterId === id) {
      setActiveCoverLetterId(null);
      setCoverLetterData(normalizeCoverLetterData());
    }
  }, [activeCoverLetterId]);

  const saveCoverLetter = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Please log in before saving a cover letter.");

    const letterData = normalizeCoverLetterData(coverLetterData);
    const title = [
      letterData.letter.jobTitle || letterData.recipient.jobTitle,
      letterData.letter.companyName || letterData.recipient.company,
    ].filter(Boolean).join(" - ") || "Untitled Cover Letter";
    const storedData = {
      version: 2,
      selectedTemplate: letterData.selectedTemplate,
      personalInfo: letterData.personalInfo,
      recipient: letterData.recipient,
      letter: letterData.letter,
    };
    const payload = {
      user_id: user.id,
      title,
      letter_data: storedData,
      selected_template: letterData.selectedTemplate,
      updated_at: new Date().toISOString(),
    };
    const query = activeCoverLetterId
      ? supabase
          .from("cover_letters")
          .update(payload)
          .eq("id", activeCoverLetterId)
          .select()
          .single()
      : supabase.from("cover_letters").insert(payload).select().single();
    const { data, error } = await query;

    if (error) {
      console.error("Failed to save cover letter:", error);
      throw error;
    }

    setActiveCoverLetterId(data.id);
    setCoverLetterData(letterData);
    setCoverLetters((previous) => [
      data,
      ...previous.filter((coverLetter) => coverLetter.id !== data.id),
    ]);
    return data;
  }, [activeCoverLetterId, coverLetterData]);

  const importCoverLetter = useCallback(async (importedData) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Please log in before importing a cover letter.");

    const letterData = normalizeCoverLetterData(importedData);
    const title = [
      letterData.letter.jobTitle || letterData.recipient.jobTitle,
      letterData.letter.companyName || letterData.recipient.company,
    ].filter(Boolean).join(" - ") || "Imported Cover Letter";
    const { data, error } = await supabase
      .from("cover_letters")
      .insert({
        user_id: user.id,
        title,
        letter_data: {
          version: 2,
          selectedTemplate: letterData.selectedTemplate,
          personalInfo: letterData.personalInfo,
          recipient: letterData.recipient,
          letter: letterData.letter,
        },
        selected_template: letterData.selectedTemplate,
      })
      .select()
      .single();

    if (error) throw error;

    setActiveCoverLetterId(data.id);
    setCoverLetterData(letterData);
    setCoverLetters((previous) => [data, ...previous]);
    return data;
  }, []);

  const value = useMemo(
    () => ({
      coverLetterData,
      coverLetters,
      activeCoverLetterId,
      setCoverLetterData,
      setTemplate,
      updatePersonalInfo,
      updateRecipient,
      updateLetter,
      updateCoverLetter,
      resetCoverLetter,
      loadCoverLetters,
      loadCoverLetter,
      createCoverLetter,
      deleteCoverLetter,
      importCoverLetter,
      saveCoverLetter,
    }),
    [
      coverLetterData,
      coverLetters,
      activeCoverLetterId,
      setTemplate,
      updatePersonalInfo,
      updateRecipient,
      updateLetter,
      updateCoverLetter,
      resetCoverLetter,
      loadCoverLetters,
      loadCoverLetter,
      createCoverLetter,
      deleteCoverLetter,
      importCoverLetter,
      saveCoverLetter,
    ]
  );

  return (
    <CoverLetterContext.Provider value={value}>
      {children}
    </CoverLetterContext.Provider>
  );
}

export function useCoverLetter() {
  const context = useContext(CoverLetterContext);

  if (!context) {
    throw new Error("useCoverLetter must be used inside CoverLetterProvider.");
  }

  return context;
}