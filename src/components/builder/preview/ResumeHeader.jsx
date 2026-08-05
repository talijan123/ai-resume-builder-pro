import {
  HiEnvelope,
  HiPhone,
  HiMapPin,
  HiGlobeAlt,
} from "react-icons/hi2";

import { useResume } from "../../../context/ResumeContext";

export default function ResumeHeader() {
  const { resumeData } = useResume();

  const personal = resumeData.personalInfo;

  return (
    <header>
      {/* Name */}

      <h1
        className="
          text-3xl
          font-black
          text-slate-900
        "
      >
        {personal.fullName || "Your Name"}
      </h1>

      {/* Job Title */}

      <p
        className="
          mt-2
          text-lg
          font-medium
          text-blue-600
        "
      >
        {personal.jobTitle || "Professional Title"}
      </p>

      {/* Contact */}

      <div
        className="
          mt-5
          flex
          flex-wrap
          gap-x-5
          gap-y-3

          text-sm
          text-slate-600
        "
      >
        {personal.email && (
          <div className="flex items-center gap-2">
            <HiEnvelope className="text-blue-600" />
            <span>{personal.email}</span>
          </div>
        )}

        {personal.phone && (
          <div className="flex items-center gap-2">
            <HiPhone className="text-blue-600" />
            <span>{personal.phone}</span>
          </div>
        )}

        {personal.location && (
          <div className="flex items-center gap-2">
            <HiMapPin className="text-blue-600" />
            <span>{personal.location}</span>
          </div>
        )}

        {personal.website && (
          <div className="flex items-center gap-2">
            <HiGlobeAlt className="text-blue-600" />
            <span>{personal.website}</span>
          </div>
        )}

        {personal.linkedin && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-600">
              in
            </span>

            <span>{personal.linkedin}</span>
          </div>
        )}

        {personal.github && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">
              GitHub
            </span>

            <span>{personal.github}</span>
          </div>
        )}
      </div>
    </header>
  );
}