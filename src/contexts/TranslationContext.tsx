import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", dir: "ltr" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹", dir: "ltr" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", dir: "ltr" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳", dir: "ltr" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", dir: "ltr" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", dir: "ltr" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", dir: "ltr" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", dir: "ltr" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", dir: "ltr" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱", dir: "ltr" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪", dir: "ltr" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩", dir: "ltr" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭", dir: "ltr" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳", dir: "ltr" },
];

// Cache: lang -> { originalText -> translatedText }
const translationCache: Record<string, Record<string, string>> = {};

// Load cache from localStorage
function loadCache(): void {
  try {
    const stored = localStorage.getItem("pawsfam_translations");
    if (stored) {
      const parsed = JSON.parse(stored);
      Object.assign(translationCache, parsed);
    }
  } catch {}
}

function saveCache(): void {
  try {
    localStorage.setItem("pawsfam_translations", JSON.stringify(translationCache));
  } catch {}
}

loadCache();

interface TranslationContextType {
  language: Language;
  setLanguageCode: (code: string) => void;
  t: (text: string) => string;
  translateBatch: (texts: string[]) => Promise<void>;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Pending batch queue
let pendingTexts: Set<string> = new Set();
let batchTimer: ReturnType<typeof setTimeout> | null = null;
let batchResolvers: Array<() => void> = [];

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [langCode, setLangCode] = useState<string>(() => {
    return localStorage.getItem("pawsfam_language") || "en";
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const [, forceUpdate] = useState(0);

  const language = SUPPORTED_LANGUAGES.find((l) => l.code === langCode) || SUPPORTED_LANGUAGES[0];

  // Set dir attribute on html
  useEffect(() => {
    document.documentElement.dir = language.dir;
    document.documentElement.lang = language.code;
  }, [language]);

  const setLanguageCode = useCallback((code: string) => {
    setLangCode(code);
    localStorage.setItem("pawsfam_language", code);
  }, []);

  const translateBatch = useCallback(
    async (texts: string[]) => {
      if (langCode === "en") return;

      if (!translationCache[langCode]) translationCache[langCode] = {};
      const cache = translationCache[langCode];

      const uncached = texts.filter((t) => t.trim() && !(t in cache));
      if (uncached.length === 0) return;

      setIsTranslating(true);
      try {
        // Batch in chunks of 50
        for (let i = 0; i < uncached.length; i += 50) {
          const chunk = uncached.slice(i, i + 50);
          const { data, error } = await supabase.functions.invoke("translate", {
            body: { texts: chunk, targetLanguage: language.name, sourceLanguage: "English" },
          });

          if (!error && data?.translations) {
            chunk.forEach((original, idx) => {
              cache[original] = data.translations[idx] || original;
            });
          }
        }
        saveCache();
        forceUpdate((n) => n + 1);
      } catch (err) {
        console.error("Translation error:", err);
      } finally {
        setIsTranslating(false);
      }
    },
    [langCode, language.name]
  );

  const t = useCallback(
    (text: string): string => {
      if (langCode === "en" || !text.trim()) return text;

      const cache = translationCache[langCode];
      if (cache && text in cache) return cache[text];

      // Queue for batch translation
      pendingTexts.add(text);
      if (batchTimer) clearTimeout(batchTimer);
      batchTimer = setTimeout(() => {
        const textsToTranslate = Array.from(pendingTexts);
        pendingTexts = new Set();
        batchTimer = null;
        translateBatch(textsToTranslate);
      }, 100);

      return text; // Return original while loading
    },
    [langCode, translateBatch]
  );

  return (
    <TranslationContext.Provider
      value={{ language, setLanguageCode, t, translateBatch, isTranslating }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider");
  }
  return context;
};
