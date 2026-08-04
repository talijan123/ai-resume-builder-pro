import Section from "../../ui/Section/Section";
import SectionTitle from "../../ui/SectionTitle/SectionTitle";
import SectionSubtitle from "../../ui/SectionSubtitle/SectionSubtitle";

import FeatureCard from "./FeatureCard";

import { features } from "./featuresData";

export default function Features() {
  return (
    <Section id="features">

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
          FEATURES
        </p>

        <SectionTitle>
          Everything You Need to Build
          <br />
          the Perfect Resume
        </SectionTitle>

        <SectionSubtitle>
          ResumeForge AI combines modern design,
          artificial intelligence, and ATS optimization
          into one simple platform.
        </SectionSubtitle>

      </div>

      {/* Cards */}

      <div
        className="
          mt-20

          grid

          gap-8

          md:grid-cols-2

          xl:grid-cols-3
        "
      >
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            {...feature}
          />
        ))}
      </div>

    </Section>
  );
}