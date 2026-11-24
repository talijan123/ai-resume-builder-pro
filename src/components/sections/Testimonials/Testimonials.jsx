import Section from "../../UI/Section/Section";
import SectionTitle from "../../UI/SectionTitle/SectionTitle";
import SectionSubtitle from "../../UI/SectionSubtitle/SectionSubtitle";

import TestimonialCard from "./TestimonialCard";
import { testimonials } from "./testimonialsData";

export default function Testimonials() {
  return (
    <Section id="testimonials">
      {/* Heading */}

      <div className="text-center">
        <p
          className="
            inline-flex
            items-center

            rounded-full

            border
            border-blue-200
            dark:border-blue-500/30

            bg-blue-50
            dark:bg-blue-500/10

            px-4
            py-2

            text-sm
            font-semibold

            text-blue-600
            dark:text-blue-400
          "
        >
          TESTIMONIALS
        </p>

        <SectionTitle>
          Trusted by Professionals
          <br />
          Around the World
        </SectionTitle>

        <SectionSubtitle>
          Thousands of job seekers have used ResumeForge AI
          to build professional resumes, improve ATS scores,
          and land interviews at leading companies.
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
        {testimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            {...testimonial}
          />
        ))}
      </div>

      {/* Bottom Stats */}

      <div
        className="
          mt-20

          grid

          gap-8

          rounded-3xl

          border
          border-slate-200
          dark:border-slate-700/60

          bg-gradient-to-r
          from-blue-50/80
          to-indigo-50/80
          dark:from-slate-800/80
          dark:to-slate-900/80

          backdrop-blur-sm

          p-10

          text-center

          md:grid-cols-3
          transition-colors
        "
      >
        <div>
          <h3
            className="
              text-4xl

              font-black

              text-slate-900
              dark:text-white
            "
          >
            50K+
          </h3>

          <p className="mt-2 text-slate-600 dark:text-slate-400 font-medium">
            Resumes Created
          </p>
        </div>

        <div>
          <h3
            className="
              text-4xl

              font-black

              text-slate-900
              dark:text-white
            "
          >
            98%
          </h3>

          <p className="mt-2 text-slate-600 dark:text-slate-400 font-medium">
            ATS Success Rate
          </p>
        </div>

        <div>
          <h3
            className="
              text-4xl

              font-black

              text-slate-900
              dark:text-white
            "
          >
            4.9★
          </h3>

          <p className="mt-2 text-slate-600 dark:text-slate-400 font-medium">
            Average User Rating
          </p>
        </div>
      </div>
    </Section>
  );
}