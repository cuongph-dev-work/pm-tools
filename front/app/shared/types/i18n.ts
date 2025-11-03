import { useTranslation } from "react-i18next";

// Shared i18n `t` function type
export type I18nT = ReturnType<typeof useTranslation>["t"];
