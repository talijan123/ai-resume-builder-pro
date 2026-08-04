export const pricingPlans = [
  {
    id: 1,

    name: "Starter",

    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyTotal: 0,

    description:
      "Perfect for students and job seekers getting started.",

    badge: null,

    buttonText: "Get Started",

    buttonStyle: "secondary",

    features: [
      "ATS-Friendly Resume Builder",
      "1 Professional Template",
      "Basic AI Resume Suggestions",
      "PDF Export",
      "Resume Preview",
      "Community Support",
    ],
  },

  {
    id: 2,

    name: "Pro",

    monthlyPrice: 12,
    yearlyPrice: 9,
    yearlyTotal: 108,

    description:
      "Best for professionals who want to land more interviews.",

    badge: "Most Popular",

    buttonText: "Start Free Trial",

    buttonStyle: "primary",

    featured: true,

    features: [
      "Unlimited Resumes",
      "AI Resume Generator",
      "AI Cover Letter Generator",
      "ATS Score Analysis",
      "Premium Templates",
      "PDF + DOCX Export",
      "Resume Analytics",
      "Priority Support",
    ],
  },

  {
    id: 3,

    name: "Team",

    monthlyPrice: 29,
    yearlyPrice: 22,
    yearlyTotal: 264,

    description:
      "Designed for teams, recruiters, and organizations.",

    badge: null,

    buttonText: "Contact Sales",

    buttonStyle: "dark",

    features: [
      "Everything in Pro",
      "Unlimited Team Members",
      "Shared Resume Library",
      "Custom Branding",
      "Admin Dashboard",
      "Team Analytics",
      "API Access",
      "Dedicated Support",
    ],
  },
];