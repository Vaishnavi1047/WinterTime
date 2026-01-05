import { useEffect, useRef } from "react";

const LanguageSwitcher = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const el = document.getElementById("google_translate_element");
    if (el) el.innerHTML = "";

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,bn,ta,te,ml,kn,mr,gu,pa,ur",
          autoDisplay: false
        },
        "google_translate_element"
      );
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else {
      window.googleTranslateElementInit();
    }
  }, []);

  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-slate-400 uppercase tracking-widest">
        Language
      </span>
      <div id="google_translate_element" />
    </div>
  );
};

export default LanguageSwitcher;
