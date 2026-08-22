import { supabase } from "../lib/supabase";

export async function improveBulletPoint(bulletText) {
  if (
    typeof bulletText !== "string" ||
    bulletText.trim().length === 0
  ) {
    throw new Error("Enter a bullet point before improving it.");
  }

  const { data, error } = await supabase.functions.invoke(
    "ai-generate",
    {
      body: {
        taskType: "bullet",
        payload: {
          bullet: bulletText,
        },
      },
    }
  );

  if (error) {
    let serverMessage = "";

    if (error.context?.json) {
      try {
        const errorBody = await error.context.json();
        serverMessage = errorBody?.error || "";
      } catch {
        serverMessage = "";
      }
    }

    throw new Error(
      serverMessage ||
        error.message ||
        "Unable to improve this bullet point."
    );
  }

  if (
    !data ||
    typeof data.rewrittenBullet !== "string" ||
    data.rewrittenBullet.trim().length === 0
  ) {
    throw new Error("AI returned an invalid bullet point.");
  }

  return {
    rewrittenBullet: data.rewrittenBullet.trim(),
    creditsRemaining: Number(data.creditsRemaining),
  };
}

export async function generateSummaries(experience, skills) {
  if (
    !Array.isArray(experience) ||
    !Array.isArray(skills) ||
    (experience.length === 0 && skills.length === 0)
  ) {
    throw new Error("Add experience or skills before generating summaries.");
  }

  const { data, error } = await supabase.functions.invoke(
    "ai-generate",
    {
      body: {
        taskType: "summaries",
        payload: { experience, skills },
      },
    }
  );

  if (error) {
    let serverMessage = "";

    if (error.context?.json) {
      try {
        const errorBody = await error.context.json();
        serverMessage = errorBody?.error || "";
      } catch {
        serverMessage = "";
      }
    }

    throw new Error(
      serverMessage || error.message || "Unable to generate summaries."
    );
  }

  const summaries = data?.summaries;
  const summaryKeys = summaries ? Object.keys(summaries) : [];
  const validKeys = ["executive", "creative", "technical"];

  if (
    !summaries ||
    typeof summaries !== "object" ||
    summaryKeys.length !== 3 ||
    !validKeys.every((key) => summaryKeys.includes(key)) ||
    !validKeys.every(
      (key) =>
        typeof summaries[key] === "string" &&
        summaries[key].trim().length > 0
    )
  ) {
    throw new Error("AI returned invalid summary options.");
  }

  return {
    summaries: {
      executive: summaries.executive.trim(),
      creative: summaries.creative.trim(),
      technical: summaries.technical.trim(),
    },
    creditsRemaining: Number(data.creditsRemaining),
  };
}

export async function generateCoverLetter(
  jobDescription,
  resumeData,
  options = {}
) {
  if (
    typeof jobDescription !== "string" ||
    jobDescription.trim().length === 0 ||
    !resumeData ||
    typeof resumeData !== "object" ||
    typeof resumeData.personalInfo?.fullName !== "string" ||
    resumeData.personalInfo.fullName.trim().length === 0
  ) {
    throw new Error("Add a job description and your full name first.");
  }

  const { data, error } = await supabase.functions.invoke(
    "ai-generate",
    {
      body: {
        taskType: "cover-letter",
        payload: {
          jobDescription,
          resumeData,
          companyName: options.companyName,
          recipientName: options.recipientName,
        },
      },
    }
  );

  if (error) {
    let serverMessage = "";

    if (error.context?.json) {
      try {
        const errorBody = await error.context.json();
        serverMessage = errorBody?.error || "";
      } catch {
        serverMessage = "";
      }
    }

    throw new Error(
      serverMessage || error.message || "Unable to generate a cover letter."
    );
  }

  if (
    !data ||
    typeof data.coverLetter !== "string" ||
    data.coverLetter.trim().length === 0 ||
    data.coverLetter.length > 3000
  ) {
    throw new Error("AI returned an invalid cover letter.");
  }

  return {
    coverLetter: data.coverLetter.trim(),
    creditsRemaining: Number(data.creditsRemaining),
  };
}

export async function generateResume(mode, params = {}, existingProfile = null) {
  if (!mode || !["guided", "job-description"].includes(mode)) {
    throw new Error("Select a valid resume generation mode.");
  }

  const safeExistingProfile =
    existingProfile && typeof existingProfile === "object"
      ? {
          fullName: existingProfile.fullName || "",
          jobTitle: existingProfile.jobTitle || "",
          professionalTitle: existingProfile.professionalTitle || "",
          desiredJobTitle: existingProfile.desiredJobTitle || "",
          summary: existingProfile.summary || "",
          yearsOfExperience: existingProfile.yearsOfExperience || "",
          location: existingProfile.location || "",
          email: existingProfile.email || "",
          phone: existingProfile.phone || "",
          website: existingProfile.website || "",
          linkedin: existingProfile.linkedin || "",
          github: existingProfile.github || "",
        }
      : {};

  if (mode === "guided") {
    if (
      typeof params.jobTitle !== "string" ||
      params.jobTitle.trim().length === 0
    ) {
      throw new Error("Add a job title before generating a resume.");
    }

    if (
      !Array.isArray(params.keySkills) ||
      params.keySkills.length === 0 ||
      params.keySkills.some(
        (skill) => typeof skill !== "string" || skill.trim().length === 0
      )
    ) {
      throw new Error("Add at least one key skill before generating a resume.");
    }
  }

  if (
    mode === "job-description" &&
    (typeof params.jobDescription !== "string" ||
      params.jobDescription.trim().length === 0)
  ) {
    throw new Error("Paste a job description before generating a resume.");
  }

  const { data, error } = await supabase.functions.invoke("ai-generate", {
    body: {
      taskType: "resume",
      payload: {
        mode,
        jobTitle: params.jobTitle,
        industry: params.industry,
        yearsOfExperience: params.yearsOfExperience,
        keySkills: params.keySkills,
        jobDescription: params.jobDescription,
        existingProfile: safeExistingProfile,
      },
    },
  });

  if (error) {
    let serverMessage = "";

    if (error.context?.json) {
      try {
        const errorBody = await error.context.json();
        serverMessage = errorBody?.error || "";
      } catch {
        serverMessage = "";
      }
    }

    throw new Error(
      serverMessage || error.message || "Unable to generate a resume."
    );
  }

  if (
    !data ||
    !data.resumeData ||
    typeof data.resumeData !== "object"
  ) {
    throw new Error("AI returned an invalid resume draft.");
  }

  return {
    resumeData: data.resumeData,
    creditsRemaining: Number(data.creditsRemaining),
  };
}

export async function scanResumeATS(resumeData, jobDescription) {
  if (
    !resumeData ||
    typeof resumeData !== "object" ||
    typeof jobDescription !== "string" ||
    jobDescription.trim().length === 0
  ) {
    throw new Error("Add a resume and job description before scanning.");
  }

  const { data, error } = await supabase.functions.invoke("ai-generate", {
    body: {
      taskType: "ats-scan",
      payload: {
        resumeData,
        jobDescription: jobDescription.trim(),
      },
    },
  });

  if (error) {
    let serverMessage = "";

    if (error.context?.json) {
      try {
        const errorBody = await error.context.json();
        serverMessage = errorBody?.error || "";
      } catch {
        serverMessage = "";
      }
    }

    throw new Error(
      serverMessage || error.message || "Unable to scan this resume."
    );
  }

  const validKeywordArray = (value) =>
    Array.isArray(value) &&
    value.every(
      (item) => typeof item === "string" && item.trim().length > 0
    );

  if (
    !data ||
    !Number.isInteger(data.keywordMatchPercent) ||
    data.keywordMatchPercent < 0 ||
    data.keywordMatchPercent > 100 ||
    !validKeywordArray(data.matchedKeywords) ||
    !validKeywordArray(data.missingKeywords) ||
    !validKeywordArray(data.formattingWarnings) ||
    typeof data.summary !== "string" ||
    data.summary.trim().length === 0
  ) {
    throw new Error("AI returned an invalid ATS scan.");
  }

  return {
    keywordMatchPercent: data.keywordMatchPercent,
    matchedKeywords: data.matchedKeywords.map((item) => item.trim()),
    missingKeywords: data.missingKeywords.map((item) => item.trim()),
    formattingWarnings: data.formattingWarnings.map((item) => item.trim()),
    summary: data.summary.trim(),
    creditsRemaining: Number(data.creditsRemaining),
  };
}
