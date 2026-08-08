const STORAGE_KEY = "resume-forge-resumes";

/* ==========================================
   Get All Resumes
========================================== */

export function getResumes() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to parse resumes:", error);
    return [];
  }
}

/* ==========================================
   Save All Resumes
========================================== */

function saveResumes(resumes) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(resumes)
  );
}

/* ==========================================
   Create Resume
========================================== */

export function saveResume(resume) {
  const resumes = getResumes();

  const newResume = {
    ...resume,

    id: crypto.randomUUID(),

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),

    downloads: 0,

    atsScore: resume.atsScore || 0,
  };

  resumes.unshift(newResume);

  saveResumes(resumes);

  return newResume;
}

/* ==========================================
   Update Resume
========================================== */

export function updateResume(id, updatedResume) {
  const resumes = getResumes();

  const updated = resumes.map((resume) =>
    resume.id === id
      ? {
          ...resume,
          ...updatedResume,
          updatedAt: new Date().toISOString(),
        }
      : resume
  );

  saveResumes(updated);
}

/* ==========================================
   Get Single Resume
========================================== */

export function getResume(id) {
  return getResumes().find(
    (resume) => resume.id === id
  );
}

/* ==========================================
   Delete Resume
========================================== */

export function deleteResume(id) {
  const resumes = getResumes().filter(
    (resume) => resume.id !== id
  );

  saveResumes(resumes);
}

/* ==========================================
   Duplicate Resume
========================================== */

export function duplicateResume(id) {
  const resume = getResume(id);

  if (!resume) return;

  const copy = {
    ...resume,

    id: crypto.randomUUID(),

    title: `${resume.title} (Copy)`,

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),

    downloads: 0,
  };

  const resumes = getResumes();

  resumes.unshift(copy);

  saveResumes(resumes);

  return copy;
}

/* ==========================================
   Download Counter
========================================== */

export function incrementDownloads(id) {
  const resumes = getResumes();

  const updated = resumes.map((resume) =>
    resume.id === id
      ? {
          ...resume,
          downloads: (resume.downloads || 0) + 1,
        }
      : resume
  );

  saveResumes(updated);
}

/* ==========================================
   Exists?
========================================== */

export function resumeExists(id) {
  return getResumes().some(
    (resume) => resume.id === id
  );
}

/* ==========================================
   Clear All (Development Only)
========================================== */

export function clearResumes() {
  localStorage.removeItem(STORAGE_KEY);
}