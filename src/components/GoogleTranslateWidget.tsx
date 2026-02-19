import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

const GoogleTranslateWidget = () => {
  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // Inject custom styles to override Google Translate defaults
    const style = document.createElement("style");
    style.id = "google-translate-custom-styles";
    style.textContent = `
      /* Hide the top banner that Google Translate adds */
      .goog-te-banner-frame {
        display: none !important;
      }
      body {
        top: 0 !important;
      }

      /* Style the translate widget container */
      #google_translate_element .goog-te-gadget {
        font-family: inherit !important;
        font-size: 0 !important;
        color: transparent !important;
      }

      #google_translate_element .goog-te-gadget > span {
        display: none !important;
      }

      /* Style the select dropdown */
      #google_translate_element select.goog-te-combo {
        font-family: inherit !important;
        font-size: 0.875rem !important;
        font-weight: 500 !important;
        color: hsl(var(--muted-foreground)) !important;
        background-color: transparent !important;
        border: 1.5px solid hsl(var(--border)) !important;
        border-radius: 9999px !important;
        padding: 0.35rem 0.75rem !important;
        outline: none !important;
        cursor: pointer !important;
        appearance: none !important;
        -webkit-appearance: none !important;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") !important;
        background-repeat: no-repeat !important;
        background-position: right 0.55rem center !important;
        padding-right: 1.75rem !important;
        transition: border-color 0.2s, color 0.2s !important;
        max-width: 130px !important;
      }

      #google_translate_element select.goog-te-combo:hover {
        border-color: hsl(var(--primary)) !important;
        color: hsl(var(--foreground)) !important;
      }

      #google_translate_element select.goog-te-combo:focus {
        border-color: hsl(var(--primary)) !important;
        box-shadow: 0 0 0 2px hsl(var(--primary) / 0.15) !important;
      }

      /* Dark mode adjustments */
      .dark #google_translate_element select.goog-te-combo {
        color: hsl(var(--muted-foreground)) !important;
      }
      .dark #google_translate_element select.goog-te-combo:hover {
        color: hsl(var(--foreground)) !important;
      }

      /* Hide Google Translate attribution / branding */
      .goog-te-gadget .goog-te-gadget-simple img,
      .goog-te-gadget > div,
      #google_translate_element .goog-logo-link,
      .goog-te-gadget .goog-te-gadget-simple .goog-te-gadget-icon {
        display: none !important;
      }

      /* Hide the google translate tooltip */
      .goog-tooltip,
      .goog-tooltip:hover {
        display: none !important;
      }
      .goog-text-highlight {
        background-color: transparent !important;
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return <div id="google_translate_element" className="shrink-0" />;
};

export default GoogleTranslateWidget;
