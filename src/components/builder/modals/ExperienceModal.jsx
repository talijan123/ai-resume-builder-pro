import Modal from "../../UI/Modal/Modal"
import ExperienceFields from "../forms/ExperienceFields";
import { useResume } from "../../../context/ResumeContext";

export default function ExperienceModal({
  isOpen,
  onClose,
}) {
  const { addExperience } = useResume();

  function handleSave(experienceData) {
    addExperience(experienceData);

    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Experience"
      width="max-w-4xl"
    >
      <ExperienceFields
        onSubmit={handleSave}
        onCancel={onClose}
      />
    </Modal>
  );
}