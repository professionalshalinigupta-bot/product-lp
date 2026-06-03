export const product = {
  brandName: "shakeweight",
  name: "shakeweight",
  headline: "Healthy weight management made simple",
  subheadline: "A delicious daily wellness shake made to keep you satisfied, energized, and on track.",
  description:
    "More than just a shake, shakeweight is a convenient daily wellness solution designed to support healthy weight goals while nourishing your body and reducing unnecessary cravings.",
  price: 1499,
  currency: "NPR",
  deliveryFee: 100,
  offerText: "First-time customers get 30% off on same-day purchase. Buy 5, get 1 free plus a diet plan.",
  flavorOptions: [
    {
      name: "Strawberry",
      src: "/images/shakeweight-strawberry.png",
      alt: "shakeweight strawberry flavor shake",
      accent: "#d83f78",
      dark: "#6f1839",
      soft: "#fff0f5",
      panel: "#ffe2ed",
      glow: "#f9b5cd"
    },
    {
      name: "Blueberry",
      src: "/images/shakeweight-blueberry.png",
      alt: "shakeweight blueberry flavor shake",
      accent: "#5665b8",
      dark: "#252a68",
      soft: "#eef1ff",
      panel: "#dfe5ff",
      glow: "#b7c2ff"
    },
    {
      name: "Banana",
      src: "/images/shakeweight-banana.png",
      alt: "shakeweight banana flavor shake",
      accent: "#d9a320",
      dark: "#6d4b0c",
      soft: "#fff8dc",
      panel: "#ffefac",
      glow: "#f8d85d"
    },
    {
      name: "Chocolate",
      src: "/images/shakeweight-chocolate.png",
      alt: "shakeweight chocolate flavor shake",
      accent: "#8b5a3c",
      dark: "#3f2418",
      soft: "#f8eee7",
      panel: "#ead4c5",
      glow: "#c69a80"
    }
  ],
  benefits: [
    "Helps control hunger and cravings",
    "Supports healthy weight management",
    "Nutritious meal replacement option",
    "Delicious and convenient",
    "Supports consistent energy levels",
    "Fits into your lifestyle"
  ],
  flavors: ["Strawberry", "Blueberry", "Banana", "Chocolate"],
  benefitDetails: [
    {
      title: "Helps Control Hunger & Cravings",
      text: "Formulated to promote satiety so you feel satisfied longer and are less likely to snack unnecessarily throughout the day."
    },
    {
      title: "Supports Healthy Weight Management",
      text: "A balanced blend of nutrients helps support your calorie-conscious lifestyle while giving your body the nourishment it needs."
    },
    {
      title: "Nutritious Meal Replacement",
      text: "Packed with essential nutrients to help support energy, wellness, and daily nutrition."
    },
    {
      title: "Delicious & Convenient",
      text: "Quick to prepare, easy to enjoy, and perfect for busy lifestyles."
    },
    {
      title: "Consistent Energy",
      text: "Designed to help you stay energized and focused throughout the day without heavy meals weighing you down."
    },
    {
      title: "Lifestyle Friendly",
      text: "Perfect for morning routines, post-workout nutrition, or healthy meal replacement plans."
    }
  ],
  testimonials: [
    {
      quote:
        "I’ve tried many weight management products before, but this is the first one that actually keeps me feeling full and satisfied for hours. It’s now part of my daily routine.",
      name: "Sarah M."
    },
    {
      quote:
        "I love how convenient and delicious this shake is. It helped me control my cravings and make healthier choices without feeling restricted.",
      name: "Jason R."
    },
    {
      quote:
        "Within a few weeks, I felt more energized and consistent with my eating habits. It made healthy living feel simple and sustainable.",
      name: "Priya K."
    },
    {
      quote:
        "Perfect for my busy schedule. I use it as a breakfast replacement and it keeps me full until lunch while helping me stay on track with my wellness goals.",
      name: "Michael T."
    }
  ],
  faqs: [
    {
      question: "How does this shake help with weight management?",
      answer:
        "Our formula is designed to promote satiety, helping you feel fuller for longer and reducing unnecessary cravings and snacking throughout the day."
    },
    {
      question: "Can I use this as a meal replacement?",
      answer: "Yes. Many customers enjoy it as a convenient breakfast or meal replacement as part of a balanced lifestyle."
    },
    {
      question: "How often should I drink it?",
      answer: "You can enjoy 1-2 servings daily depending on your personal wellness and nutrition goals."
    },
    {
      question: "Is the shake suitable for busy lifestyles?",
      answer: "Absolutely. It is quick to prepare, easy to enjoy on the go, and perfect for people with busy schedules."
    },
    {
      question: "When can I expect to see results?",
      answer:
        "Results may vary depending on diet, lifestyle, and activity levels, but consistency and healthy habits typically lead to the best outcomes."
    },
    {
      question: "Does it taste good?",
      answer: "Yes. The shake is designed to be both nutritious and delicious, making healthy living easier and more enjoyable."
    }
  ]
};

export function getFlavorOption(flavor: string) {
  return product.flavorOptions.find((option) => option.name === flavor) || product.flavorOptions[0];
}

export function formatMoney(amount: number) {
  return `NPR ${amount.toLocaleString("en-NP")}`;
}

export function discountedPrice() {
  return Math.round(product.price * 0.7);
}
