import {
  HiUser,
  HiBriefcase,
  HiAcademicCap,
  HiWrenchScrewdriver,
  HiFolder,
  HiTrophy,
} from "react-icons/hi2";

import { useResume } from "../../context/ResumeContext";

const tabs = [
  {
    id: "personal",
    label: "Personal",
    icon: HiUser,
  },
  {
    id: "experience",
    label: "Experience",
    icon: HiBriefcase,
  },
  {
    id: "education",
    label: "Education",
    icon: HiAcademicCap,
  },
  {
    id: "skills",
    label: "Skills",
    icon: HiWrenchScrewdriver,
  },
  {
    id: "projects",
    label: "Projects",
    icon: HiFolder,
  },
  {
    id: "certifications",
    label: "Certificates",
    icon: HiTrophy,
  },
];

export default function BuilderTabs() {
  const { activeSection, setActiveSection } = useResume();

  return (
    <div
      className="
        flex
        gap-2
        overflow-x-auto
        no-scrollbar
        border-b
        border-slate-200
        dark:border-slate-800
        bg-slate-50/50
        dark:bg-slate-900/50
        p-3
        sm:p-4
      "
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeSection === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSection(tab.id)}
            className={`
              flex
              items-center
              gap-2
              whitespace-nowrap
              rounded-xl
              px-3.5
              py-2
              text-xs
              font-bold
              transition-all
              shrink-0
              cursor-pointer
              ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-750"
              }
            `}
          >
            <Icon size={16} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}