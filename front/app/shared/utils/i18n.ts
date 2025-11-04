import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import enTranslations from "../../locale/en.json";
import viTranslations from "../../locale/vi.json";

// Resources with multiple languages
const resources = {
  vi: {
    translation: viTranslations,
  },
  en: {
    translation: enTranslations,
  },
};

// Get saved language from localStorage or default to 'en'
const getSavedLanguage = (): string => {
  if (typeof window !== "undefined" && window.localStorage) {
    const saved = window.localStorage.getItem("i18nextLng");
    // Support both 'vi' and 'en', default to 'en'
    return saved === "en" || saved === "vi" ? saved : "en";
  }
  return "en";
};

i18n.use(initReactI18next).init({
  resources,
  lng: getSavedLanguage(),
  fallbackLng: "en",
  supportedLngs: ["vi", "en"],
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

// Font mapping for each language
const fontMap: Record<string, string> = {
  vi: '"Noto Sans", "Noto Sans Vietnamese", ui-sans-serif, system-ui, sans-serif',
  en: '"Inter", ui-sans-serif, system-ui, sans-serif',
};

// Apply font based on language
const applyFont = (lng: string) => {
  if (typeof window !== "undefined" && window.document) {
    const fontFamily = fontMap[lng] || fontMap.en;
    window.document.documentElement.style.fontFamily = fontFamily;
  }
};

// Save language changes to localStorage and update HTML lang
i18n.on("languageChanged", lng => {
  if (typeof window !== "undefined") {
    if (window.localStorage) {
      window.localStorage.setItem("i18nextLng", lng);
    }
    // Update HTML lang attribute directly
    if (window.document) {
      window.document.documentElement.lang = lng;
      applyFont(lng);
    }
  }
});

// Apply initial font
if (typeof window !== "undefined") {
  applyFont(getSavedLanguage());
}

export default i18n;
