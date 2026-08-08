import { useResume } from "../../../context/ResumeContext";

export default function CertificationsSection() {
  const { resumeData } = useResume();

  console.log("resumeData:", resumeData);
  console.log("certifications:", resumeData.certifications);

  const certifications = resumeData.certifications;

  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="border-b border-slate-300 pb-2 text-lg font-bold text-slate-900">
        Certifications
      </h2>

      <div className="mt-4 space-y-5">
        {certifications.map((certification, index) => (
          <div
            key={certification.id || index}
            className="border-b border-slate-200 pb-4 last:border-none"
          >
            <h3 className="font-semibold text-slate-900">
              {certification.name || "Untitled Certification"}
            </h3>

            <p className="text-sm text-slate-500">
              {certification.issuer || "Unknown Issuer"}

              {certification.issueDate &&
                ` • ${certification.issueDate}`}

              {" • "}

              {certification.neverExpires
                ? "No Expiration"
                : certification.expiryDate || "Present"}
            </p>

            {certification.credentialId && (
              <p className="mt-1 text-xs font-medium text-blue-600">
                Credential ID: {certification.credentialId}
              </p>
            )}

            {certification.description && (
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">
                {certification.description}
              </p>
            )}

            {certification.credentialUrl && (
              <a
                href={certification.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                View Credential
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}