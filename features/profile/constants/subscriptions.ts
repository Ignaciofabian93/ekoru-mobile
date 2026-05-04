export interface Plan {
  key: string;
  label: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
}

export const PLANS: Plan[] = [
  {
    key: "FREEMIUM",
    label: "Freemium",
    price: "Free",
    period: "",
    features: ["Up to 5 listings", "Basic analytics", "Community support"],
  },
  {
    key: "BASIC",
    label: "Basic",
    price: "$9.99",
    period: "/mo",
    features: ["Up to 20 listings", "Standard analytics", "Email support", "Badge on profile"],
  },
  {
    key: "ADVANCED",
    label: "Advanced",
    price: "$29.99",
    period: "/mo",
    highlighted: true,
    features: [
      "Unlimited listings",
      "Advanced analytics",
      "Priority support",
      "Featured placement",
      "Custom storefront",
    ],
  },
  {
    key: "STARTUP",
    label: "Startup",
    price: "$49.99",
    period: "/mo",
    features: [
      "Everything in Advanced",
      "Team accounts (up to 5)",
      "API access",
      "Dedicated account manager",
    ],
  },
  {
    key: "EXPERT",
    label: "Expert",
    price: "$99.99",
    period: "/mo",
    features: [
      "Everything in Startup",
      "Unlimited team members",
      "White-label options",
      "SLA guarantee",
      "24/7 phone support",
    ],
  },
];
