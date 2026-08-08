import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

const ResumeContext = createContext(null);

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
  },

  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

/* =========================================================
   Resume Provider
========================================================= */

export function ResumeProvider({ children, initialData }) {
  /*
   * If initialData is provided, it is mainly useful for
   * template previews.
   *
   * Otherwise the builder starts with empty resume data.
   */
  const [resumeData, setResumeData] = useState(() => ({
    ...initialResumeData,
    ...(initialData || {}),

    personalInfo: {
      ...initialResumeData.personalInfo,
      ...(initialData?.personalInfo || {}),
    },

    experience: initialData?.experience || [],
    education: initialData?.education || [],
    skills: initialData?.skills || [],
    projects: initialData?.projects || [],
    certifications: initialData?.certifications || [],
  }));

  /* =======================================================
     Active Section
  ======================================================= */

  const [activeSection, setActiveSection] =
    useState("personal");

  /* =======================================================
     Template
  ======================================================= */

  const setTemplate = useCallback((template) => {
    setResumeData((prev) => ({
      ...prev,
      template,
    }));
  }, []);

  /* =======================================================
     Personal Information
  ======================================================= */

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

  /* =======================================================
     Experience
  ======================================================= */

  const addExperience = useCallback((experience) => {
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
  }, []);

  const updateExperience = useCallback(
    (id, updatedExperience) => {
      setResumeData((prev) => ({
        ...prev,

        experience: prev.experience.map((exp) =>
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

  const deleteExperience = useCallback((id) => {
    setResumeData((prev) => ({
      ...prev,

      experience: prev.experience.filter(
        (exp) => exp.id !== id
      ),
    }));
  }, []);

  /* =======================================================
     Education
  ======================================================= */

  const addEducation = useCallback((education) => {
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
  }, []);

  const updateEducation = useCallback(
    (id, updatedEducation) => {
      setResumeData((prev) => ({
        ...prev,

        education: prev.education.map((edu) =>
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

  const deleteEducation = useCallback((id) => {
    setResumeData((prev) => ({
      ...prev,

      education: prev.education.filter(
        (edu) => edu.id !== id
      ),
    }));
  }, []);

  /* =======================================================
     Skills
  ======================================================= */

  const addSkill = useCallback((skill) => {
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
  }, []);

  const updateSkill = useCallback(
    (id, updatedSkill) => {
      setResumeData((prev) => ({
        ...prev,

        skills: prev.skills.map((skill) =>
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

  const deleteSkill = useCallback((id) => {
    setResumeData((prev) => ({
      ...prev,

      skills: prev.skills.filter(
        (skill) => skill.id !== id
      ),
    }));
  }, []);

  /* =======================================================
     Projects
  ======================================================= */

  const addProject = useCallback((project) => {
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
  }, []);

  const updateProject = useCallback(
    (id, updatedProject) => {
      setResumeData((prev) => ({
        ...prev,

        projects: prev.projects.map((project) =>
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

  const deleteProject = useCallback((id) => {
    setResumeData((prev) => ({
      ...prev,

      projects: prev.projects.filter(
        (project) => project.id !== id
      ),
    }));
  }, []);

  /* =======================================================
     Certifications
  ======================================================= */

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

  const updateCertification = useCallback(
    (id, updatedCertification) => {
      setResumeData((prev) => ({
        ...prev,

        certifications: prev.certifications.map(
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

  const deleteCertification = useCallback((id) => {
    setResumeData((prev) => ({
      ...prev,

      certifications: prev.certifications.filter(
        (cert) => cert.id !== id
      ),
    }));
  }, []);

  /* =======================================================
     Reset Resume
  ======================================================= */

  const resetResume = useCallback(() => {
    setResumeData({
      ...initialResumeData,

      personalInfo: {
        ...initialResumeData.personalInfo,
      },

      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
    });

    setActiveSection("personal");
  }, []);

  /* =======================================================
     Context Value
  ======================================================= */

  const value = useMemo(
    () => ({
      resumeData,

      setResumeData,

      /* Active Section */
      activeSection,
      setActiveSection,

      /* Template */
      setTemplate,

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

      setTemplate,

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

  /* =======================================================
     Provider
  ======================================================= */

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
  const context = useContext(ResumeContext);

  if (!context) {
    throw new Error(
      "useResume must be used inside ResumeProvider."
    );
  }

  return context;
}