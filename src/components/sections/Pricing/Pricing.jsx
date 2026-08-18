import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Section from "../../UI/Section/Section";
import SectionTitle from "../../UI/SectionTitle/SectionTitle";
import SectionSubtitle from "../../UI/SectionSubtitle/SectionSubtitle";

import PricingCard from "./PricingCard";
import PricingToggle from "./PricingToggle";

import { pricingPlans } from "./pricingData";

import { useAuth } from "../../../context/AuthContext";

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  const navigate = useNavigate();

  const { user, loading } = useAuth();

  /* =====================================================
     HANDLE PLAN SELECTION
  ===================================================== */

  const handleSelectPlan = (plan) => {
    if (!plan) {
      return;
    }

    /* -----------------------------------------------
       Wait for authentication to finish
    ------------------------------------------------ */

    if (loading) {
      return;
    }

    /* -----------------------------------------------
       Starter / Free Plan
    ------------------------------------------------ */

    if (
      plan.id === "starter" ||
      plan.id === "free"
    ) {
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }

      return;
    }

    /* -----------------------------------------------
       Paid Plans
    ------------------------------------------------ */

    if (!user) {
      navigate("/login", {
        state: {
          redirectTo: "/checkout",
          planId: plan.id,
          billing: yearly ? "yearly" : "monthly",
        },
      });

      return;
    }

    /* -----------------------------------------------
       Logged-in User → Checkout
    ------------------------------------------------ */

    navigate(
      `/checkout?plan=${encodeURIComponent(
        plan.id
      )}&billing=${yearly ? "yearly" : "monthly"}`
    );
  };

  return (
    <Section id="pricing">
      {/* =================================================
          HEADING
      ================================================= */}

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

        {/* =================================================
            BILLING TOGGLE
        ================================================= */}

        <PricingToggle
          yearly={yearly}
          setYearly={setYearly}
        />
      </div>

      {/* =================================================
          PRICING CARDS
      ================================================= */}

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
            onSelectPlan={handleSelectPlan}
          />
        ))}
      </div>

      {/* =================================================
          BOTTOM NOTE
      ================================================= */}

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
            mx-auto
            mt-3

            max-w-2xl

            leading-7

            text-slate-600
          "
        >
          No credit card required.
          Build your first ATS-friendly resume
          in minutes and upgrade only when you're
          ready.
        </p>
      </div>
    </Section>
  );
}