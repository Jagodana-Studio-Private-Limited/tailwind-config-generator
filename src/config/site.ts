export const siteConfig = {
  name: "Tailwind Config Generator",
  title: "Tailwind CSS Config Generator — Visual tailwind.config.js Builder",
  description:
    "Generate a complete tailwind.config.js visually. Customize colors, fonts, spacing, breakpoints, and plugins — then copy your ready-to-use Tailwind CSS config in seconds.",
  url: "https://tailwind-config-generator.tools.jagodana.com",
  ogImage: "/opengraph-image",

  headerIcon: "Palette",
  brandAccentColor: "#6366f1",

  keywords: [
    "tailwind config generator",
    "tailwind.config.js generator",
    "tailwind css configuration",
    "tailwind config builder",
    "tailwindcss config tool",
    "tailwind custom colors",
    "tailwind breakpoints generator",
    "tailwind theme generator",
    "tailwind css customizer",
    "next.js tailwind config",
  ],
  applicationCategory: "DeveloperApplication",

  themeColor: "#3b82f6",

  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  socialProfiles: ["https://twitter.com/jagodana"],

  links: {
    github:
      "https://github.com/Jagodana-Studio-Private-Limited/tailwind-config-generator",
    website: "https://jagodana.com",
  },

  footer: {
    about:
      "A free visual Tailwind CSS config generator. Customize your Tailwind theme and export a ready-to-use tailwind.config.js file instantly — no login required.",
    featuresTitle: "Features",
    features: [
      "Visual color palette editor",
      "Custom font family configuration",
      "Breakpoint & spacing scale editor",
      "One-click config export",
    ],
  },

  hero: {
    badge: "Free Tailwind CSS Tool",
    titleLine1: "Generate Your",
    titleGradient: "Tailwind Config",
    subtitle:
      "Customize colors, fonts, spacing, and breakpoints visually — then copy your tailwind.config.js in one click. No login required.",
  },

  featureCards: [
    {
      icon: "🎨",
      title: "Visual Theme Editor",
      description:
        "Set custom brand colors, typography, and spacing through an intuitive GUI — no hand-editing config files.",
    },
    {
      icon: "📐",
      title: "Breakpoints & Fonts",
      description:
        "Configure responsive breakpoints and font families that perfectly match your design system.",
    },
    {
      icon: "⚡",
      title: "Instant Export",
      description:
        "Copy your complete tailwind.config.js or tailwind.config.ts to clipboard in one click, ready to paste.",
    },
  ],

  relatedTools: [
    {
      name: "Tailwind Shades Generator",
      url: "https://tailwind-shades-generator.tools.jagodana.com",
      icon: "🌈",
      description: "Generate Tailwind CSS color shade scales.",
    },
    {
      name: "Tailwind Color Finder",
      url: "https://tailwind-color-finder.tools.jagodana.com",
      icon: "🎨",
      description: "Find the perfect Tailwind CSS color name.",
    },
    {
      name: "CSS Variables Generator",
      url: "https://css-variables-generator.tools.jagodana.com",
      icon: "🔧",
      description: "Generate CSS custom properties for your design tokens.",
    },
    {
      name: "Spacing Scale Generator",
      url: "https://spacing-scale-generator.tools.jagodana.com",
      icon: "📏",
      description: "Generate consistent spacing scales for your CSS.",
    },
    {
      name: "CSS Grid Generator",
      url: "https://css-grid-generator.tools.jagodana.com",
      icon: "⚡",
      description: "Visual CSS grid layout builder.",
    },
    {
      name: "Color Palette Generator",
      url: "https://color-palette-generator.tools.jagodana.com",
      icon: "🖌️",
      description: "Generate beautiful color palettes for your projects.",
    },
  ],

  howToSteps: [
    {
      name: "Choose Tailwind Version",
      text: "Select Tailwind CSS v3 or v4 and pick your preferred output format (JS or TS).",
      url: "",
    },
    {
      name: "Customize Colors",
      text: "Add your brand's primary, secondary, and accent colors using the color picker.",
      url: "",
    },
    {
      name: "Configure Fonts & Breakpoints",
      text: "Set font families (sans, serif, mono) and adjust responsive breakpoints to match your design system.",
      url: "",
    },
    {
      name: "Enable Plugins & Copy Config",
      text: "Toggle any Tailwind plugins you need, then click 'Copy Config' to get your complete tailwind.config.js.",
      url: "",
    },
  ],
  howToTotalTime: "PT2M",

  faq: [
    {
      question: "What is a Tailwind CSS config generator?",
      answer:
        "A Tailwind CSS config generator is a visual tool that lets you customize Tailwind's default theme — colors, fonts, breakpoints, spacing — and outputs a complete tailwind.config.js file ready to drop into your project.",
    },
    {
      question: "Does this work with Tailwind CSS v3 and v4?",
      answer:
        "Yes. The generator supports both Tailwind CSS v3 (tailwind.config.js / tailwind.config.ts format) and Tailwind CSS v4 (CSS-first configuration with @theme). Toggle between versions using the version switch at the top.",
    },
    {
      question: "Can I add custom colors to my Tailwind config?",
      answer:
        "Absolutely. Use the color picker to define custom brand colors. The generator creates the correct color object format that Tailwind expects in your extend.colors section.",
    },
    {
      question: "What Tailwind plugins can I add?",
      answer:
        "You can enable @tailwindcss/forms, @tailwindcss/typography, @tailwindcss/aspect-ratio, and @tailwindcss/line-clamp from the Plugins tab. The generator adds the correct require() statements to your config automatically.",
    },
    {
      question: "Is the generated config 100% valid?",
      answer:
        "Yes. The config is generated from a structured schema and follows Tailwind's official configuration format. You can paste it directly into your project without any manual editing.",
    },
    {
      question: "Do I need to create an account or pay?",
      answer:
        "No. This tool is completely free and runs entirely in your browser — no account, no login, and no data is ever sent to any server.",
    },
  ],

  pages: {
    "/": {
      title:
        "Tailwind CSS Config Generator — Visual tailwind.config.js Builder",
      description:
        "Generate a complete tailwind.config.js visually. Customize colors, fonts, spacing, breakpoints, and plugins — then copy your ready-to-use Tailwind CSS config in seconds.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
