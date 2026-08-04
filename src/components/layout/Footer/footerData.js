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
        href: "#features",
      },
      {
        name: "Templates",
        href: "#templates",
      },
      {
        name: "Pricing",
        href: "#pricing",
      },
      {
        name: "AI Resume Builder",
        href: "#demo",
      },
    ],
  },

  {
    title: "Resources",

    links: [
      {
        name: "Blog",
        href: "#",
      },
      {
        name: "Help Center",
        href: "#",
      },
      {
        name: "Documentation",
        href: "#",
      },
      {
        name: "Privacy Policy",
        href: "#",
      },
    ],
  },

  {
    title: "Company",

    links: [
      {
        name: "About",
        href: "#",
      },
      {
        name: "Careers",
        href: "#",
      },
      {
        name: "Contact",
        href: "#",
      },
      {
        name: "Terms of Service",
        href: "#",
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