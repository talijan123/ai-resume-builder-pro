import Section from "../../ui/Section/Section";
import SectionTitle from "../../ui/SectionTitle/SectionTitle";
import SectionSubtitle from "../../ui/SectionSubtitle/SectionSubtitle";

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

            bg-blue-50

            px-4
            py-2

            text-sm
            font-semibold

            text-blue-600
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

          bg-gradient-to-r
          from-blue-50
          to-indigo-50

          p-10

          text-center

          md:grid-cols-3
        "
            >

                <div>

                    <h3
                        className="
              text-4xl

              font-black

              text-slate-900
            "
                    >
                        50K+
                    </h3>

                    <p className="mt-2 text-slate-600">
                        Resumes Created
                    </p>

                </div>

                <div>

                    <h3
                        className="
              text-4xl

              font-black

              text-slate-900
            "
                    >
                        98%
                    </h3>

                    <p className="mt-2 text-slate-600">
                        ATS Success Rate
                    </p>

                </div>

                <div>

                    <h3
                        className="
              text-4xl

              font-black

              text-slate-900
            "
                    >
                        4.9★
                    </h3>

                    <p className="mt-2 text-slate-600">
                        Average User Rating
                    </p>

                </div>

            </div>

        </Section>
    );
}