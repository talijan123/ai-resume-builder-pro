import {
    createContext,
    useContext,
    useState,
} from "react";

const ResumeContext = createContext();

const initialResumeData = {
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

export function ResumeProvider({ children }) {
    const [resumeData, setResumeData] =
        useState(initialResumeData);

    const [activeSection, setActiveSection] =
        useState("personal");

    /* -------------------------------- */
    /* Personal Information */
    /* -------------------------------- */

    function updatePersonalInfo(field, value) {
        setResumeData((prev) => ({
            ...prev,

            personalInfo: {
                ...prev.personalInfo,

                [field]: value,
            },
        }));
    }

    /* -------------------------------- */
    /* Experience */
    /* -------------------------------- */

    function addExperience(experience) {
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
    }

    function updateExperience(
        id,
        updatedExperience
    ) {
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
    }

    function deleteExperience(id) {
        setResumeData((prev) => ({
            ...prev,

            experience: prev.experience.filter(
                (exp) => exp.id !== id
            ),
        }));
    }

    /* -------------------------------- */
    /* Education */
    /* -------------------------------- */

    function addEducation(education) {
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
    }

    function updateEducation(
        id,
        updatedEducation
    ) {
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
    }

    function deleteEducation(id) {
        setResumeData((prev) => ({
            ...prev,

            education: prev.education.filter(
                (edu) => edu.id !== id
            ),
        }));
    }
    /* -------------------------------- */
    /* Skills */
    /* -------------------------------- */

    function addSkill(skill) {
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
    }

    function updateSkill(id, updatedSkill) {
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
    }

    function deleteSkill(id) {
        setResumeData((prev) => ({
            ...prev,

            skills: prev.skills.filter(
                (skill) => skill.id !== id
            ),
        }));
    }

    /* -------------------------------- */
    /* Reset */
    /* -------------------------------- */

    function resetResume() {
        setResumeData(initialResumeData);

        setActiveSection("personal");
    }

    return (
        <ResumeContext.Provider
            value={{
                resumeData,
                setResumeData,

                activeSection,
                setActiveSection,

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

                resetResume,
            }}
        >
            {children}
        </ResumeContext.Provider>
    );
}

export function useResume() {
    const context = useContext(ResumeContext);

    if (!context) {
        throw new Error(
            "useResume must be used inside ResumeProvider."
        );
    }

    return context;
}