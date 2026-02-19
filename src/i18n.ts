import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "@/locales/en";
import ar from "@/locales/ar";
import es from "@/locales/es";
import fr from "@/locales/fr";
import de from "@/locales/de";
import it from "@/locales/it";
import pt from "@/locales/pt";
import ru from "@/locales/ru";
import zh from "@/locales/zh";
import ja from "@/locales/ja";
import ko from "@/locales/ko";
import tr from "@/locales/tr";
import nl from "@/locales/nl";
import pl from "@/locales/pl";
import sv from "@/locales/sv";
import uk from "@/locales/uk";
import hi from "@/locales/hi";
import id from "@/locales/id";
import th from "@/locales/th";
import el from "@/locales/el";

const RTL_LANGUAGES = ["ar"];

export const LANGUAGE_OPTIONS = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "sv", label: "Svenska", flag: "🇸🇪" },
  { code: "uk", label: "Українська", flag: "🇺🇦" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "th", label: "ไทย", flag: "🇹🇭" },
  { code: "el", label: "Ελληνικά", flag: "🇬🇷" },
];

export const LANGUAGE_CURRENCY_MAP: Record<string, string> = {
  en: "USD",
  ar: "USD",
  es: "EUR",
  fr: "EUR",
  de: "EUR",
  it: "EUR",
  pt: "EUR",
  ru: "USD",
  zh: "USD",
  ja: "USD",
  ko: "USD",
  tr: "USD",
  nl: "EUR",
  pl: "EUR",
  sv: "EUR",
  uk: "USD",
  hi: "USD",
  id: "USD",
  th: "USD",
  el: "EUR",
};

export function isRTL(lang: string): boolean {
  return RTL_LANGUAGES.includes(lang);
}

export function applyDirection(lang: string) {
  const dir = isRTL(lang) ? "rtl" : "ltr";
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
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
    },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

// Apply direction on init and language change
applyDirection(i18n.language);
i18n.on("languageChanged", applyDirection);

export default i18n;
