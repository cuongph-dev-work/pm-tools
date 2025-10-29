import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import enTranslations from "../../locale/en.json";
import jaTranslations from "../../locale/ja.json";
import viTranslations from "../../locale/vi.json";

// Merge translations with validation messages
const resources = {
  en: {
    translation: {
      ...enTranslations,
    },
  },
  ja: {
    translation: {
      ...jaTranslations,
    },
  },
  vi: {
    translation: {
      ...viTranslations,
    },
  },
};

// Get saved language from localStorage or default to 'en'
const getSavedLanguage = (): string => {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage.getItem("i18nextLng") || "en";
  }
  return "en";
};

i18n.use(initReactI18next).init({
  resources,
  lng: getSavedLanguage(), // use saved language or default
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

// Save language changes to localStorage and update HTML lang
i18n.on("languageChanged", lng => {
  if (typeof window !== "undefined") {
    if (window.localStorage) {
      window.localStorage.setItem("i18nextLng", lng);
    }
    // Update HTML lang attribute directly
    if (window.document) {
      window.document.documentElement.lang = lng;
    }
  }
});

export default i18n;
