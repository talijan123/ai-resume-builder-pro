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
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Certifications
          </h3>

          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Showcase your professional certifications and courses.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="
            inline-flex
            items-center
            justify-center
            rounded-xl
            bg-blue-600
            px-4
            sm:px-5
            py-2.5
            sm:py-3
            text-xs
            sm:text-sm
            font-bold
            text-white
            shadow-md
            shadow-blue-500/20
            transition
            hover:bg-blue-700
            cursor-pointer
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