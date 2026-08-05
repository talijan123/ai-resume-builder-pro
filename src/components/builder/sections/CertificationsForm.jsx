import { useState } from "react";

import { useResume } from "../../../context/ResumeContext";

import CertificationCard from "./CertificationCard";
import CertificationModal from "../modals/CertificationModal";

export default function CertificationsForm() {
  const {
    resumeData,

    addCertification,
    updateCertification,
    deleteCertification,
  } = useResume();

  const [openModal, setOpenModal] = useState(false);

  const [editingCertification, setEditingCertification] =
    useState(null);

  function handleAdd() {
    setEditingCertification(null);
    setOpenModal(true);
  }

  function handleEdit(certification) {
    setEditingCertification(certification);
    setOpenModal(true);
  }

  function handleSave(certification) {
    if (editingCertification) {
      updateCertification(
        editingCertification.id,
        certification
      );
    } else {
      addCertification(certification);
    }

    setOpenModal(false);
    setEditingCertification(null);
  }

  function handleDelete(id) {
    deleteCertification(id);
  }

  return (
    <>
      {/* Header */}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Certifications
          </h3>

          <p className="mt-1 text-slate-500">
            Showcase your professional certifications
            and courses.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="
            rounded-xl
            bg-blue-600
            px-5
            py-3
            font-semibold
            text-white
            transition
            hover:bg-blue-700
          "
        >
          + Add Certificate
        </button>
      </div>

      {/* List */}

      {resumeData.certifications.length === 0 ? (
        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-slate-300
            bg-slate-50
            p-10
            text-center
          "
        >
          <h3 className="text-lg font-semibold text-slate-900">
            No certifications yet
          </h3>

          <p className="mt-2 text-slate-500">
            Add your certifications to strengthen
            your resume.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {resumeData.certifications.map(
            (certification) => (
              <CertificationCard
                key={certification.id}
                certification={certification}
                onEdit={() =>
                  handleEdit(certification)
                }
                onDelete={() =>
                  handleDelete(certification.id)
                }
              />
            )
          )}
        </div>
      )}

      {/* Modal */}

      <CertificationModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingCertification(null);
        }}
        onSave={handleSave}
        initialData={editingCertification}
      />
    </>
  );
}