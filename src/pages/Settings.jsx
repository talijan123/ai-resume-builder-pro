import { useState } from "react";

import {
  User,
  Shield,
  Palette,
  FileText,
  AlertTriangle,
} from "lucide-react";

import DashboardHeader from "../components/layout/DashboardHeader";

import SettingsSidebar from "../components/settings/SettingsSidebar";
import AccountSettings from "../components/settings/AccountSettings";
import SecuritySettings from "../components/settings/SecuritySettings";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import DocumentSettings from "../components/settings/DocumentSettings";
import DangerZone from "../components/settings/DangerZone";

import { useSettings } from "../context/SettingsContext";

/* =========================================================
   SETTINGS PAGE
========================================================= */

export default function Settings() {
  const { settings } = useSettings();

  const [activeSection, setActiveSection] =
    useState("account");

  /* =========================================================
     SETTINGS SECTIONS
  ========================================================= */

  const sections = [
    {
      id: "account",
      label: "Account",
      description: "Manage your account",
      icon: User,
    },

    {
      id: "security",
      label: "Security",
      description: "Password and account security",
      icon: Shield,
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

  /* =========================================================
     SECTION CHANGE
  ========================================================= */

  const handleSectionChange = (sectionId) => {
    /*
      Make sure only valid section IDs
      can become active.
    */

    const exists = sections.some(
      (section) =>
        section.id === sectionId
    );

    if (!exists) {
      setActiveSection("account");
      return;
    }

    setActiveSection(sectionId);
  };

  /* =========================================================
     ACTIVE SECTION
  ========================================================= */

  const renderActiveSection = () => {
    switch (activeSection) {
      /* -----------------------------------------------
         ACCOUNT
      ----------------------------------------------- */

      case "account":
        return <AccountSettings />;

      /* -----------------------------------------------
         SECURITY
      ----------------------------------------------- */

      case "security":
        return <SecuritySettings />;

      /* -----------------------------------------------
         APPEARANCE
      ----------------------------------------------- */

      case "appearance":
        return <AppearanceSettings />;

      /* -----------------------------------------------
         DOCUMENTS
      ----------------------------------------------- */

      case "documents":
        return <DocumentSettings />;

      /* -----------------------------------------------
         DANGER ZONE
      ----------------------------------------------- */

      case "danger":
        return <DangerZone />;

      /* -----------------------------------------------
         FALLBACK
      ----------------------------------------------- */

      default:
        return <AccountSettings />;
    }
  };

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          SHARED DASHBOARD HEADER
      ===================================================== */}

      <DashboardHeader
        title="Settings"
        subtitle="Manage your account, security, preferences, and document settings."
      />

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
              onSectionChange={
                handleSectionChange
              }
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