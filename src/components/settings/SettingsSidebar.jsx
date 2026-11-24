import {
  User,
  Palette,
  FileText,
  Shield,
  AlertTriangle,
} from "lucide-react";

/* =========================================================
   SETTINGS NAVIGATION ITEMS
========================================================= */

const settingsItems = [
  {
    id: "account",
    label: "Account",
    description: "Manage your account information",
    icon: User,
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Customize your experience",
    icon: Palette,
  },
  {
    id: "documents",
    label: "Documents",
    description: "Manage document preferences",
    icon: FileText,
  },
  {
    id: "security",
    label: "Security",
    description: "Password and account security",
    icon: Shield,
  },
  {
    id: "danger",
    label: "Danger Zone",
    description: "Delete your account",
    icon: AlertTriangle,
    danger: true,
  },
];

/* =========================================================
   SETTINGS SIDEBAR
========================================================= */

export default function SettingsSidebar({
  activeSection,
  onSectionChange,
}) {
  return (
    <aside className="w-full">
      <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
        {/* =================================================
            SIDEBAR HEADER
        ================================================= */}

        <div className="px-4 pb-4 pt-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Settings
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Manage your preferences
          </p>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="space-y-1">
          {settingsItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onSectionChange(item.id)
                }
                className={`
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-2xl
                  px-4
                  py-3.5
                  text-left
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? item.danger
                        ? "bg-red-50 text-red-700"
                        : "bg-blue-50 text-blue-700"
                      : item.danger
                      ? "text-slate-600 hover:bg-red-50 hover:text-red-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }
                `}
              >
                {/* =================================================
                    ICON
                ================================================= */}

                <span
                  className={`
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    transition

                    ${
                      isActive
                        ? item.danger
                          ? "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600"
                        : item.danger
                        ? "bg-slate-100 text-slate-500 group-hover:bg-red-100 group-hover:text-red-600"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
                    }
                  `}
                >
                  <Icon size={18} strokeWidth={2} />
                </span>

                {/* =================================================
                    LABEL + DESCRIPTION
                ================================================= */}

                <span className="min-w-0 flex-1">
                  <span
                    className={`
                      block
                      text-sm
                      font-black

                      ${
                        isActive
                          ? item.danger
                            ? "text-red-700"
                            : "text-blue-700"
                          : "text-slate-800"
                      }
                    `}
                  >
                    {item.label}
                  </span>

                  <span
                    className={`
                      mt-0.5
                      block
                      truncate
                      text-xs
                      ${
                        isActive
                          ? item.danger
                            ? "text-red-500"
                            : "text-blue-500"
                          : "text-slate-400"
                      }
                    `}
                  >
                    {item.description}
                  </span>
                </span>

                {/* =================================================
                    ACTIVE INDICATOR
                ================================================= */}

                {isActive && (
                  <span
                    className={`
                      h-2
                      w-2
                      shrink-0
                      rounded-full
                      ${
                        item.danger
                          ? "bg-red-500"
                          : "bg-blue-600"
                      }
                    `}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}