/* Continuous ambient nature motion for every homepage chapter. */
(() => {
  "use strict";
  const targets = document.querySelectorAll('body[data-page="home"] .hero, body[data-page="home"] .projects, body[data-page="home"] .services, body[data-page="home"] .process, body[data-page="home"] .agreements, body[data-page="home"] .maker, body[data-page="home"] .faq, body[data-page="home"] .contact, body[data-page="home"] .site-footer');
  if (!targets.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#ba8455', '#d1a66e', '#9c7458', '#bd9f6c', '#789377'];
  let seed = 39721;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  // Pause background leaf animations in sections that are not on screen.
  // This saves CPU and battery without altering the visual effect when scrolling.
  const visibleLayers = new WeakMap();
  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver(entries => {
        for (const entry of entries) {
          const layer = visibleLayers.get(entry.target);
          if (layer) layer.classList.toggle("ambient-active", entry.isIntersecting);
        }
      }, { rootMargin: "160px 0px 160px 0px" })
    : null;
  const compact = window.matchMedia("(max-width: 700px)").matches;
  for (const [index, target] of [...targets].entries()) {
    const layer = document.createElement('div');
    layer.className = 'hero-leaves';
    layer.setAttribute('aria-hidden', 'true');
    const fragment = document.createDocumentFragment();
    // Natural stagger: different speeds/starting points, no synchronized 1-second reset.
    const quantity = compact
      ? (index === 0 ? 12 : 6)
      : (index === 0 ? 23 : index === 7 ? 7 : 10);
    for (let i = 0; i < quantity; i++) {
      const leaf = document.createElement('span');
      leaf.className = 'hero-leaf';
      leaf.style.setProperty('--leaf-x', (random() * 105 - 5).toFixed(1) + '%');
      leaf.style.setProperty('--leaf-size', (5 + random() * 8).toFixed(1) + 'px');
      leaf.style.setProperty('--leaf-duration', (19 + random() * 22).toFixed(1) + 's');
      leaf.style.setProperty('--leaf-delay', (-random() * 44).toFixed(1) + 's');
      leaf.style.setProperty('--leaf-color', colors[Math.floor(random() * colors.length)]);
      fragment.appendChild(leaf);
    }
    layer.appendChild(fragment);
    target.prepend(layer);
    if (observer) {
      visibleLayers.set(target, layer);
      observer.observe(target);
    } else {
      layer.classList.add("ambient-active");
    }
  }
})();
