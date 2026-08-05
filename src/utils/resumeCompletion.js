export function calculateResumeCompletion(resumeData) {
  const completedSections = [];

  // Personal Information
  const personal = resumeData.personalInfo;

  const personalCompleted =
    personal.fullName?.trim() &&
    personal.email?.trim() &&
    personal.phone?.trim() &&
    personal.jobTitle?.trim();

  if (personalCompleted) {
    completedSections.push("personal");
  }

  // Experience
  if (resumeData.experience.length > 0) {
    completedSections.push("experience");
  }

  // Education
  if (
    resumeData.education &&
    resumeData.education.length > 0
  ) {
    completedSections.push("education");
  }

  // Skills
  if (
    resumeData.skills &&
    resumeData.skills.length > 0
  ) {
    completedSections.push("skills");
  }

  // Projects
  if (
    resumeData.projects &&
    resumeData.projects.length > 0
  ) {
    completedSections.push("projects");
  }

  // Certifications
  if (
    resumeData.certifications &&
    resumeData.certifications.length > 0
  ) {
    completedSections.push("certifications");
  }

  const totalSections = 6;

  const percentage = Math.round(
    (completedSections.length / totalSections) * 100
  );

  return {
    percentage,
    completedSections,
  };
}