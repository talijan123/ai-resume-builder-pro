import { useState } from "react";
import { HiPlus } from "react-icons/hi2";

import { useResume } from "../../../context/ResumeContext";

import ExperienceCard from "./ExperienceCard";
import ExperienceModal from "../modals/ExperienceModal";

export default function ExperienceForm() {
  const { resumeData } = useResume();

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  return (
    <>
      <div className="space-y-8">
        {/* Header */}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Work Experience
            </h2>

            <p className="mt-2 text-slate-500">
              Showcase your professional experience.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="
              flex
              items-center
              gap-2

              rounded-xl

              bg-gradient-to-r
              from-blue-600
              to-indigo-600

              px-5
              py-3

              font-semibold

              text-white

              transition-all

              hover:scale-105
            "
          >
            <HiPlus size={20} />

            Add Experience
          </button>
        </div>

        {/* Experience List */}

        {resumeData.experience.length === 0 ? (
          <ExperienceCard empty />
        ) : (
          <div className="space-y-5">
            {resumeData.experience.map(
              (experience) => (
                <ExperienceCard
                  key={experience.id}
                  experience={experience}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Modal */}

      <ExperienceModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
      />
    </>
  );
}