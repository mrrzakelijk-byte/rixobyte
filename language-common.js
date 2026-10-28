/* Shared language choice for Rixobyte's contact and information pages. */
(() => {
  "use strict";
  const storageKey = "siteLanguage";
  const labels = {
    nl: {
      navHome: "Home", navProjects: "Projecten", navServices: "Diensten",
      navProcess: "Werkwijze", navMaintenance: "Onderhoud",
      navFaq: "FAQ", navContact: "Contact", navPrivacy: "Privacy",
      navTerms: "Voorwaarden", navCookies: "Cookies",
      navigation: "Navigatie", legalNavigation: "Juridische informatie",
      chooseLanguage: "Taal kiezen", footerRegistration: "KVK-nummer: nog niet bekend · Btw-nummer: nog niet bekend",
      contactEmail: "E-mail", contactBreadcrumb: "Contact"
    },
    en: {
      navHome: "Home", navProjects: "Projects", navServices: "Services",
      navProcess: "Process", navMaintenance: "Maintenance",
      navFaq: "FAQ", navContact: "Contact", navPrivacy: "Privacy",
      navTerms: "Terms and conditions", navCookies: "Cookies",
      navigation: "Navigation", legalNavigation: "Legal information",
      chooseLanguage: "Choose language", footerRegistration: "Chamber of Commerce: not yet available · VAT number: not yet available",
      contactEmail: "Email", contactBreadcrumb: "Contact"
    }
  };
  const pageTitles = {
    contact: {nl: "Contact en offerte aanvragen | Rixobyte", en: "Contact and website quotes | Rixobyte"},
    legalTerms: {nl: "Algemene voorwaarden | Rixobyte", en: "Terms and conditions | Rixobyte"},
    legalPrivacy: {nl: "Privacyverklaring | Rixobyte", en: "Privacy policy | Rixobyte"},
    legalCookies: {nl: "Cookiebeleid | Rixobyte", en: "Cookie policy | Rixobyte"},
    legalFAQ: {nl: "Veelgestelde vragen over websites | Rixobyte", en: "Frequently asked questions | Rixobyte"},
    legalMaintenance: {nl: "Websiteonderhoud en ondersteuning | Rixobyte", en: "Website maintenance and support | Rixobyte"}
  };
  let initial = "nl";
  try {
    initial = localStorage.getItem(storageKey) || localStorage.getItem("rixobyte-language") || "nl";
  } catch {
    /* Language switching must still work when browser storage is unavailable. */
  }
  function chooseLanguage(next) {
    const language = next === "en" ? "en" : "nl";
    document.documentElement.lang = language;
    document.querySelectorAll("[data-lang]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.lang === language));
    });
    document.querySelectorAll("[data-site-i18n]").forEach(el => {
      const value = labels[language][el.dataset.siteI18n];
      if (value !== undefined) el.textContent = value;
    });
    document.querySelectorAll("[data-site-aria-label]").forEach(el => {
      const value = labels[language][el.dataset.siteAriaLabel];
      if (value !== undefined) el.setAttribute("aria-label", value);
    });
    const page = document.body.dataset.sitePage;
    if (pageTitles[page]) document.title = pageTitles[page][language];
    try { localStorage.setItem(storageKey, language); } catch {
      /* Saving the language is optional. */
    }
  }
  document.querySelectorAll("[data-lang]").forEach(button =>
    button.addEventListener("click", () => chooseLanguage(button.dataset.lang))
  );
  chooseLanguage(initial);
})();
