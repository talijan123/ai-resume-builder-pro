import { useResume } from "../../context/ResumeContext";

import {
    HiUser,
    HiBriefcase,
    HiAcademicCap,
    HiWrenchScrewdriver,
    HiFolder,
    HiTrophy,
    HiCheckCircle,
} from "react-icons/hi2";

import PersonalInfoForm from "./sections/PersonalInfoForm";
import ExperienceForm from "./sections/ExperienceForm";
import EducationForm from "./sections/EducationForm";
import SkillsForm from "./sections/SkillsForm";
import ProjectsForm from "./sections/ProjectsForm";
import CertificationsForm from "./sections/CertificationsForm";


// Upcoming Forms
// import EducationForm from "./sections/EducationForm";
// import SkillsForm from "./sections/SkillsForm";
// import CertificationsForm from "./sections/CertificationsForm";

const sections = {
    personal: {
        title: "Personal Information",
        description:
            "Tell employers who you are and how they can contact you.",
        icon: HiUser,
    },

    experience: {
        title: "Work Experience",
        description:
            "Showcase your professional work experience.",
        icon: HiBriefcase,
    },

    education: {
        title: "Education",
        description:
            "Add your educational background.",
        icon: HiAcademicCap,
    },

    skills: {
        title: "Skills",
        description:
            "Highlight your technical and professional skills.",
        icon: HiWrenchScrewdriver,
    },

    projects: {
        title: "Projects",
        description:
            "Show your best projects and achievements.",
        icon: HiFolder,
    },

    certifications: {
        title: "Certificates",
        description:
            "Add certifications and professional courses.",
        icon: HiTrophy,
    },
};

export default function BuilderContent() {
    const { activeSection } = useResume();

    const current = sections[activeSection];
    const Icon = current.icon;

    function renderSection() {
        switch (activeSection) {
            case "personal":
                return <PersonalInfoForm />;

            case "experience":
                return <ExperienceForm />;

            case "education":
                return <EducationForm />;

            case "skills":
                return <SkillsForm />;

            case "projects":
                return (
                    <ProjectsForm />
                );

            case "certifications":
                return (
                    <CertificationsForm />
                );

            default:
                return <PersonalInfoForm />;
        }
    }

    return (
        <div
            className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
        >
            {/* Header */}

            <div className="border-b border-slate-200 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div
                            className="
                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-2xl

                bg-gradient-to-r
                from-blue-600
                to-indigo-600

                text-white
              "
                        >
                            <Icon size={28} />
                        </div>

                        <div>
                            <h2 className="text-3xl font-black text-slate-900">
                                {current.title}
                            </h2>

                            <p className="mt-2 text-slate-500">
                                {current.description}
                            </p>
                        </div>
                    </div>

                    <div
                        className="
              flex
              items-center
              gap-2

              rounded-full

              bg-green-50

              px-4
              py-2

              text-sm
              font-medium

              text-green-700
            "
                    >
                        <div
                            className="
    flex
    items-center
    gap-2

    rounded-full

    bg-blue-50

    px-4
    py-2

    text-sm

    font-medium

    text-blue-700
  "
                        >
                            <div
                                className="
      h-2
      w-2

      rounded-full

      bg-blue-600
    "
                            />

                            Editing Draft
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Form */}

            <div className="p-8">
                {renderSection()}
            </div>
        </div>
    );
}

function Placeholder({ title, description }) {
    return (
        <div
            className="
        rounded-2xl
        border
        border-dashed
        border-slate-300
        bg-slate-50
        p-20
        text-center
      "
        >
            <h2 className="text-2xl font-bold text-slate-900">
                {title}
            </h2>

            <p className="mt-3 text-slate-500">
                {description}
            </p>
        </div>
    );
}