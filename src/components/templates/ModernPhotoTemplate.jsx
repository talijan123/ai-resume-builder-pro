import { useResume } from "../../context/ResumeContext";
import {
  HiEnvelope,
  HiPhone,
  HiMapPin,
  HiGlobeAlt,
  HiAcademicCap,
  HiBriefcase,
  HiSparkles,
  HiTrophy,
  HiDocumentCheck,
  HiLanguage,
  HiFolder,
  HiCalendarDays,
} from "react-icons/hi2";
import { FaLinkedin, FaGithub, FaVenusMars } from "react-icons/fa";

export default function ModernPhotoTemplate({ previewData = null }) {
  const { resumeData } = useResume();
  const data = previewData || resumeData || {};

  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    awards = [],
    languages = [],
  } = data;

  /* =========================================
     Helpers
  ========================================= */

  function getDescription(item) {
    if (!item) return "";
    return item.description || item.details || item.notes || "";
  }

  function getSkillName(skill) {
    if (typeof skill === "string") return skill;
    return skill?.name || skill?.skill || skill?.title || "";
  }

  function getDateRange(item) {
    if (!item) return "";
    const start = item.startDate || item.start || "";
    const end = item.endDate || item.end || "";
    if (start && end) {
      return `${start} — ${end}`;
    }
    return start || end;
  }

  function getProjectTechnologies(technologies) {
    if (!technologies) return [];
    if (Array.isArray(technologies)) {
      return technologies;
    }
    if (typeof technologies === "string") {
      return technologies.split(",").map((t) => t.trim()).filter(Boolean);
    }
    return [];
  }

  const photo =
    personalInfo.photo ||
    personalInfo.photoUrl ||
    personalInfo.avatarUrl ||
    personalInfo.profileImage ||
    "";

  const fullName = personalInfo.fullName || "Candidate Name";
  const jobTitle = personalInfo.jobTitle || "Professional Title";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "CV";

  return (
    <div className="resume-container relative mx-auto w-full max-w-[794px] min-h-[1123px] bg-white text-slate-800 shadow-sm overflow-hidden flex flex-col font-sans">
      {/* =========================================
          TOP BANNER & FLOATING PHOTO PROFILE
      ========================================= */}
      <header className="relative bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 text-white px-8 pt-8 pb-7">
        <div className="flex items-center gap-6">
          {/* Avatar Container */}
          <div className="relative h-28 w-28 shrink-0 rounded-2xl border-4 border-white bg-white shadow-xl overflow-hidden flex items-center justify-center">
            {photo ? (
              <img
                src={photo}
                alt={fullName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 text-white font-black text-3xl tracking-wider select-none ${
                photo ? "hidden" : "flex"
              }`}
            >
              {initials}
            </div>
          </div>

          {/* Name & Title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow-sm truncate">
              {fullName}
            </h1>
            <p className="mt-1 text-base sm:text-lg font-medium text-sky-100">
              {jobTitle}
            </p>
            {personalInfo.summary && (
              <p className="mt-2 text-xs leading-relaxed text-blue-50/90 line-clamp-2">
                {personalInfo.summary}
              </p>
            )}
          </div>
        </div>

        {/* Quick Contact Ribbon */}
        <div className="mt-5 pt-3 border-t border-white/20 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-sky-100">
          {personalInfo.email && (
            <span className="flex items-center gap-1.5">
              <HiEnvelope className="text-white text-sm" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <HiPhone className="text-white text-sm" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1.5">
              <HiMapPin className="text-white text-sm" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1.5">
              <HiGlobeAlt className="text-white text-sm" />
              {personalInfo.website}
            </span>
          )}
        </div>
      </header>

      {/* =========================================
          TWO COLUMN CONTENT
      ========================================= */}
      <div className="flex-1 flex flex-row">
        {/* Left Side Column */}
        <aside className="w-[33%] bg-slate-50 p-6 flex flex-col gap-6 border-r border-slate-200">
          {/* ONLINE PROFILES */}
          {(personalInfo.linkedin ||
            personalInfo.github ||
            personalInfo.gender ||
            personalInfo.dob) && (
            <div className="resume-section">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 pb-2 mb-3 border-b-2 border-blue-600">
                Personal Info
              </h3>
              <div className="space-y-2 text-xs text-slate-600">
                {personalInfo.linkedin && (
                  <div className="flex items-start gap-2 break-all">
                    <FaLinkedin className="mt-0.5 text-blue-600 shrink-0 text-sm" />
                    <span>{personalInfo.linkedin}</span>
                  </div>
                )}
                {personalInfo.github && (
                  <div className="flex items-start gap-2 break-all">
                    <FaGithub className="mt-0.5 text-slate-700 shrink-0 text-sm" />
                    <span>{personalInfo.github}</span>
                  </div>
                )}
                {personalInfo.gender && (
                  <div className="flex items-start gap-2">
                    <FaVenusMars className="mt-0.5 text-blue-600 shrink-0 text-sm" />
                    <span>{personalInfo.gender}</span>
                  </div>
                )}
                {personalInfo.dob && (
                  <div className="flex items-start gap-2">
                    <HiCalendarDays className="mt-0.5 text-blue-600 shrink-0 text-sm" />
                    <span>{personalInfo.dob}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SKILLS */}
          {skills && skills.length > 0 && (
            <div className="resume-section">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 pb-2 mb-3 border-b-2 border-blue-600 flex items-center gap-1.5">
                <HiSparkles className="text-blue-600" />
                Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => {
                  const sName = getSkillName(skill);
                  if (!sName) return null;
                  return (
                    <span
                      key={skill.id || idx}
                      className="rounded bg-white border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-800 shadow-2xs"
                    >
                      {sName}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {education && education.length > 0 && (
            <div className="resume-section">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 pb-2 mb-3 border-b-2 border-blue-600 flex items-center gap-1.5">
                <HiAcademicCap className="text-blue-600" />
                Education
              </h3>
              <div className="space-y-3.5">
                {education.map((item) => (
                  <div key={item.id} className="resume-entry text-xs">
                    <h4 className="font-bold text-slate-900 leading-tight">
                      {item.degree || item.program}
                    </h4>
                    <p className="text-blue-600 font-medium mt-0.5">
                      {item.institution || item.school}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {getDateRange(item)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {certifications && certifications.length > 0 && (
            <div className="resume-section">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 pb-2 mb-3 border-b-2 border-blue-600 flex items-center gap-1.5">
                <HiDocumentCheck className="text-blue-600" />
                Certifications
              </h3>
              <div className="space-y-3 text-xs">
                {certifications.map((cert, idx) => (
                  <div key={cert.id || idx} className="resume-entry">
                    <p className="font-bold text-slate-900 leading-snug">
                      {cert.name || cert.title}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {cert.issuer || cert.organization}
                      {cert.date ? ` • ${cert.date}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LANGUAGES */}
          {languages && languages.length > 0 && (
            <div className="resume-section">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 pb-2 mb-3 border-b-2 border-blue-600 flex items-center gap-1.5">
                <HiLanguage className="text-blue-600" />
                Languages
              </h3>
              <div className="space-y-1.5 text-xs text-slate-600">
                {languages.map((lang, idx) => {
                  const name =
                    typeof lang === "string"
                      ? lang
                      : lang.name || lang.language;
                  const level =
                    typeof lang === "object"
                      ? lang.proficiency || lang.level
                      : "";
                  return (
                    <div
                      key={lang.id || idx}
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium text-slate-800">{name}</span>
                      {level && (
                        <span className="text-[10px] text-blue-600 font-semibold">
                          {level}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        {/* Right Main Column */}
        <main className="flex-1 bg-white p-7 space-y-6">
          {/* WORK EXPERIENCE */}
          {experience && experience.length > 0 && (
            <section className="resume-section">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xs font-black uppercase tracking-[0.18em] text-slate-900 shrink-0 flex items-center gap-1.5">
                  <HiBriefcase className="text-blue-600 text-sm" />
                  Work Experience
                </h2>
                <div className="h-[2px] flex-1 bg-slate-200" />
              </div>

              <div className="space-y-5">
                {experience.map((item) => {
                  const role = item.jobTitle || item.position || "Role";
                  const company = item.company || "Company";
                  const date = getDateRange(item);
                  const desc = getDescription(item);

                  return (
                    <div
                      key={item.id}
                      className="resume-entry resume-experience-item"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <h3 className="text-sm font-bold text-slate-900">
                          {role}
                        </h3>
                        {date && (
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {date}
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-slate-600 mt-0.5">
                        {company}
                        {item.location ? ` • ${item.location}` : ""}
                      </p>

                      {desc && (
                        <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-slate-600">
                          {desc}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* PROJECTS */}
          {projects && projects.length > 0 && (
            <section className="resume-section">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xs font-black uppercase tracking-[0.18em] text-slate-900 shrink-0 flex items-center gap-1.5">
                  <HiFolder className="text-blue-600 text-sm" />
                  Projects
                </h2>
                <div className="h-[2px] flex-1 bg-slate-200" />
              </div>

              <div className="space-y-4">
                {projects.map((item) => {
                  const projectName = item.name || item.title || "Project";
                  const desc = getDescription(item);
                  const technologies = getProjectTechnologies(
                    item.technologies
                  );
                  const date = getDateRange(item);

                  return (
                    <div
                      key={item.id}
                      className="resume-entry resume-project-item"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <h3 className="text-xs font-bold text-slate-900">
                          {projectName}
                        </h3>
                        {date && (
                          <span className="text-[11px] font-semibold text-slate-400">
                            {date}
                          </span>
                        )}
                      </div>

                      {desc && (
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">
                          {desc}
                        </p>
                      )}

                      {technologies.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* AWARDS */}
          {awards && awards.length > 0 && (
            <section className="resume-section">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xs font-black uppercase tracking-[0.18em] text-slate-900 shrink-0 flex items-center gap-1.5">
                  <HiTrophy className="text-blue-600 text-sm" />
                  Honors & Awards
                </h2>
                <div className="h-[2px] flex-1 bg-slate-200" />
              </div>

              <div className="space-y-2.5">
                {awards.map((award, idx) => (
                  <div key={award.id || idx} className="resume-entry text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {award.title || award.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {award.date || award.year}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {award.issuer || award.organization}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
