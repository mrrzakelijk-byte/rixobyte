/* Rixobyte: premium scroll reveals without scroll hijacking.
   Only opacity/transform animate; visible content and forms stay interactive. */
(() => {
  "use strict";
  if (document.body.dataset.page !== "home") return;
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const selectors = [
    ".projects .section-intro", ".projects .project",
    ".services .services-heading", ".services .service-row",
    ".process .section-intro", ".process .process-list > li",
    ".agreements .section-intro", ".agreements .agreement-card", ".agreements .agreements-note",
    ".maker .maker-symbol", ".maker .maker-copy",
    ".faq .faq-intro", ".faq .faq-list",
    ".contact .contact-copy", ".contact .quote-form",
    ".site-footer .rix-footer-intro", ".site-footer .rix-footer-col", ".site-footer .rix-footer-base"
  ];

  const items = [...document.querySelectorAll(selectors.join(","))];
  if (!items.length) return;

  const top = () => window.scrollY || document.documentElement.scrollTop || 0;
  let seen = 0;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-in-view");
      observer.unobserve(entry.target);
    }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  for (const element of items) {
    const rect = element.getBoundingClientRect();
    // Don't hide content already on screen or above the viewport when loading
    // or arriving through a #section anchor.
    if (rect.top < window.innerHeight * 1.04) continue;
    element.classList.add("rix-reveal-ready");
    // Gentle varied staging, not long delays that make scrolling feel slow.
    const sequence = seen++ % 4;
    element.style.setProperty("--rix-reveal-delay", sequence * 48 + "ms");
    observer.observe(element);
  }
  // No scroll handler, no forced smooth wheel scrolling, no layout thrashing.
})();
