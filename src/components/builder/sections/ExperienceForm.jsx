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

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Work Experience
            </h2>

            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Showcase your professional experience.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
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
              transition-all
              hover:scale-105
              cursor-pointer
            "
          >
            <HiPlus size={18} />
            <span>Add Experience</span>
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