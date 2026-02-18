import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "@/i18n";
import { cn } from "@/lib/utils";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm hover:bg-muted transition-colors border border-border bg-background"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span className="hidden sm:inline">{currentLang.flag}</span>
        <span className="hidden md:inline text-xs">{currentLang.code.toUpperCase()}</span>
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 max-h-80 overflow-y-auto rounded-lg border border-border bg-background shadow-lg z-50">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted transition-colors text-left",
                lang.code === currentLang.code && "bg-primary/10 text-primary font-medium"
              )}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="flex-1">{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
