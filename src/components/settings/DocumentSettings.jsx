import { useEffect, useState } from "react";
import {
  FileText,
  Save,
  CheckCircle2,
  RotateCcw,
  Download,
  Eye,
} from "lucide-react";

import { useSettings } from "../../context/SettingsContext";

/* =========================================================
   DOCUMENT SETTINGS
========================================================= */

export default function DocumentSettings() {
  const {
    settings,
    updateSettings,
    saveSettings,
    loading,
    saving,
  } = useSettings();

  /* =======================================================
     LOCAL STATE
  ======================================================= */

  const [saved, setSaved] = useState(false);

  const [documentSettings, setDocumentSettings] = useState({
    defaultDocumentType: "resume",
    defaultTemplate: "professional",
    fontSize: "medium",
    pageSize: "A4",
    colorMode: "color",
    showPhoto: true,
    showContactInformation: true,
    showSummary: true,
    showSkills: true,
    showEducation: true,
    showExperience: true,
    showProjects: true,
    showCertifications: true,
    showLanguages: true,
    showReferences: false,
    autoSave: true,
    downloadFormat: "pdf",
  });

  /* =======================================================
     LOAD SETTINGS
  ======================================================= */

  useEffect(() => {
    if (!settings) {
      return;
    }

    setDocumentSettings((previous) => ({
      ...previous,

      defaultDocumentType:
        settings.defaultDocumentType ||
        settings.default_document_type ||
        previous.defaultDocumentType,

      defaultTemplate:
        settings.defaultTemplate ||
        settings.default_template ||
        previous.defaultTemplate,

      fontSize:
        settings.fontSize ||
        settings.font_size ||
        previous.fontSize,

      pageSize:
        settings.pageSize ||
        settings.page_size ||
        previous.pageSize,

      colorMode:
        settings.colorMode ||
        settings.color_mode ||
        previous.colorMode,

      showPhoto:
        settings.showPhoto ??
        settings.show_photo ??
        previous.showPhoto,

      showContactInformation:
        settings.showContactInformation ??
        settings.show_contact_information ??
        previous.showContactInformation,

      showSummary:
        settings.showSummary ??
        settings.show_summary ??
        previous.showSummary,

      showSkills:
        settings.showSkills ??
        settings.show_skills ??
        previous.showSkills,

      showEducation:
        settings.showEducation ??
        settings.show_education ??
        previous.showEducation,

      showExperience:
        settings.showExperience ??
        settings.show_experience ??
        previous.showExperience,

      showProjects:
        settings.showProjects ??
        settings.show_projects ??
        previous.showProjects,

      showCertifications:
        settings.showCertifications ??
        settings.show_certifications ??
        previous.showCertifications,

      showLanguages:
        settings.showLanguages ??
        settings.show_languages ??
        previous.showLanguages,

      showReferences:
        settings.showReferences ??
        settings.show_references ??
        previous.showReferences,

      autoSave:
        settings.autoSave ??
        settings.auto_save ??
        previous.autoSave,

      downloadFormat:
        settings.downloadFormat ||
        settings.download_format ||
        previous.downloadFormat,
    }));
  }, [settings]);

  /* =======================================================
     UPDATE LOCAL SETTING
  ======================================================= */

  const updateLocalSetting = (field, value) => {
    setDocumentSettings((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSaved(false);
  };

  /* =======================================================
     SAVE DOCUMENT SETTINGS
  ======================================================= */

  const handleSave = async () => {
    try {
      const payload = {
        ...documentSettings,

        default_document_type:
          documentSettings.defaultDocumentType,

        default_template:
          documentSettings.defaultTemplate,

        font_size:
          documentSettings.fontSize,

        page_size:
          documentSettings.pageSize,

        color_mode:
          documentSettings.colorMode,

        show_photo:
          documentSettings.showPhoto,

        show_contact_information:
          documentSettings.showContactInformation,

        show_summary:
          documentSettings.showSummary,

        show_skills:
          documentSettings.showSkills,

        show_education:
          documentSettings.showEducation,

        show_experience:
          documentSettings.showExperience,

        show_projects:
          documentSettings.showProjects,

        show_certifications:
          documentSettings.showCertifications,

        show_languages:
          documentSettings.showLanguages,

        show_references:
          documentSettings.showReferences,

        auto_save:
          documentSettings.autoSave,

        download_format:
          documentSettings.downloadFormat,
      };

      /*
        If your SettingsContext exposes saveSettings(),
        use it. Otherwise updateSettings() will still
        update the context state.
      */

      if (typeof updateSettings === "function") {
        await updateSettings(payload);
      }

      if (typeof saveSettings === "function") {
        await saveSettings(payload);
      }

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error(
        "Failed to save document settings:",
        error
      );
    }
  };

  /* =======================================================
     RESET DOCUMENT SETTINGS
  ======================================================= */

  const handleReset = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset your document settings?"
    );

    if (!confirmed) {
      return;
    }

    setDocumentSettings({
      defaultDocumentType: "resume",
      defaultTemplate: "professional",
      fontSize: "medium",
      pageSize: "A4",
      colorMode: "color",
      showPhoto: true,
      showContactInformation: true,
      showSummary: true,
      showSkills: true,
      showEducation: true,
      showExperience: true,
      showProjects: true,
      showCertifications: true,
      showLanguages: true,
      showReferences: false,
      autoSave: true,
      downloadFormat: "pdf",
    });

    setSaved(false);
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="animate-pulse space-y-5">
          <div className="h-7 w-48 rounded-lg bg-slate-200" />
          <div className="h-4 w-80 rounded bg-slate-100" />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="h-12 rounded-xl bg-slate-100" />
            <div className="h-12 rounded-xl bg-slate-100" />
            <div className="h-12 rounded-xl bg-slate-100" />
            <div className="h-12 rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700">
          <FileText size={14} />
          Documents
        </div>

        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          Document Settings
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Customize how your resumes and other documents
          are created, displayed, and downloaded.
        </p>
      </div>

      {/* =================================================
          DEFAULT DOCUMENT
      ================================================= */}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        <SectionHeader
          number="01"
          title="Default Document"
          description="Choose the document options used when you create a new document."
        />

        <div className="grid gap-5 md:grid-cols-2">

          <SelectInput
            label="Default Document Type"
            value={documentSettings.defaultDocumentType}
            onChange={(value) =>
              updateLocalSetting(
                "defaultDocumentType",
                value
              )
            }
            options={[
              {
                value: "resume",
                label: "Resume",
              },
              {
                value: "cv",
                label: "CV",
              },
            ]}
          />

          <SelectInput
            label="Default Template"
            value={documentSettings.defaultTemplate}
            onChange={(value) =>
              updateLocalSetting(
                "defaultTemplate",
                value
              )
            }
            options={[
              {
                value: "professional",
                label: "Professional",
              },
              {
                value: "modern",
                label: "Modern",
              },
              {
                value: "minimal",
                label: "Minimal",
              },
              {
                value: "creative",
                label: "Creative",
              },
            ]}
          />

          <SelectInput
            label="Font Size"
            value={documentSettings.fontSize}
            onChange={(value) =>
              updateLocalSetting(
                "fontSize",
                value
              )
            }
            options={[
              {
                value: "small",
                label: "Small",
              },
              {
                value: "medium",
                label: "Medium",
              },
              {
                value: "large",
                label: "Large",
              },
            ]}
          />

          <SelectInput
            label="Page Size"
            value={documentSettings.pageSize}
            onChange={(value) =>
              updateLocalSetting(
                "pageSize",
                value
              )
            }
            options={[
              {
                value: "A4",
                label: "A4",
              },
              {
                value: "letter",
                label: "Letter",
              },
            ]}
          />

          <SelectInput
            label="Document Color"
            value={documentSettings.colorMode}
            onChange={(value) =>
              updateLocalSetting(
                "colorMode",
                value
              )
            }
            options={[
              {
                value: "color",
                label: "Color",
              },
              {
                value: "grayscale",
                label: "Grayscale",
              },
            ]}
          />

          <SelectInput
            label="Download Format"
            value={documentSettings.downloadFormat}
            onChange={(value) =>
              updateLocalSetting(
                "downloadFormat",
                value
              )
            }
            options={[
              {
                value: "pdf",
                label: "PDF",
              },
              {
                value: "docx",
                label: "DOCX",
              },
            ]}
          />

        </div>
      </section>

      {/* =================================================
          DOCUMENT SECTIONS
      ================================================= */}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        <SectionHeader
          number="02"
          title="Document Sections"
          description="Choose which sections should be enabled by default."
        />

        <div className="grid gap-3 md:grid-cols-2">

          <Toggle
            label="Profile Photo"
            description="Include your profile photo."
            checked={documentSettings.showPhoto}
            onChange={(value) =>
              updateLocalSetting(
                "showPhoto",
                value
              )
            }
          />

          <Toggle
            label="Contact Information"
            description="Include email, phone, website and social links."
            checked={
              documentSettings.showContactInformation
            }
            onChange={(value) =>
              updateLocalSetting(
                "showContactInformation",
                value
              )
            }
          />

          <Toggle
            label="Professional Summary"
            description="Include your professional summary."
            checked={documentSettings.showSummary}
            onChange={(value) =>
              updateLocalSetting(
                "showSummary",
                value
              )
            }
          />

          <Toggle
            label="Skills"
            description="Include your skills section."
            checked={documentSettings.showSkills}
            onChange={(value) =>
              updateLocalSetting(
                "showSkills",
                value
              )
            }
          />

          <Toggle
            label="Education"
            description="Include your education history."
            checked={documentSettings.showEducation}
            onChange={(value) =>
              updateLocalSetting(
                "showEducation",
                value
              )
            }
          />

          <Toggle
            label="Experience"
            description="Include your professional experience."
            checked={documentSettings.showExperience}
            onChange={(value) =>
              updateLocalSetting(
                "showExperience",
                value
              )
            }
          />

          <Toggle
            label="Projects"
            description="Include your projects."
            checked={documentSettings.showProjects}
            onChange={(value) =>
              updateLocalSetting(
                "showProjects",
                value
              )
            }
          />

          <Toggle
            label="Certifications"
            description="Include your certifications."
            checked={
              documentSettings.showCertifications
            }
            onChange={(value) =>
              updateLocalSetting(
                "showCertifications",
                value
              )
            }
          />

          <Toggle
            label="Languages"
            description="Include your languages."
            checked={documentSettings.showLanguages}
            onChange={(value) =>
              updateLocalSetting(
                "showLanguages",
                value
              )
            }
          />

          <Toggle
            label="References"
            description="Include references in your document."
            checked={documentSettings.showReferences}
            onChange={(value) =>
              updateLocalSetting(
                "showReferences",
                value
              )
            }
          />

        </div>
      </section>

      {/* =================================================
          WORKFLOW
      ================================================= */}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        <SectionHeader
          number="03"
          title="Document Workflow"
          description="Control how the document editor behaves."
        />

        <Toggle
          label="Auto Save"
          description="Automatically save changes while working on a document."
          checked={documentSettings.autoSave}
          onChange={(value) =>
            updateLocalSetting(
              "autoSave",
              value
            )
          }
        />

      </section>

      {/* =================================================
          DOCUMENT PREVIEW
      ================================================= */}

      <section className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
              <Eye size={22} />
            </div>

            <div>
              <h3 className="font-black text-slate-900">
                Your document preferences are ready
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                New documents will use your selected
                template, page size, sections and
                download format.
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm">
            <Download size={16} />
            {documentSettings.downloadFormat.toUpperCase()}
          </div>

        </div>

      </section>

      {/* =================================================
          SAVE / RESET
      ================================================= */}

      <section className="flex flex-col gap-4 rounded-3xl border border-blue-100 bg-blue-50 p-6 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <div className="flex items-center gap-2">

            {saved && (
              <CheckCircle2
                size={18}
                className="text-green-600"
              />
            )}

            <h3 className="font-black text-slate-900">
              {saved
                ? "Document settings saved"
                : "Keep your document preferences updated"}
            </h3>

          </div>

          <p className="mt-1 text-sm text-slate-600">
            These preferences will be used when creating
            and exporting your documents.
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          <button
            type="button"
            onClick={handleReset}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-5
              py-3
              text-sm
              font-black
              text-slate-700
              transition
              hover:bg-slate-50
            "
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              px-6
              py-3
              text-sm
              font-black
              text-white
              shadow-md
              shadow-blue-500/20
              transition
              hover:-translate-y-0.5
              hover:shadow-lg
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {saved ? (
              <>
                <CheckCircle2 size={17} />
                Saved
              </>
            ) : (
              <>
                <Save size={17} />
                {saving
                  ? "Saving..."
                  : "Save Settings"}
              </>
            )}
          </button>

        </div>

      </section>

    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  number,
  title,
  description,
}) {
  return (
    <div className="mb-7">

      <div className="flex items-center gap-3">

        <span
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-blue-600
            text-xs
            font-black
            text-white
          "
        >
          {number}
        </span>

        <h3 className="text-lg font-black text-slate-900">
          {title}
        </h3>

      </div>

      <p className="mt-2 pl-11 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   SELECT INPUT
========================================================= */

function SelectInput({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <label className="block">

      <span className="mb-1.5 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <select
        value={value || ""}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="
          h-11
          w-full
          rounded-xl
          border
          border-slate-200
          bg-white
          px-4
          text-sm
          font-medium
          text-slate-800
          outline-none
          transition
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

    </label>
  );
}

/* =========================================================
   TOGGLE
========================================================= */

function Toggle({
  label,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">

      <div className="min-w-0">

        <h4 className="text-sm font-black text-slate-800">
          {label}
        </h4>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>

      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() =>
          onChange(!checked)
        }
        className={`
          relative
          h-6
          w-11
          shrink-0
          rounded-full
          transition
          ${
            checked
              ? "bg-blue-600"
              : "bg-slate-300"
          }
        `}
      >
        <span
          className={`
            absolute
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            rounded-full
            bg-white
            shadow-sm
            transition
            ${
              checked
                ? "left-6"
                : "left-1"
            }
          `}
        />
      </button>

    </div>
  );
}