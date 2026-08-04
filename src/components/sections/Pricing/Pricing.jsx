import { useState } from "react";

import Section from "../../ui/Section/Section";
import SectionTitle from "../../ui/SectionTitle/SectionTitle";
import SectionSubtitle from "../../ui/SectionSubtitle/SectionSubtitle";

import PricingCard from "./PricingCard";
import PricingToggle from "./PricingToggle";

import { pricingPlans } from "./pricingData";

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <Section id="pricing">

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
          PRICING
        </p>

        <SectionTitle>
          Simple Pricing
          <br />
          for Every Career Stage
        </SectionTitle>

        <SectionSubtitle>
          Whether you're creating your first resume
          or applying to your dream company,
          ResumeForge AI has a plan built for you.
        </SectionSubtitle>

        {/* Toggle */}

        <PricingToggle
          yearly={yearly}
          setYearly={setYearly}
        />

      </div>

      {/* Pricing Cards */}

      <div
        className="
          mt-20

          grid

          gap-8

          lg:grid-cols-3
        "
      >
        {pricingPlans.map((plan) => (

          <PricingCard
            key={plan.id}
            {...plan}
            yearly={yearly}
          />

        ))}
      </div>

      {/* Bottom Note */}

      <div
        className="
          mt-16

          rounded-3xl

          border
          border-slate-200

          bg-slate-50

          p-8

          text-center
        "
      >

        <h3
          className="
            text-xl

            font-bold

            text-slate-900
          "
        >
          Start Free Today 🚀
        </h3>

        <p
          className="
            mt-3

            mx-auto

            max-w-2xl

            leading-7

            text-slate-600
          "
        >
          No credit card required.
          Build your first ATS-friendly resume in
          minutes and upgrade only when you're
          ready.
        </p>

      </div>

    </Section>
  );
}