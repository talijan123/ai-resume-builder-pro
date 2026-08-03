import Section from "../../ui/Section/Section";
import SectionTitle from "../../ui/SectionTitle/SectionTitle";
import SectionSubtitle from "../../ui/SectionSubtitle/SectionSubtitle";

import TechLogo from "./TechLogo";

import {
  FaReact,
  FaNodeJs,
  FaGithub,
} from "react-icons/fa";

import {
  SiMongodb,
  SiOpenai,
  SiVercel,
} from "react-icons/si";

export default function TrustedBy() {
  const technologies = [
    {
      name: "React",
      icon: FaReact,
    },
    {
      name: "Node.js",
      icon: FaNodeJs,
    },
    {
      name: "MongoDB",
      icon: SiMongodb,
    },
    {
      name: "OpenAI",
      icon: SiOpenai,
    },
    {
      name: "GitHub",
      icon: FaGithub,
    },
    {
      name: "Vercel",
      icon: SiVercel,
    },
  ];

  return (
    <Section className="bg-white">

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
          POWERED BY
        </p>

        <SectionTitle>
          Built with the Tools
          Developers Love
        </SectionTitle>

        <SectionSubtitle>
          ResumeForge AI is powered by modern technologies
          trusted by millions of developers worldwide,
          delivering a fast, intelligent and reliable
          resume-building experience.
        </SectionSubtitle>

      </div>

      {/* Technologies */}

      <div
        className="
          mt-20

          grid

          grid-cols-2
          md:grid-cols-3
          lg:grid-cols-6

          gap-6
        "
      >
        {technologies.map((tech) => (
          <TechLogo
            key={tech.name}
            icon={tech.icon}
            name={tech.name}
          />
        ))}
      </div>

    </Section>
  );
}