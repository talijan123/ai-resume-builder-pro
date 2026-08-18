import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

/* =========================================================
   PROFILE CONTEXT
========================================================= */

const ProfileContext = createContext(null);

/* =========================================================
   STORAGE CONFIGURATION
========================================================= */

const PROFILE_PHOTO_BUCKET = "profile-photos";

/* =========================================================
   INITIAL PROFILE DATA
========================================================= */

const initialProfileData = {
  profile: {
    photo: "",
    fullName: "",
    professionalTitle: "",
    location: "",
    summary: "",
    yearsOfExperience: "",
    desiredJobTitle: "",
  },

  contact: {
    email: "",
    phone: "",
    website: "",
    linkedin: "",
    github: "",
  },

  skills: [],

  education: [],

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
      : [],

    education: Array.isArray(data?.education)
      ? data.education
      : [],

    experience: Array.isArray(data?.experience)
      ? data.experience
      : [],
  };
}

/* =========================================================
   SUPABASE ROW → PROFILE DATA
========================================================= */

function supabaseRowToProfile(row) {
  if (!row) {
    return createProfileData();
  }

  return createProfileData({
    profile: {
      photo: row.photo_url || "",

      fullName:
        row.full_name || "",

      professionalTitle:
        row.professional_title || "",

      location:
        row.location || "",

      summary:
        row.summary || "",

      yearsOfExperience:
        row.years_of_experience || "",

      desiredJobTitle:
        row.desired_job_title || "",
    },

    contact: {
      email:
        row.email || "",

      phone:
        row.phone || "",

      website:
        row.website || "",

      linkedin:
        row.linkedin || "",

      github:
        row.github || "",
    },

    skills: Array.isArray(row.skills)
      ? row.skills
      : [],

    education: Array.isArray(row.education)
      ? row.education
      : [],

    experience: Array.isArray(row.experience)
      ? row.experience
      : [],
  });
}

/* =========================================================
   PROFILE DATA → SUPABASE ROW
========================================================= */

function profileDataToSupabaseRow(
  profileData,
  userId
) {
  return {
    id: userId,

    full_name:
      profileData?.profile?.fullName || "",

    professional_title:
      profileData?.profile?.professionalTitle || "",

    location:
      profileData?.profile?.location || "",

    summary:
      profileData?.profile?.summary || "",

    years_of_experience:
      profileData?.profile?.yearsOfExperience || "",

    desired_job_title:
      profileData?.profile?.desiredJobTitle || "",

    email:
      profileData?.contact?.email || "",

    phone:
      profileData?.contact?.phone || "",

    website:
      profileData?.contact?.website || "",

    linkedin:
      profileData?.contact?.linkedin || "",

    github:
      profileData?.contact?.github || "",

    photo_url:
      profileData?.profile?.photo || "",

    skills:
      Array.isArray(profileData?.skills)
        ? profileData.skills
        : [],

    education:
      Array.isArray(profileData?.education)
        ? profileData.education
        : [],

    experience:
      Array.isArray(profileData?.experience)
        ? profileData.experience
        : [],

    updated_at:
      new Date().toISOString(),
  };
}

/* =========================================================
   PROFILE PROVIDER
========================================================= */

export function ProfileProvider({
  children,
  initialData,
}) {
  /* =======================================================
     STATE
  ======================================================= */

  const [profileData, setProfileData] = useState(() =>
    createProfileData(initialData)
  );

  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState(null);

  /* =======================================================
     GET CURRENT USER
  ======================================================= */

  const getCurrentUser = useCallback(
    async () => {
      try {
        const {
          data,
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        return data?.user || null;
      } catch (authError) {
        console.error(
          "Failed to get current user:",
          authError
        );

        return null;
      }
    },
    []
  );

  /* =======================================================
     LOAD PROFILE
  ======================================================= */

  const loadProfile = useCallback(
    async (currentUser = null) => {
      setLoading(true);
      setError(null);

      try {
        const activeUser =
          currentUser ||
          (await getCurrentUser());

        /* -----------------------------------------------
           NO USER
        ------------------------------------------------ */

        if (!activeUser) {
          setUser(null);

          setProfileData(
            createProfileData()
          );

          return;
        }

        setUser(activeUser);

        /* -----------------------------------------------
           GET PROFILE
        ------------------------------------------------ */

        const {
          data,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", activeUser.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        /* =================================================
           CREATE PROFILE IF IT DOES NOT EXIST
        ================================================= */

        if (!data) {
          const newProfile =
            createProfileData({
              contact: {
                email:
                  activeUser.email || "",
              },
            });

          const row =
            profileDataToSupabaseRow(
              newProfile,
              activeUser.id
            );

          const {
            data: createdProfile,
            error: createError,
          } = await supabase
            .from("profiles")
            .insert(row)
            .select()
            .single();

          if (createError) {
            throw createError;
          }

          setProfileData(
            supabaseRowToProfile(
              createdProfile
            )
          );

          return;
        }

        /* =================================================
           LOAD EXISTING PROFILE
        ================================================= */

        setProfileData(
          supabaseRowToProfile(data)
        );
      } catch (loadError) {
        console.error(
          "Failed to load profile:",
          loadError
        );

        setError(
          loadError?.message ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    },
    [getCurrentUser]
  );

  /* =======================================================
     INITIAL LOAD + AUTH LISTENER
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const initializeProfile =
      async () => {
        if (!mounted) {
          return;
        }

        await loadProfile();
      };

    initializeProfile();

    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (!mounted) {
            return;
          }

          const currentUser =
            session?.user || null;

          setUser(currentUser);

          if (currentUser) {
            setTimeout(() => {
              if (mounted) {
                loadProfile(
                  currentUser
                );
              }
            }, 0);
          } else {
            setProfileData(
              createProfileData()
            );

            setLoading(false);
          }
        }
      );

    return () => {
      mounted = false;

      authListener?.subscription?.unsubscribe();
    };
  }, [loadProfile]);

  /* =======================================================
     SAVE PROFILE
  ======================================================= */

  const saveProfile = useCallback(
    async (dataToSave = null) => {
      setSaving(true);
      setError(null);

      try {
        const activeUser =
          user ||
          (await getCurrentUser());

        if (!activeUser) {
          throw new Error(
            "You must be logged in to save your profile."
          );
        }

        const finalData =
          dataToSave || profileData;

        const row =
          profileDataToSupabaseRow(
            finalData,
            activeUser.id
          );

        const {
          data,
          error: saveError,
        } = await supabase
          .from("profiles")
          .upsert(row, {
            onConflict: "id",
          })
          .select()
          .single();

        if (saveError) {
          throw saveError;
        }

        setProfileData(
          supabaseRowToProfile(data)
        );

        return {
          success: true,
          data,
        };
      } catch (saveError) {
        console.error(
          "Failed to save profile:",
          saveError
        );

        setError(
          saveError?.message ||
            "Failed to save profile."
        );

        return {
          success: false,
          error: saveError,
        };
      } finally {
        setSaving(false);
      }
    },
    [
      user,
      profileData,
      getCurrentUser,
    ]
  );

  /* =======================================================
     UPDATE PROFILE
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
     UPDATE CONTACT
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

  const addSkill = useCallback(
    (skill) => {
      const cleanSkill =
        String(skill || "").trim();

      if (!cleanSkill) {
        return;
      }

      setProfileData((prev) => {
        const exists =
          prev.skills.some(
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
    },
    []
  );

  const removeSkill = useCallback(
    (skill) => {
      setProfileData((prev) => ({
        ...prev,

        skills:
          prev.skills.filter(
            (item) =>
              String(item).toLowerCase() !==
              String(skill).toLowerCase()
          ),
      }));
    },
    []
  );

  const updateSkills = useCallback(
    (skills) => {
      setProfileData((prev) => ({
        ...prev,

        skills: Array.isArray(skills)
          ? skills
          : [],
      }));
    },
    []
  );

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
              typeof crypto !==
                "undefined" &&
              crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random()}`,

            institution: "",
            degree: "",
            fieldOfStudy: "",
            location: "",
            startDate: "",
            endDate: "",
            currentlyStudying:
              false,
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

        education:
          prev.education.map(
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

  const removeEducation = useCallback(
    (id) => {
      setProfileData((prev) => ({
        ...prev,

        education:
          prev.education.filter(
            (item) => item.id !== id
          ),
      }));
    },
    []
  );

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
              typeof crypto !==
                "undefined" &&
              crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random()}`,

            company: "",
            position: "",
            location: "",
            employmentType: "",
            startDate: "",
            endDate: "",
            currentlyWorking:
              false,
            description: "",

            ...(experienceItem || {}),
          },
        ],
      }));
    },
    []
  );

  const updateExperience =
    useCallback(
      (id, field, value) => {
        setProfileData((prev) => ({
          ...prev,

          experience:
            prev.experience.map(
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

  const removeExperience =
    useCallback(
      (id) => {
        setProfileData((prev) => ({
          ...prev,

          experience:
            prev.experience.filter(
              (item) =>
                item.id !== id
            ),
        }));
      },
      []
    );

  /* =======================================================
     UPDATE ENTIRE PROFILE
  ======================================================= */

  const updateProfileData =
    useCallback(
      (updatedData) => {
        if (!updatedData) {
          return;
        }

        setProfileData((prev) => ({
          ...prev,

          profile: {
            ...prev.profile,
            ...(updatedData.profile ||
              {}),
          },

          contact: {
            ...prev.contact,
            ...(updatedData.contact ||
              {}),
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

  const resetProfile = useCallback(
    async () => {
      setError(null);

      try {
        const activeUser =
          user ||
          (await getCurrentUser());

        if (!activeUser) {
          setProfileData(
            createProfileData()
          );

          return {
            success: true,
          };
        }

        /* -----------------------------------------------
           Try to remove profile photos
        ------------------------------------------------ */

        try {
          const {
            data: existingFiles,
          } =
            await supabase.storage
              .from(
                PROFILE_PHOTO_BUCKET
              )
              .list(activeUser.id);

          if (
            existingFiles &&
            existingFiles.length > 0
          ) {
            const files =
              existingFiles
                .filter(
                  (item) =>
                    item?.name
                )
                .map(
                  (item) =>
                    `${activeUser.id}/${item.name}`
                );

            if (files.length > 0) {
              await supabase.storage
                .from(
                  PROFILE_PHOTO_BUCKET
                )
                .remove(files);
            }
          }
        } catch (storageError) {
          console.warn(
            "Could not remove profile photos during reset:",
            storageError
          );
        }

        /* -----------------------------------------------
           Reset database profile
        ------------------------------------------------ */

        const emptyProfile =
          createProfileData({
            contact: {
              email:
                activeUser.email || "",
            },
          });

        const row =
          profileDataToSupabaseRow(
            emptyProfile,
            activeUser.id
          );

        const {
          data,
          error: resetError,
        } = await supabase
          .from("profiles")
          .upsert(row, {
            onConflict: "id",
          })
          .select()
          .single();

        if (resetError) {
          throw resetError;
        }

        setProfileData(
          supabaseRowToProfile(data)
        );

        return {
          success: true,
        };
      } catch (resetError) {
        console.error(
          "Failed to reset profile:",
          resetError
        );

        setError(
          resetError?.message ||
            "Failed to reset profile."
        );

        return {
          success: false,
          error: resetError,
        };
      }
    },
    [user, getCurrentUser]
  );

  /* =======================================================
     SET PROFILE
  ======================================================= */

  const setProfile = useCallback(
    (data) => {
      if (!data) {
        return;
      }

      setProfileData(
        createProfileData(data)
      );
    },
    []
  );

  /* =======================================================
     UPLOAD PROFILE PHOTO
  ======================================================= */

  const uploadProfilePhoto =
    useCallback(
      async (file) => {
        setError(null);

        try {
          /* =================================================
             VALIDATE FILE
          ================================================= */

          if (!file) {
            throw new Error(
              "Please select an image."
            );
          }

          if (
            !file.type.startsWith(
              "image/"
            )
          ) {
            throw new Error(
              "Please select a valid image file."
            );
          }

          if (
            file.size >
            5 * 1024 * 1024
          ) {
            throw new Error(
              "Profile image must be smaller than 5MB."
            );
          }

          /* =================================================
             GET USER
          ================================================= */

          const activeUser =
            user ||
            (await getCurrentUser());

          if (!activeUser) {
            throw new Error(
              "You must be logged in to upload a profile photo."
            );
          }

          /* =================================================
             FILE EXTENSION
          ================================================= */

          const fileExtension =
            file.name
              .split(".")
              .pop()
              ?.toLowerCase() ||
            "jpg";

          /* =================================================
             UNIQUE FILE PATH
          ================================================= */

          const filePath =
            `${activeUser.id}/profile-${Date.now()}.${fileExtension}`;

          /* =================================================
             REMOVE OLD PROFILE IMAGES
          ================================================= */

          const {
            data: existingFiles,
            error: listError,
          } =
            await supabase.storage
              .from(
                PROFILE_PHOTO_BUCKET
              )
              .list(activeUser.id);

          /*
            Don't use listBuckets() here.

            The bucket can exist while the current user
            does not have permission to list all buckets.
          */

          if (listError) {
            console.warn(
              "Could not list previous profile images:",
              listError
            );
          }

          if (
            existingFiles &&
            existingFiles.length > 0
          ) {
            const oldFiles =
              existingFiles
                .filter(
                  (item) =>
                    item?.name &&
                    item.name.startsWith(
                      "profile-"
                    )
                )
                .map(
                  (item) =>
                    `${activeUser.id}/${item.name}`
                );

            if (
              oldFiles.length > 0
            ) {
              const {
                error:
                  removeOldError,
              } =
                await supabase.storage
                  .from(
                    PROFILE_PHOTO_BUCKET
                  )
                  .remove(
                    oldFiles
                  );

              if (
                removeOldError
              ) {
                console.warn(
                  "Could not remove previous profile images:",
                  removeOldError
                );
              }
            }
          }

          /* =================================================
             UPLOAD IMAGE
          ================================================= */

          const {
            data: uploadData,
            error: uploadError,
          } =
            await supabase.storage
              .from(
                PROFILE_PHOTO_BUCKET
              )
              .upload(
                filePath,
                file,
                {
                  cacheControl:
                    "3600",

                  upsert: false,

                  contentType:
                    file.type,
                }
              );

          if (uploadError) {
            console.error(
              "Supabase upload error:",
              uploadError
            );

            throw uploadError;
          }

          /* =================================================
             GET PUBLIC URL
          ================================================= */

          const {
            data:
              publicUrlData,
          } =
            supabase.storage
              .from(
                PROFILE_PHOTO_BUCKET
              )
              .getPublicUrl(
                filePath
              );

          const photoUrl =
            publicUrlData?.publicUrl ||
            "";

          if (!photoUrl) {
            throw new Error(
              "Could not generate the profile image URL."
            );
          }

          /* =================================================
             SAVE PHOTO URL TO PROFILE
          ================================================= */

          const {
            data:
              updatedProfile,
            error:
              databaseError,
          } =
            await supabase
              .from("profiles")
              .update({
                photo_url:
                  photoUrl,

                updated_at:
                  new Date().toISOString(),
              })
              .eq(
                "id",
                activeUser.id
              )
              .select()
              .single();

          if (databaseError) {
            /*
              Clean up uploaded file if
              database update fails.
            */

            try {
              await supabase.storage
                .from(
                  PROFILE_PHOTO_BUCKET
                )
                .remove([
                  filePath,
                ]);
            } catch (cleanupError) {
              console.warn(
                "Could not clean up uploaded image:",
                cleanupError
              );
            }

            throw databaseError;
          }

          /* =================================================
             UPDATE REACT STATE
          ================================================= */

          setProfileData((prev) => ({
            ...prev,

            profile: {
              ...prev.profile,

              photo:
                updatedProfile?.photo_url ||
                photoUrl,
            },
          }));

          return {
            success: true,
            url: photoUrl,
            path: filePath,
            data: uploadData,
          };
        } catch (uploadError) {
          console.error(
            "Failed to upload profile photo:",
            uploadError
          );

          let message =
            uploadError?.message ||
            "Failed to upload profile photo.";

          /*
            Make common Supabase errors
            easier to understand.
          */

          if (
            message
              .toLowerCase()
              .includes("bucket not found")
          ) {
            message =
              `The "${PROFILE_PHOTO_BUCKET}" bucket could not be accessed. Check that the bucket name is exactly "${PROFILE_PHOTO_BUCKET}" and that your Storage policies allow authenticated users to upload files.`;
          }

          if (
            message
              .toLowerCase()
              .includes(
                "row-level security"
              )
          ) {
            message =
              "Supabase Storage blocked the upload because of Row Level Security policies. Add an INSERT policy for authenticated users.";
          }

          setError(message);

          return {
            success: false,
            error: uploadError,
          };
        }
      },
      [
        user,
        getCurrentUser,
      ]
    );

  /* =======================================================
     REMOVE PROFILE PHOTO
  ======================================================= */

  const removeProfilePhoto =
    useCallback(async () => {
      setError(null);

      try {
        const activeUser =
          user ||
          (await getCurrentUser());

        if (!activeUser) {
          throw new Error(
            "You must be logged in."
          );
        }

        /* =================================================
           GET USER FILES
        ================================================= */

        const {
          data: existingFiles,
          error: listError,
        } =
          await supabase.storage
            .from(
              PROFILE_PHOTO_BUCKET
            )
            .list(activeUser.id);

        if (listError) {
          throw listError;
        }

        /* =================================================
           DELETE PROFILE IMAGES
        ================================================= */

        if (
          existingFiles &&
          existingFiles.length > 0
        ) {
          const files =
            existingFiles
              .filter(
                (item) =>
                  item?.name &&
                  item.name.startsWith(
                    "profile-"
                  )
              )
              .map(
                (item) =>
                  `${activeUser.id}/${item.name}`
              );

          if (files.length > 0) {
            const {
              error:
                removeError,
            } =
              await supabase.storage
                .from(
                  PROFILE_PHOTO_BUCKET
                )
                .remove(files);

            if (removeError) {
              throw removeError;
            }
          }
        }

        /* =================================================
           CLEAR DATABASE URL
        ================================================= */

        const {
          data:
            updatedProfile,
          error:
            updateError,
        } =
          await supabase
            .from("profiles")
            .update({
              photo_url: "",

              updated_at:
                new Date().toISOString(),
            })
            .eq(
              "id",
              activeUser.id
            )
            .select()
            .single();

        if (updateError) {
          throw updateError;
        }

        /* =================================================
           UPDATE LOCAL STATE
        ================================================= */

        setProfileData((prev) => ({
          ...prev,

          profile: {
            ...prev.profile,

            photo:
              updatedProfile?.photo_url ||
              "",
          },
        }));

        return {
          success: true,
        };
      } catch (removeError) {
        console.error(
          "Failed to remove profile photo:",
          removeError
        );

        setError(
          removeError?.message ||
            "Failed to remove profile photo."
        );

        return {
          success: false,
          error: removeError,
        };
      }
    }, [user, getCurrentUser]);

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = useMemo(
    () => ({
      /* Main data */

      profileData,

      setProfileData,

      setProfile,

      /* User */

      user,

      /* Loading / saving */

      loading,

      saving,

      error,

      /* Supabase */

      loadProfile,

      saveProfile,

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

      /* Photo */

      uploadProfilePhoto,
      removeProfilePhoto,
    }),
    [
      profileData,

      setProfile,

      user,

      loading,
      saving,
      error,

      loadProfile,
      saveProfile,

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

      uploadProfilePhoto,
      removeProfilePhoto,
    ]
  );

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <ProfileContext.Provider
      value={value}
    >
      {children}
    </ProfileContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useProfile() {
  const context =
    useContext(ProfileContext);

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