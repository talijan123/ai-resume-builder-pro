import Section from "../../ui/Section/Section";
import SectionTitle from "../../ui/SectionTitle/SectionTitle";
import SectionSubtitle from "../../ui/SectionSubtitle/SectionSubtitle";

import StepCard from "./StepCard";

import { steps } from "./stepsData";

export default function HowItWorks() {
  return (
    <Section id="how-it-works">

      <div className="text-center">

        <p
          className="
            text-sm
            font-semibold
            uppercase

            tracking-[0.3em]

            text-blue-600
          "
        >
          HOW IT WORKS
        </p>

        <SectionTitle>
          Create Your Resume
          <br />
          in Three Easy Steps
        </SectionTitle>

        <SectionSubtitle>
          ResumeForge AI simplifies the resume creation
          process so you can focus on landing interviews,
          not formatting documents.
        </SectionSubtitle>

      </div>

      <div
        className="
          mt-20

          grid

          gap-8

          lg:grid-cols-3
        "
      >
        {steps.map((step) => (
          <StepCard
            key={step.number}
            {...step}
          />
        ))}
      </div>

    </Section>
  );
}