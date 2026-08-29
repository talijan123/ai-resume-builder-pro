import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

export const footerColumns = [
  {
    title: "Product",

    links: [
      {
        name: "Features",
        href: "/#features",
      },
      {
        name: "Templates",
        href: "/templates",
      },
      {
        name: "Pricing",
        href: "/#pricing",
      },
      {
        name: "AI Resume Builder",
        href: "/builder",
      },
    ],
  },

  {
    title: "Resources",

    links: [
      {
        name: "Blog & Guides",
        href: "/blog",
      },
      {
        name: "ATS Optimization",
        href: "/blog/ats-optimizer",
      },
      {
        name: "Cover Letter Guide",
        href: "/blog/cover-letter-ai",
      },
      {
        name: "Privacy Policy",
        href: "/privacy",
      },
    ],
  },

  {
    title: "Company",

    links: [
      {
        name: "About ResumeForge",
        href: "/#features",
      },
      {
        name: "Contact Support",
        href: "/contact",
      },
      {
        name: "Terms of Service",
        href: "/terms",
      },
      {
        name: "Privacy Policy",
        href: "/privacy",
      },
    ],
  },
];

export const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/",

    icon: FaGithub,
  },

  {
    name: "LinkedIn",
    href: "https://linkedin.com/",

    icon: FaLinkedin,
  },

  {
    name: "X",
    href: "https://x.com/",

    icon: FaXTwitter,
  },
];