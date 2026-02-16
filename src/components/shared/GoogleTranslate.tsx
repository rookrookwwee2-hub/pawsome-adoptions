import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            layout?: number;
            autoDisplay?: boolean;
          },
          element: string
        ) => void;
      };
    };
  }
}

const LANGUAGES = [
  "en", "ar", "es", "fr", "de", "it", "pt", "ru", "zh-CN", "zh-TW",
  "ja", "ko", "tr", "nl", "hi", "ur", "id", "th", "vi", "pl",
  "ro", "el", "sv", "no", "da", "fi", "uk", "cs", "hu", "he",
  "ms", "tl", "bn", "fa", "sw",
].join(",");

const GoogleTranslate = () => {
  useEffect(() => {
    // Avoid re-initializing
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: LANGUAGES,
            layout: 0, // SIMPLE layout
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      id="google_translate_element"
      className="google-translate-container"
    />
  );
};

export default GoogleTranslate;
