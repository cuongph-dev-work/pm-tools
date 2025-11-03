import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation file (Vietnamese only)
import viTranslations from "../../locale/vi.json";

// Resources (Vietnamese only)
const resources = {
  vi: {
    translation: {
      ...viTranslations,
    },
  },
};

// Get saved language from localStorage or default to 'vi'
const getSavedLanguage = (): string => {
  if (typeof window !== "undefined" && window.localStorage) {
    const saved = window.localStorage.getItem("i18nextLng") || "vi";
    return saved === "vi" ? "vi" : "vi"; // force vi only
  }
  return "vi";
};

i18n.use(initReactI18next).init({
  resources,
  lng: getSavedLanguage(), // use saved language or default
  fallbackLng: "vi",
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
