import { useResume } from "../../context/ResumeContext";
import {
  HiEnvelope,
  HiPhone,
  HiMapPin,
  HiGlobeAlt,
  HiAcademicCap,
  HiBriefcase,
  HiUser,
  HiSparkles,
  HiTrophy,
  HiDocumentCheck,
  HiLanguage,
  HiHeart,
  HiFolder,
  HiCalendarDays,
} from "react-icons/hi2";
import { FaLinkedin, FaGithub, FaVenusMars } from "react-icons/fa";

export default function SidebarPhotoTemplate({ previewData = null }) {
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
    interests = [],
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

  // Initials for avatar fallback
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
          TOP ACCENT BANNER & HEADER JUNCTION
      ========================================= */}
      <header className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white px-8 py-7 flex items-center justify-between border-b-4 border-indigo-500">
        <div className="z-10 max-w-[65%]">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-400 mb-1">
            Resume / Curriculum Vitae
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow-sm">
            {fullName}
          </h1>
          <p className="mt-1 text-base sm:text-lg font-medium text-slate-200 tracking-wide">
            {jobTitle}
          </p>
        </div>

        {/* Profile Avatar with Crisp Border */}
        <div className="z-10 shrink-0">
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-slate-800 shadow-xl overflow-hidden flex items-center justify-center ring-2 ring-indigo-500/40">
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
              className={`h-full w-full items-center justify-center bg-gradient-to-br from-indigo-700 to-slate-900 text-white font-black text-3xl tracking-wider select-none ${
                photo ? "hidden" : "flex"
              }`}
            >
              {initials}
            </div>
          </div>
        </div>

        {/* Subtle Decorative Background Wave / Grid */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-indigo-600/10 pointer-events-none skew-x-[-20deg] transform origin-top" />
      </header>

      {/* =========================================
          TWO-COLUMN MAIN BODY
      ========================================= */}
      <div className="flex-1 flex flex-row">
        {/* =========================================
            LEFT SIDEBAR (Dark Navy Theme)
        ========================================= */}
        <aside className="w-[36%] bg-slate-900 text-slate-200 p-6 flex flex-col gap-6 shrink-0 border-r border-slate-800">
          {/* CONTACT INFO */}
          <div className="resume-section">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 pb-2 mb-3 border-b border-slate-800 flex items-center gap-2">
              <HiUser className="text-indigo-400 text-sm" />
              Contact
            </h3>

            <div className="space-y-2.5 text-xs text-slate-300">
              {personalInfo.email && (
                <div className="flex items-start gap-2.5 break-all">
                  <HiEnvelope className="mt-0.5 text-indigo-400 shrink-0 text-sm" />
                  <span className="leading-tight">{personalInfo.email}</span>
                </div>
              )}

              {personalInfo.phone && (
                <div className="flex items-start gap-2.5">
                  <HiPhone className="mt-0.5 text-indigo-400 shrink-0 text-sm" />
                  <span className="leading-tight">{personalInfo.phone}</span>
                </div>
              )}

              {personalInfo.location && (
                <div className="flex items-start gap-2.5">
                  <HiMapPin className="mt-0.5 text-indigo-400 shrink-0 text-sm" />
                  <span className="leading-tight">{personalInfo.location}</span>
                </div>
              )}

              {personalInfo.website && (
                <div className="flex items-start gap-2.5 break-all">
                  <HiGlobeAlt className="mt-0.5 text-indigo-400 shrink-0 text-sm" />
                  <span className="leading-tight">{personalInfo.website}</span>
                </div>
              )}

              {personalInfo.linkedin && (
                <div className="flex items-start gap-2.5 break-all">
                  <FaLinkedin className="mt-0.5 text-indigo-400 shrink-0 text-sm" />
                  <span className="leading-tight">{personalInfo.linkedin}</span>
                </div>
              )}

              {personalInfo.github && (
                <div className="flex items-start gap-2.5 break-all">
                  <FaGithub className="mt-0.5 text-indigo-400 shrink-0 text-sm" />
                  <span className="leading-tight">{personalInfo.github}</span>
                </div>
              )}

              {(personalInfo.gender || personalInfo.sex) && (
                <div className="flex items-start gap-2.5">
                  <FaVenusMars className="mt-0.5 text-indigo-400 shrink-0 text-sm" />
                  <span className="leading-tight">
                    {personalInfo.gender || personalInfo.sex}
                  </span>
                </div>
              )}

              {(personalInfo.dob || personalInfo.birthDate) && (
                <div className="flex items-start gap-2.5">
                  <HiCalendarDays className="mt-0.5 text-indigo-400 shrink-0 text-sm" />
                  <span className="leading-tight">
                    {personalInfo.dob || personalInfo.birthDate}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* SKILLS */}
          {skills && skills.length > 0 && (
            <div className="resume-section">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 pb-2 mb-3 border-b border-slate-800 flex items-center gap-2">
                <HiSparkles className="text-indigo-400 text-sm" />
                Skills
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, index) => {
                  const skillName = getSkillName(skill);
                  if (!skillName) return null;
                  return (
                    <span
                      key={skill.id || `skill-${index}`}
                      className="inline-block rounded-md bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 text-[11px] font-medium text-slate-200 shadow-sm"
                    >
                      {skillName}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* HONORS & AWARDS */}
          {awards && awards.length > 0 && (
            <div className="resume-section">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 pb-2 mb-3 border-b border-slate-800 flex items-center gap-2">
                <HiTrophy className="text-indigo-400 text-sm" />
                Honors & Awards
              </h3>

              <div className="space-y-3 text-xs">
                {awards.map((award, index) => (
                  <div
                    key={award.id || `award-${index}`}
                    className="resume-entry"
                  >
                    <p className="font-bold text-white leading-snug">
                      {award.title || award.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {award.issuer || award.organization || ""}
                      {award.date || award.year
                        ? ` • ${award.date || award.year}`
                        : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {certifications && certifications.length > 0 && (
            <div className="resume-section">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 pb-2 mb-3 border-b border-slate-800 flex items-center gap-2">
                <HiDocumentCheck className="text-indigo-400 text-sm" />
                Certifications
              </h3>

              <div className="space-y-3 text-xs">
                {certifications.map((cert, index) => (
                  <div
                    key={cert.id || `cert-${index}`}
                    className="resume-entry"
                  >
                    <p className="font-bold text-white leading-snug">
                      {cert.name || cert.title}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {cert.issuer || cert.organization || ""}
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
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 pb-2 mb-3 border-b border-slate-800 flex items-center gap-2">
                <HiLanguage className="text-indigo-400 text-sm" />
                Languages
              </h3>

              <div className="space-y-1.5 text-xs text-slate-300">
                {languages.map((lang, index) => {
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
                      key={lang.id || `lang-${index}`}
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium text-slate-200">{name}</span>
                      {level && (
                        <span className="text-[10px] text-indigo-300">
                          {level}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* INTERESTS */}
          {interests && interests.length > 0 && (
            <div className="resume-section">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 pb-2 mb-3 border-b border-slate-800 flex items-center gap-2">
                <HiHeart className="text-indigo-400 text-sm" />
                Interests
              </h3>

              <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-300">
                {interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-slate-800/80 px-2 py-0.5 text-slate-300"
                  >
                    {typeof interest === "string"
                      ? interest
                      : interest.name || interest.title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* =========================================
            RIGHT MAIN CONTENT (Crisp White Theme)
        ========================================= */}
        <main className="flex-1 bg-white p-7 space-y-6">
          {/* OBJECTIVE / SUMMARY */}
          {personalInfo.summary && (
            <section className="resume-section">
              <div className="flex items-center gap-3 mb-2.5">
                <h2 className="text-xs font-black uppercase tracking-[0.18em] text-slate-900 shrink-0">
                  Profile Objective
                </h2>
                <div className="h-[2px] flex-1 bg-slate-200" />
              </div>

              <p className="text-xs leading-relaxed text-slate-600 text-justify">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* EDUCATION */}
          {education && education.length > 0 && (
            <section className="resume-section">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xs font-black uppercase tracking-[0.18em] text-slate-900 shrink-0 flex items-center gap-1.5">
                  <HiAcademicCap className="text-indigo-600 text-sm" />
                  Education
                </h2>
                <div className="h-[2px] flex-1 bg-slate-200" />
              </div>

              <div className="space-y-4">
                {education.map((item) => {
                  const degree =
                    item.degree || item.program || "Degree / Qualification";
                  const institution =
                    item.institution || item.school || "Institution / College";
                  const date = getDateRange(item);
                  const desc = getDescription(item);

                  return (
                    <div
                      key={item.id}
                      className="resume-entry resume-education-item relative pl-3.5 border-l-2 border-indigo-400"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <h3 className="text-xs font-bold text-slate-900">
                          {degree}
                        </h3>
                        {date && (
                          <span className="text-[11px] font-semibold text-slate-400">
                            {date}
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-indigo-700 mt-0.5">
                        {institution}
                      </p>

                      {desc && (
                        <p className="mt-1.5 text-xs leading-normal text-slate-600">
                          {desc}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* WORK EXPERIENCE */}
          {experience && experience.length > 0 && (
            <section className="resume-section">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xs font-black uppercase tracking-[0.18em] text-slate-900 shrink-0 flex items-center gap-1.5">
                  <HiBriefcase className="text-indigo-600 text-sm" />
                  Work Experience
                </h2>
                <div className="h-[2px] flex-1 bg-slate-200" />
              </div>

              <div className="space-y-4">
                {experience.map((item) => {
                  const role =
                    item.jobTitle || item.position || "Job Title / Role";
                  const company = item.company || "Company";
                  const date = getDateRange(item);
                  const desc = getDescription(item);

                  return (
                    <div
                      key={item.id}
                      className="resume-entry resume-experience-item relative pl-3.5 border-l-2 border-indigo-400"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <h3 className="text-xs font-bold text-slate-900">
                          {role}
                        </h3>
                        {date && (
                          <span className="text-[11px] font-semibold text-slate-400">
                            {date}
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-indigo-700 mt-0.5">
                        {company}
                        {item.location ? ` • ${item.location}` : ""}
                      </p>

                      {desc && (
                        <p className="mt-1.5 whitespace-pre-line text-xs leading-normal text-slate-600">
                          {desc}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* PROJECTS & ACTIVITIES */}
          {projects && projects.length > 0 && (
            <section className="resume-section">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xs font-black uppercase tracking-[0.18em] text-slate-900 shrink-0 flex items-center gap-1.5">
                  <HiFolder className="text-indigo-600 text-sm" />
                  Projects & Key Activities
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
                      className="resume-entry resume-project-item relative pl-3.5 border-l-2 border-indigo-400"
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
                        <p className="mt-1 text-xs leading-normal text-slate-600">
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
        </main>
      </div>
    </div>
  );
}
