export default function calculateATSScore(resumeData) {
  let score = 0;

  const suggestions = [];

  let completedSections = 0;

  const totalSections = 7;

  /* -------------------------- */
  /* Personal Information */
  /* -------------------------- */

  const personal = resumeData.personalInfo;

  const personalFields = [
    personal.fullName,
    personal.jobTitle,
    personal.email,
    personal.phone,
    personal.location,
  ];

  const personalCompleted =
    personalFields.filter(Boolean).length;

  if (personalCompleted >= 5) {
    score += 20;
    completedSections++;
  } else {
    suggestions.push(
      "Complete your personal information."
    );
  }

  /* -------------------------- */
  /* Summary */
  /* -------------------------- */

  if (
    personal.summary &&
    personal.summary.trim().length >= 80
  ) {
    score += 10;
    completedSections++;
  } else {
    suggestions.push(
      "Write a stronger professional summary."
    );
  }

  /* -------------------------- */
  /* Experience */
  /* -------------------------- */

  if (resumeData.experience.length > 0) {
    score += 20;
    completedSections++;
  } else {
    suggestions.push(
      "Add at least one work experience."
    );
  }

  /* -------------------------- */
  /* Education */
  /* -------------------------- */

  if (resumeData.education.length > 0) {
    score += 15;
    completedSections++;
  } else {
    suggestions.push(
      "Add your education history."
    );
  }

  /* -------------------------- */
  /* Skills */
  /* -------------------------- */

  if (resumeData.skills.length >= 5) {
    score += 15;
    completedSections++;
  } else {
    suggestions.push(
      "Add at least five professional skills."
    );
  }

  /* -------------------------- */
  /* Projects */
  /* -------------------------- */

  if (resumeData.projects.length > 0) {
    score += 10;
    completedSections++;
  } else {
    suggestions.push(
      "Include at least one project."
    );
  }

  /* -------------------------- */
  /* Certifications */
  /* -------------------------- */

  if (resumeData.certifications.length > 0) {
    score += 10;
    completedSections++;
  } else {
    suggestions.push(
      "Add certifications to strengthen your resume."
    );
  }

  return {
    score,
    completedSections,
    totalSections,
    suggestions,
  };
}