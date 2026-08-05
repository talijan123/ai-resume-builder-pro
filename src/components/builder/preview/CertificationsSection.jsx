export default function CertificationsSection({
  certifications,
}) {
  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2
        className="
          border-b
          border-slate-300
          pb-2
          text-lg
          font-bold
          text-slate-900
        "
      >
        Certifications
      </h2>

      <div className="mt-4 space-y-5">
        {certifications.map((certification) => (
          <div key={certification.id}>
            {/* Certificate Name */}

            <h3 className="font-semibold text-slate-900">
              {certification.name}
            </h3>

            {/* Issuer + Dates */}

            <p className="text-sm text-slate-500">
              {certification.issuer}

              {certification.issueDate &&
                ` • ${certification.issueDate}`}

              {" - "}

              {certification.neverExpires
                ? "No Expiration"
                : certification.expiryDate || "Present"}
            </p>

            {/* Credential ID */}

            {certification.credentialId && (
              <p className="mt-1 text-xs font-medium text-blue-600">
                Credential ID: {certification.credentialId}
              </p>
            )}

            {/* Description */}

            {certification.description && (
              <p
                className="
                  mt-2
                  whitespace-pre-line
                  text-sm
                  leading-7
                  text-slate-700
                "
              >
                {certification.description}
              </p>
            )}

            {/* Credential Link */}

            {certification.credentialUrl && (
              <a
                href={certification.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="
                  mt-2
                  inline-block
                  text-sm
                  font-medium
                  text-blue-600
                  hover:underline
                "
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