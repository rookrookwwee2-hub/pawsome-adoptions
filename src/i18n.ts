import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en";
import ar from "./locales/ar";
import es from "./locales/es";
import fr from "./locales/fr";
import de from "./locales/de";
import it from "./locales/it";
import pt from "./locales/pt";
import ru from "./locales/ru";
import zh from "./locales/zh";
import ja from "./locales/ja";
import ko from "./locales/ko";
import tr from "./locales/tr";
import nl from "./locales/nl";
import pl from "./locales/pl";
import sv from "./locales/sv";
import uk from "./locales/uk";
import hi from "./locales/hi";
import id from "./locales/id";
import th from "./locales/th";
import el from "./locales/el";

export const supportedLanguages = [
  { code: "en", name: "English", flag: "🇺🇸", dir: "ltr", currency: "USD" },
  { code: "ar", name: "العربية", flag: "🇸🇦", dir: "rtl", currency: "USD" },
  { code: "es", name: "Español", flag: "🇪🇸", dir: "ltr", currency: "EUR" },
  { code: "fr", name: "Français", flag: "🇫🇷", dir: "ltr", currency: "EUR" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", dir: "ltr", currency: "EUR" },
  { code: "it", name: "Italiano", flag: "🇮🇹", dir: "ltr", currency: "EUR" },
  { code: "pt", name: "Português", flag: "🇧🇷", dir: "ltr", currency: "USD" },
  { code: "ru", name: "Русский", flag: "🇷🇺", dir: "ltr", currency: "USD" },
  { code: "zh", name: "中文", flag: "🇨🇳", dir: "ltr", currency: "USD" },
  { code: "ja", name: "日本語", flag: "🇯🇵", dir: "ltr", currency: "USD" },
  { code: "ko", name: "한국어", flag: "🇰🇷", dir: "ltr", currency: "USD" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷", dir: "ltr", currency: "USD" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱", dir: "ltr", currency: "EUR" },
  { code: "pl", name: "Polski", flag: "🇵🇱", dir: "ltr", currency: "EUR" },
  { code: "sv", name: "Svenska", flag: "🇸🇪", dir: "ltr", currency: "EUR" },
  { code: "uk", name: "Українська", flag: "🇺🇦", dir: "ltr", currency: "USD" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳", dir: "ltr", currency: "USD" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩", dir: "ltr", currency: "USD" },
  { code: "th", name: "ไทย", flag: "🇹🇭", dir: "ltr", currency: "USD" },
  { code: "el", name: "Ελληνικά", flag: "🇬🇷", dir: "ltr", currency: "EUR" },
] as const;

export type LanguageCode = (typeof supportedLanguages)[number]["code"];

const resources = {
  en: { translation: en },
  ar: { translation: ar },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  it: { translation: it },
  pt: { translation: pt },
  ru: { translation: ru },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
  tr: { translation: tr },
  nl: { translation: nl },
  pl: { translation: pl },
  sv: { translation: sv },
  uk: { translation: uk },
  hi: { translation: hi },
  id: { translation: id },
  th: { translation: th },
  el: { translation: el },
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

const updateDirection = (lng: string) => {
  const lang = supportedLanguages.find((l) => l.code === lng);
  document.documentElement.dir = lang?.dir || "ltr";
  document.documentElement.lang = lng;
};

i18n.on("languageChanged", updateDirection);
updateDirection(i18n.language);

export default i18n;
