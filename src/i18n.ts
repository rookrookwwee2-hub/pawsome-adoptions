import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en";
import ar from "./locales/ar";
import es from "./locales/es";

export const supportedLanguages = [
  { code: "en", name: "English", flag: "🇺🇸", dir: "ltr", currency: "USD" },
  { code: "ar", name: "العربية", flag: "🇸🇦", dir: "rtl", currency: "USD" },
  { code: "es", name: "Español", flag: "🇪🇸", dir: "ltr", currency: "EUR" },
] as const;

export type LanguageCode = (typeof supportedLanguages)[number]["code"];

const resources = {
  en: { translation: en },
  ar: { translation: ar },
  es: { translation: es },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "pawsfam-language",
    },
  });

// Set document direction on language change
const updateDirection = (lng: string) => {
  const lang = supportedLanguages.find((l) => l.code === lng);
  document.documentElement.dir = lang?.dir || "ltr";
  document.documentElement.lang = lng;
};

i18n.on("languageChanged", updateDirection);
// Set initial direction
updateDirection(i18n.language);

export default i18n;
