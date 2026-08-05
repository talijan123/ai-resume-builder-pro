import {
  HiPencilSquare,
  HiTrash,
  HiGlobeAlt,
  HiCalendarDays,
  HiIdentification,
  HiAcademicCap,
} from "react-icons/hi2";

export default function CertificationCard({
  certification,
  onEdit,
  onDelete,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:shadow-lg
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <HiAcademicCap className="text-blue-600" />

            <h3 className="text-xl font-bold text-slate-900">
              {certification.name ||
                "Untitled Certificate"}
            </h3>
          </div>

          {certification.issuer && (
            <p className="mt-2 text-sm font-medium text-blue-600">
              {certification.issuer}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="
              rounded-lg
              p-2
              text-slate-500
              transition
              hover:bg-blue-50
              hover:text-blue-600
            "
          >
            <HiPencilSquare size={20} />
          </button>

          <button
            onClick={onDelete}
            className="
              rounded-lg
              p-2
              text-slate-500
              transition
              hover:bg-red-50
              hover:text-red-600
            "
          >
            <HiTrash size={20} />
          </button>
        </div>
      </div>

      {/* Dates */}

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <HiCalendarDays />

        <span>
          Issued: {certification.issueDate || "N/A"}

          {!certification.neverExpires && (
            <>
              {" • Expires: "}
              {certification.expiryDate || "N/A"}
            </>
          )}

          {certification.neverExpires && (
            <> • No Expiration</>
          )}
        </span>
      </div>

      {/* Credential ID */}

      {certification.credentialId && (
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <HiIdentification />

          <span>
            Credential ID:{" "}
            <strong>
              {certification.credentialId}
            </strong>
          </span>
        </div>
      )}

      {/* Description */}

      {certification.description && (
        <p
          className="
            mt-5
            whitespace-pre-line
            text-sm
            leading-7
            text-slate-700
          "
        >
          {certification.description}
        </p>
      )}

      {/* Credential URL */}

      {certification.credentialUrl && (
        <div className="mt-6">
          <a
            href={certification.credentialUrl}
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex
              items-center
              gap-2

              rounded-lg

              bg-blue-600

              px-4
              py-2

              text-sm
              font-medium

              text-white

              transition
              hover:bg-blue-700
            "
          >
            <HiGlobeAlt />

            View Credential
          </a>
        </div>
      )}
    </div>
  );
}