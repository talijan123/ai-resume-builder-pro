import Section from "../../UI/Section/Section";
import SectionTitle from "../../UI/SectionTitle/SectionTitle";
import SectionSubtitle from "../../UI/SectionSubtitle/SectionSubtitle";

import StepCard from "./StepCard";

import { steps } from "./stepsData";

export default function HowItWorks() {
  return (
    <Section id="how-it-works">

      <div className="text-center">

        <p
          className="
            inline-flex
            items-center

            rounded-full

            border
            border-blue-200

            bg-blue-50

            px-4
            py-2

            text-sm
            font-semibold

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