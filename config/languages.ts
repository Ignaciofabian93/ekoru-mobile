export const LANGUAGES_SUPPORTED = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
];

export type Language = (typeof LANGUAGES_SUPPORTED)[number]["code"];
