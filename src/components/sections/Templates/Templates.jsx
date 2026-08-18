import Section from "../../UI/Section/Section";
import SectionTitle from "../../UI/SectionTitle/SectionTitle";
import SectionSubtitle from "../../UI/SectionSubtitle/SectionSubtitle";

import TemplateCard from "./TemplateCard";

import { templates } from "./templatesData";

import { HiArrowRight } from "react-icons/hi2";

export default function Templates() {
  return (
    <Section id="templates">

      {/* Heading */}

      <div className="text-center">

        <span
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
          PREMIUM TEMPLATES
        </span>

        <SectionTitle>
          Choose the Perfect
          <br />
          Resume Template
        </SectionTitle>

        <SectionSubtitle>
          Professionally designed, ATS-friendly resume
          templates crafted to help you stand out and
          impress recruiters.
        </SectionSubtitle>

      </div>

      {/* Templates */}

      <div
        className="
          mt-16

          grid

          gap-8

          md:grid-cols-2

          xl:grid-cols-3
        "
      >
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            {...template}
          />
        ))}
      </div>

      {/* Bottom CTA */}

      <div className="mt-20 text-center">

        <button
          className="
            group

            inline-flex
            items-center
            gap-3

            rounded-full

            border
            border-slate-300

            bg-white

            px-8
            py-4

            font-semibold

            text-slate-800

            transition-all
            duration-300

            hover:border-blue-500
            hover:text-blue-600
            hover:shadow-lg
          "
        >
          View All Templates

          <HiArrowRight
            className="
              transition-transform
              duration-300

              group-hover:translate-x-1
            "
            size={20}
          />
        </button>

      </div>

    </Section>
  );
}