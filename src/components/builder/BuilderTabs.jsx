import { useResume } from "../../context/ResumeContext";

const tabs = [
  {
    id: "personal",
    label: "Personal",
  },
  {
    id: "experience",
    label: "Experience",
  },
  {
    id: "education",
    label: "Education",
  },
  {
    id: "skills",
    label: "Skills",
  },
  {
    id: "projects",
    label: "Projects",
  },
  {
    id: "certifications",
    label: "Certificates",
  },
];

export default function BuilderTabs() {
  const {
    activeSection,
    setActiveSection,
  } = useResume();

  return (
    <div
      className="
        flex
        gap-3
        overflow-x-auto
        border-b
        border-slate-200
        p-5
      "
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() =>
            setActiveSection(tab.id)
          }
          className={`
            whitespace-nowrap

            rounded-xl

            px-5
            py-3

            font-medium

            transition-all

            ${
              activeSection === tab.id
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}