import { useState } from "react";
import {
  User,
  Palette,
  FileText,
  AlertTriangle,
} from "lucide-react";

import SettingsSidebar from "../components/settings/SettingsSidebar";
import AccountSettings from "../components/settings/AccountSettings";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import DocumentSettings from "../components/settings/DocumentSettings";
import DangerZone from "../components/settings/DangerZone";

import { useSettings } from "../context/SettingsContext";

export default function Settings() {
  const { settings } = useSettings();

  const [activeSection, setActiveSection] =
    useState("account");

  const sections = [
    {
      id: "account",
      label: "Account",
      description: "Manage your account",
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
      description: "Resume and document preferences",
      icon: FileText,
    },

    {
      id: "danger",
      label: "Danger Zone",
      description: "Reset or delete your data",
      icon: AlertTriangle,
    },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case "account":
        return <AccountSettings />;

      case "appearance":
        return <AppearanceSettings />;

      case "documents":
        return <DocumentSettings />;

      case "danger":
        return <DangerZone />;

      default:
        return <AccountSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          {/* Left */}

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                text-slate-700
                transition
                hover:bg-slate-100
              "
            >
              ←
            </button>

            <div>
              <h1 className="text-xl font-black text-slate-900">
                Settings
              </h1>

              <p className="hidden text-sm text-slate-500 sm:block">
                Manage your account, preferences, and
                document settings.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside>
            <SettingsSidebar
              sections={sections}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </aside>

          {/* =================================================
              SETTINGS CONTENT
          ================================================= */}

          <section className="min-w-0">
            {renderActiveSection()}
          </section>
        </div>
      </main>
    </div>
  );
}