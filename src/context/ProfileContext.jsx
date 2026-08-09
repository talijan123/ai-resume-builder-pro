import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/* =========================================================
   PROFILE CONTEXT
========================================================= */

const ProfileContext = createContext(null);

/* =========================================================
   LOCAL STORAGE KEY
========================================================= */

const PROFILE_STORAGE_KEY = "resume_builder_profile";

/* =========================================================
   INITIAL PROFILE DATA
========================================================= */

const initialProfileData = {
  /* =======================================================
     PROFILE
  ======================================================= */

  profile: {
    photo: "",
    fullName: "",
    professionalTitle: "",
    location: "",
    summary: "",
    yearsOfExperience: "",
    desiredJobTitle: "",
  },

  /* =======================================================
     CONTACT INFORMATION
  ======================================================= */

  contact: {
    email: "",
    phone: "",
    website: "",
    linkedin: "",
    github: "",
  },

  /* =======================================================
     SKILLS
  ======================================================= */

  skills: [],

  /* =======================================================
     EDUCATION
  ======================================================= */

  education: [],

  /* =======================================================
     EXPERIENCE
  ======================================================= */

  experience: [],
};

/* =========================================================
   CREATE PROFILE DATA
========================================================= */

function createProfileData(data = {}) {
  return {
    ...initialProfileData,

    profile: {
      ...initialProfileData.profile,
      ...(data?.profile || {}),
    },

    contact: {
      ...initialProfileData.contact,
      ...(data?.contact || {}),
    },

    skills: Array.isArray(data?.skills)
      ? data.skills
      : [...initialProfileData.skills],

    education: Array.isArray(data?.education)
      ? data.education
      : [...initialProfileData.education],

    experience: Array.isArray(data?.experience)
      ? data.experience
      : [...initialProfileData.experience],
  };
}

/* =========================================================
   LOAD PROFILE FROM LOCAL STORAGE
========================================================= */

function loadStoredProfile() {
  if (typeof window === "undefined") {
    return createProfileData();
  }

  try {
    const storedProfile = localStorage.getItem(
      PROFILE_STORAGE_KEY
    );

    if (!storedProfile) {
      return createProfileData();
    }

    const parsedProfile = JSON.parse(storedProfile);

    return createProfileData(parsedProfile);
  } catch (error) {
    console.error(
      "Failed to load profile from localStorage:",
      error
    );

    return createProfileData();
  }
}

/* =========================================================
   PROVIDER
========================================================= */

export function ProfileProvider({
  children,
  initialData,
}) {
  /* =======================================================
     PROFILE STATE
  ======================================================= */

  const [profileData, setProfileData] = useState(() => {
    /*
      Priority:

      1. initialData if explicitly provided
      2. saved localStorage data
      3. empty initial profile
    */

    if (initialData) {
      return createProfileData(initialData);
    }

    return loadStoredProfile();
  });

  /* =======================================================
     SAVE PROFILE TO LOCAL STORAGE
  ======================================================= */

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(profileData)
      );
    } catch (error) {
      console.error(
        "Failed to save profile to localStorage:",
        error
      );
    }
  }, [profileData]);

  /* =======================================================
     PROFILE INFORMATION
  ======================================================= */

  const updateProfile = useCallback(
    (field, value) => {
      setProfileData((prev) => ({
        ...prev,

        profile: {
          ...prev.profile,
          [field]: value,
        },
      }));
    },
    []
  );

  /* =======================================================
     CONTACT INFORMATION
  ======================================================= */

  const updateContact = useCallback(
    (field, value) => {
      setProfileData((prev) => ({
        ...prev,

        contact: {
          ...prev.contact,
          [field]: value,
        },
      }));
    },
    []
  );

  /* =======================================================
     SKILLS
  ======================================================= */

  const addSkill = useCallback((skill) => {
    const cleanSkill = String(skill || "").trim();

    if (!cleanSkill) {
      return;
    }

    setProfileData((prev) => {
      const exists = prev.skills.some(
        (item) =>
          String(item).toLowerCase() ===
          cleanSkill.toLowerCase()
      );

      if (exists) {
        return prev;
      }

      return {
        ...prev,

        skills: [
          ...prev.skills,
          cleanSkill,
        ],
      };
    });
  }, []);

  const removeSkill = useCallback((skill) => {
    setProfileData((prev) => ({
      ...prev,

      skills: prev.skills.filter(
        (item) =>
          String(item).toLowerCase() !==
          String(skill).toLowerCase()
      ),
    }));
  }, []);

  const updateSkills = useCallback((skills) => {
    setProfileData((prev) => ({
      ...prev,

      skills: Array.isArray(skills)
        ? skills
        : [],
    }));
  }, []);

  /* =======================================================
     EDUCATION
  ======================================================= */

  const addEducation = useCallback(
    (educationItem) => {
      setProfileData((prev) => ({
        ...prev,

        education: [
          ...prev.education,

          {
            id:
              typeof crypto !== "undefined" &&
              crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random()}`,

            institution: "",
            degree: "",
            fieldOfStudy: "",
            location: "",
            startDate: "",
            endDate: "",
            currentlyStudying: false,
            description: "",

            ...(educationItem || {}),
          },
        ],
      }));
    },
    []
  );

  const updateEducation = useCallback(
    (id, field, value) => {
      setProfileData((prev) => ({
        ...prev,

        education: prev.education.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  [field]: value,
                }
              : item
        ),
      }));
    },
    []
  );

  const removeEducation = useCallback((id) => {
    setProfileData((prev) => ({
      ...prev,

      education: prev.education.filter(
        (item) => item.id !== id
      ),
    }));
  }, []);

  /* =======================================================
     EXPERIENCE
  ======================================================= */

  const addExperience = useCallback(
    (experienceItem) => {
      setProfileData((prev) => ({
        ...prev,

        experience: [
          ...prev.experience,

          {
            id:
              typeof crypto !== "undefined" &&
              crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random()}`,

            company: "",
            position: "",
            location: "",
            employmentType: "",
            startDate: "",
            endDate: "",
            currentlyWorking: false,
            description: "",

            ...(experienceItem || {}),
          },
        ],
      }));
    },
    []
  );

  const updateExperience = useCallback(
    (id, field, value) => {
      setProfileData((prev) => ({
        ...prev,

        experience: prev.experience.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  [field]: value,
                }
              : item
        ),
      }));
    },
    []
  );

  const removeExperience = useCallback((id) => {
    setProfileData((prev) => ({
      ...prev,

      experience: prev.experience.filter(
        (item) => item.id !== id
      ),
    }));
  }, []);

  /* =======================================================
     UPDATE ENTIRE PROFILE
  ======================================================= */

  const updateProfileData = useCallback(
    (updatedData) => {
      if (!updatedData) {
        return;
      }

      setProfileData((prev) => ({
        ...prev,

        ...updatedData,

        profile: {
          ...prev.profile,
          ...(updatedData.profile || {}),
        },

        contact: {
          ...prev.contact,
          ...(updatedData.contact || {}),
        },

        skills: Array.isArray(
          updatedData.skills
        )
          ? updatedData.skills
          : prev.skills,

        education: Array.isArray(
          updatedData.education
        )
          ? updatedData.education
          : prev.education,

        experience: Array.isArray(
          updatedData.experience
        )
          ? updatedData.experience
          : prev.experience,
      }));
    },
    []
  );

  /* =======================================================
     RESET PROFILE
  ======================================================= */

  const resetProfile = useCallback(() => {
    const emptyProfile = createProfileData();

    setProfileData(emptyProfile);

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(
          PROFILE_STORAGE_KEY
        );
      } catch (error) {
        console.error(
          "Failed to clear profile from localStorage:",
          error
        );
      }
    }
  }, []);

  /* =======================================================
     SET PROFILE DATA
  ======================================================= */

  const setProfile = useCallback((data) => {
    if (!data) {
      return;
    }

    setProfileData(createProfileData(data));
  }, []);

  /* =======================================================
     CLEAR PROFILE STORAGE
  ======================================================= */

  const clearStoredProfile = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.removeItem(
        PROFILE_STORAGE_KEY
      );
    } catch (error) {
      console.error(
        "Failed to clear stored profile:",
        error
      );
    }
  }, []);

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = useMemo(
    () => ({
      /* Main data */

      profileData,

      setProfileData,

      setProfile,

      /* Profile */

      updateProfile,

      /* Contact */

      updateContact,

      /* Skills */

      addSkill,
      removeSkill,
      updateSkills,

      /* Education */

      addEducation,
      updateEducation,
      removeEducation,

      /* Experience */

      addExperience,
      updateExperience,
      removeExperience,

      /* Entire profile */

      updateProfileData,

      /* Reset */

      resetProfile,

      /* Storage */

      clearStoredProfile,
    }),
    [
      profileData,

      setProfile,

      updateProfile,

      updateContact,

      addSkill,
      removeSkill,
      updateSkills,

      addEducation,
      updateEducation,
      removeEducation,

      addExperience,
      updateExperience,
      removeExperience,

      updateProfileData,

      resetProfile,

      clearStoredProfile,
    ]
  );

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error(
      "useProfile must be used inside ProfileProvider."
    );
  }

  return context;
}

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default ProfileContext;