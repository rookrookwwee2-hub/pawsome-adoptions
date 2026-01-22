import { useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

const GoogleAnalytics = () => {
  const { settings, loading } = useAnalytics();

  useEffect(() => {
    if (loading || !settings) return;

    // Load Google Analytics
    if (settings.ga_enabled && settings.ga_measurement_id) {
      // Check if script already exists
      if (!document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.ga_measurement_id}`;
        document.head.appendChild(script);

        const inlineScript = document.createElement("script");
        inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${settings.ga_measurement_id}');
        `;
        document.head.appendChild(inlineScript);
      }
    }

    // Load Google Tag Manager
    if (settings.gtm_enabled && settings.gtm_container_id) {
      // Check if GTM already exists
      if (!document.querySelector(`script[src*="googletagmanager.com/gtm.js"]`)) {
        const script = document.createElement("script");
        script.innerHTML = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${settings.gtm_container_id}');
        `;
        document.head.appendChild(script);

        // Add noscript fallback to body
        const noscript = document.createElement("noscript");
        noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${settings.gtm_container_id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
        document.body.insertBefore(noscript, document.body.firstChild);
      }
    }
  }, [settings, loading]);

  return null;
};

export default GoogleAnalytics;
