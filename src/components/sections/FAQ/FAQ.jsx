import { useState } from "react";

import Section from "../../UI/Section/Section";
import SectionTitle from "../../UI/SectionTitle/SectionTitle";
import SectionSubtitle from "../../UI/SectionSubtitle/SectionSubtitle";

import FAQItem from "./FAQItem";
import { faqs } from "./faqData";

export default function FAQ() {
  const [openId, setOpenId] = useState(1);

  function handleToggle(id) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <Section id="faq">

      {/* Heading */}

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
          FAQ
        </p>

        <SectionTitle>
          Everything You Need
          <br />
          to Know
        </SectionTitle>

        <SectionSubtitle>
          Have questions about ResumeForge AI?
          Here are the answers to the most common
          questions from our users.
        </SectionSubtitle>

      </div>

      {/* FAQ Items */}

      <div
        className="
          mx-auto
          mt-20

          max-w-4xl

          space-y-6
        "
      >
        {faqs.map((faq) => (
          <FAQItem
            key={faq.id}
            faq={faq}
            isOpen={openId === faq.id}
            onClick={() => handleToggle(faq.id)}
          />
        ))}
      </div>

      {/* Bottom Message */}

      <div
        className="
          mt-16

          text-center
        "
      >
        <p
          className="
            text-slate-600
          "
        >
          Still have questions?
        </p>

        <button
          className="
            mt-5

            rounded-2xl

            bg-gradient-to-r
            from-blue-600
            to-indigo-600

            px-8
            py-4

            font-semibold

            text-white

            shadow-lg

            transition-all
            duration-300

            hover:-translate-y-1
            hover:shadow-xl
          "
        >
          Contact Support
        </button>

      </div>

    </Section>
  );
}