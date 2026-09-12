import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

const ResumeContext = createContext(null);

/* =========================================================
   Valid Templates
========================================================= */

export const VALID_TEMPLATES = [
  "modern",
  "professional",
  "minimal",
  "creative",
  "executive",
  "sidebar-photo",
  "modern-photo",
];

export const PHOTO_SUPPORTED_TEMPLATES = [
  "sidebar-photo",
  "modern-photo",
];

export const TEMPLATE_CONFIG = {
  modern: { id: "modern", name: "Modern", supportsPhoto: false },
  professional: { id: "professional", name: "Professional", supportsPhoto: false },
  minimal: { id: "minimal", name: "Minimal", supportsPhoto: false },
  creative: { id: "creative", name: "Creative", supportsPhoto: false },
  executive: { id: "executive", name: "Executive", supportsPhoto: false },
  "sidebar-photo": { id: "sidebar-photo", name: "Sidebar Photo", supportsPhoto: true },
  "modern-photo": { id: "modern-photo", name: "Modern Photo", supportsPhoto: true },
};

export function templateSupportsPhoto(templateId) {
  return PHOTO_SUPPORTED_TEMPLATES.includes(templateId);
}

/* =========================================================
   Initial Resume Data
========================================================= */

const initialResumeData = {
  template: "modern",

  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
    photo: "",
  },

  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  awards: [],
  languages: [],
  interests: [],
};

/* =========================================================
   Normalize Resume Data
========================================================= */

function normalizeResumeData(data = {}) {
  const requestedTemplate = data?.template;

  const template = VALID_TEMPLATES.includes(
    requestedTemplate
  )
    ? requestedTemplate
    : "modern";

  return {
    ...initialResumeData,

    ...data,

    /*
      IMPORTANT:
      Template is explicitly normalized here so an incoming
      saved template cannot accidentally be replaced by the
      default "modern" value.
    */
    template,

    personalInfo: {
      ...initialResumeData.personalInfo,
      ...(data?.personalInfo || {}),
    },

    experience: Array.isArray(data?.experience)
      ? data.experience
      : [],

    education: Array.isArray(data?.education)
      ? data.education
      : [],

    skills: Array.isArray(data?.skills)
      ? data.skills
      : [],

    projects: Array.isArray(data?.projects)
      ? data.projects
      : [],

    certifications: Array.isArray(
      data?.certifications
    )
      ? data.certifications
      : [],

    awards: Array.isArray(data?.awards)
      ? data.awards
      : [],

    languages: Array.isArray(data?.languages)
      ? data.languages
      : [],

    interests: Array.isArray(data?.interests)
      ? data.interests
      : [],
  };
}

/* =========================================================
   Resume Provider
========================================================= */

export function ResumeProvider({
  children,
  initialData,
}) {
  /*
    Normalize initialData immediately.
    Restore from localStorage draft if available and no initialData provided.
  */

  const [resumeData, setResumeData] = useState(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      return normalizeResumeData(initialData);
    }
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("resumeforge_active_draft") : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          return normalizeResumeData(parsed);
        }
      }
    } catch {
      // ignore
    }
    return normalizeResumeData(initialData || {});
  });

  // Auto-sync resume draft to localStorage to preserve state across navigation
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const hasContent =
          resumeData?.personalInfo?.fullName ||
          resumeData?.personalInfo?.email ||
          resumeData?.experience?.length > 0 ||
          resumeData?.skills?.length > 0;
        if (hasContent) {
          localStorage.setItem("resumeforge_active_draft", JSON.stringify(resumeData));
        }
      }
    } catch {
      // ignore
    }
  }, [resumeData]);

  /* =======================================================
     Active Section
  ======================================================= */

  const [activeSection, setActiveSection] =
    useState("personal");

  /* =======================================================
     Template
  ======================================================= */

  const setTemplate = useCallback(
    (template) => {
      /*
        Never allow an invalid template to enter
        resumeData.
      */

      if (!VALID_TEMPLATES.includes(template)) {
        console.warn(
          `Invalid template "${template}". Keeping current template.`
        );

        return;
      }

      setResumeData((prev) => ({
        ...prev,

        template,
      }));
    },
    []
  );

  /* =======================================================
     Set Complete Resume Data
  ======================================================= */

  const updateResumeData = useCallback(
    (data) => {
      setResumeData(
        normalizeResumeData(data)
      );
    },
    []
  );

  /* =========================================================
     Personal Information
  ========================================================= */

  const updatePersonalInfo = useCallback(
    (field, value) => {
      setResumeData((prev) => ({
        ...prev,

        personalInfo: {
          ...prev.personalInfo,
          [field]: value,
        },
      }));
    },
    []
  );

  /* =========================================================
     Experience
  ========================================================= */

  const addExperience = useCallback(
    (experience) => {
      setResumeData((prev) => ({
        ...prev,

        experience: [
          ...prev.experience,

          {
            id: crypto.randomUUID(),
            ...experience,
          },
        ],
      }));
    },
    []
  );

  const updateExperience = useCallback(
    (id, updatedExperience) => {
      setResumeData((prev) => ({
        ...prev,

        experience: prev.experience.map(
          (exp) =>
            exp.id === id
              ? {
                  ...exp,
                  ...updatedExperience,
                }
              : exp
        ),
      }));
    },
    []
  );

  const deleteExperience = useCallback(
    (id) => {
      setResumeData((prev) => ({
        ...prev,

        experience:
          prev.experience.filter(
            (exp) => exp.id !== id
          ),
      }));
    },
    []
  );

  /* =========================================================
     Education
  ========================================================= */

  const addEducation = useCallback(
    (education) => {
      setResumeData((prev) => ({
        ...prev,

        education: [
          ...prev.education,

          {
            id: crypto.randomUUID(),
            ...education,
          },
        ],
      }));
    },
    []
  );

  const updateEducation = useCallback(
    (id, updatedEducation) => {
      setResumeData((prev) => ({
        ...prev,

        education: prev.education.map(
          (edu) =>
            edu.id === id
              ? {
                  ...edu,
                  ...updatedEducation,
                }
              : edu
        ),
      }));
    },
    []
  );

  const deleteEducation = useCallback(
    (id) => {
      setResumeData((prev) => ({
        ...prev,

        education:
          prev.education.filter(
            (edu) => edu.id !== id
          ),
      }));
    },
    []
  );

  /* =========================================================
     Skills
  ========================================================= */

  const addSkill = useCallback(
    (skill) => {
      setResumeData((prev) => ({
        ...prev,

        skills: [
          ...prev.skills,

          {
            id: crypto.randomUUID(),
            ...skill,
          },
        ],
      }));
    },
    []
  );

  const updateSkill = useCallback(
    (id, updatedSkill) => {
      setResumeData((prev) => ({
        ...prev,

        skills: prev.skills.map(
          (skill) =>
            skill.id === id
              ? {
                  ...skill,
                  ...updatedSkill,
                }
              : skill
        ),
      }));
    },
    []
  );

  const deleteSkill = useCallback(
    (id) => {
      setResumeData((prev) => ({
        ...prev,

        skills: prev.skills.filter(
          (skill) => skill.id !== id
        ),
      }));
    },
    []
  );

  /* =========================================================
     Projects
  ========================================================= */

  const addProject = useCallback(
    (project) => {
      setResumeData((prev) => ({
        ...prev,

        projects: [
          ...prev.projects,

          {
            id: crypto.randomUUID(),
            ...project,
          },
        ],
      }));
    },
    []
  );

  const updateProject = useCallback(
    (id, updatedProject) => {
      setResumeData((prev) => ({
        ...prev,

        projects: prev.projects.map(
          (project) =>
            project.id === id
              ? {
                  ...project,
                  ...updatedProject,
                }
              : project
        ),
      }));
    },
    []
  );

  const deleteProject = useCallback(
    (id) => {
      setResumeData((prev) => ({
        ...prev,

        projects:
          prev.projects.filter(
            (project) =>
              project.id !== id
          ),
      }));
    },
    []
  );

  /* =========================================================
     Certifications
  ========================================================= */

  const addCertification = useCallback(
    (certification) => {
      setResumeData((prev) => ({
        ...prev,

        certifications: [
          ...prev.certifications,

          {
            id: crypto.randomUUID(),
            ...certification,
          },
        ],
      }));
    },
    []
  );

  const updateCertification =
    useCallback(
      (id, updatedCertification) => {
        setResumeData((prev) => ({
          ...prev,

          certifications:
            prev.certifications.map(
              (cert) =>
                cert.id === id
                  ? {
                      ...cert,
                      ...updatedCertification,
                    }
                  : cert
            ),
        }));
      },
      []
    );

  const deleteCertification =
    useCallback((id) => {
      setResumeData((prev) => ({
        ...prev,

        certifications:
          prev.certifications.filter(
            (cert) => cert.id !== id
          ),
      }));
    }, []);

  /* =========================================================
     Reset Resume
  ========================================================= */

  const resetResume = useCallback(() => {
    setResumeData(
      normalizeResumeData({
        ...initialResumeData,
        template: "modern",
      })
    );

    setActiveSection("personal");
  }, []);

  /* =========================================================
     Context Value
  ========================================================= */

  const activeTemplateId = resumeData?.template || "modern";
  const currentTemplate = useMemo(() => {
    return (
      TEMPLATE_CONFIG[activeTemplateId] || {
        id: activeTemplateId,
        name: activeTemplateId,
        supportsPhoto: templateSupportsPhoto(activeTemplateId),
      }
    );
  }, [activeTemplateId]);

  const supportsPhoto = Boolean(currentTemplate.supportsPhoto);

  const value = useMemo(
    () => ({
      resumeData,

      setResumeData,

      /*
        New helper for safely replacing the entire resume.
      */
      updateResumeData,

      /* Active Section */
      activeSection,
      setActiveSection,

      /* Template */
      setTemplate,
      currentTemplate,
      supportsPhoto,

      /* Personal Information */
      updatePersonalInfo,

      /* Experience */
      addExperience,
      updateExperience,
      deleteExperience,

      /* Education */
      addEducation,
      updateEducation,
      deleteEducation,

      /* Skills */
      addSkill,
      updateSkill,
      deleteSkill,

      /* Projects */
      addProject,
      updateProject,
      deleteProject,

      /* Certifications */
      addCertification,
      updateCertification,
      deleteCertification,

      /* Reset */
      resetResume,
    }),
    [
      resumeData,
      activeSection,

      updateResumeData,

      setTemplate,
      currentTemplate,
      supportsPhoto,

      updatePersonalInfo,

      addExperience,
      updateExperience,
      deleteExperience,

      addEducation,
      updateEducation,
      deleteEducation,

      addSkill,
      updateSkill,
      deleteSkill,

      addProject,
      updateProject,
      deleteProject,

      addCertification,
      updateCertification,
      deleteCertification,

      resetResume,
    ]
  );

  /* =========================================================
     Provider
  ========================================================= */

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}

/* =========================================================
   useResume Hook
========================================================= */

export function useResume() {
  const context =
    useContext(ResumeContext);

  if (!context) {
    throw new Error(
      "useResume must be used inside ResumeProvider."
    );
  }

  return context;
}