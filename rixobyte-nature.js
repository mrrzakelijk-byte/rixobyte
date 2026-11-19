/* Rixobyte nature background: continuous lightweight leaf animation. */
(() => {
  "use strict";
  const hero = document.querySelector('body[data-page="home"] .hero');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.createElement('div');
  layer.className = 'hero-leaves';
  layer.setAttribute('aria-hidden', 'true');
  const colors = ['#b47d45', '#d2a766', '#9e7150', '#b4a06c', '#81966a'];
  // Fixed pseudo-random positions keep the same layout on every page load.
  let seed = 39721;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 26; i++) {
    const leaf = document.createElement('span');
    leaf.className = 'hero-leaf';
    leaf.style.setProperty('--leaf-x', (random() * 105 - 5).toFixed(1) + '%');
    leaf.style.setProperty('--leaf-size', (5 + random() * 9).toFixed(1) + 'px');
    leaf.style.setProperty('--leaf-duration', (16 + random() * 17).toFixed(1) + 's');
    leaf.style.setProperty('--leaf-delay', (-random() * 33).toFixed(1) + 's');
    leaf.style.setProperty('--leaf-color', colors[Math.floor(random() * colors.length)]);
    fragment.appendChild(leaf);
  }
  layer.appendChild(fragment);
  hero.prepend(layer);
})();
