import { useResume } from "../../../context/ResumeContext";

export default function SummarySection() {
  const { resumeData } = useResume();

  const { summary } = resumeData.personalInfo;

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
        Professional Summary
      </h2>

      <p
        className="
          mt-3

          text-sm

          leading-7

          text-slate-700

          whitespace-pre-line
        "
      >
        {summary ||
          "Write a short professional summary to introduce yourself."}
      </p>
    </section>
  );
}