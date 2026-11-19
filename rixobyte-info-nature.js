/* Ambient details for the About page. No scroll listeners or UI changes. */
(() => {
  "use strict";
  if (document.body.dataset.page !== "info" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const areas = document.querySelectorAll(".info-hero,.about-grid,.info-vision,.info-details,.privacy-section");
  let seed=4107;
  const random=()=>{ seed=(seed*1664525+1013904223)>>>0;return seed/4294967296; };
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
  for (const section of areas) {
    const layer=document.createElement("div");
    layer.className="info-nature-leaves";
    layer.setAttribute("aria-hidden","true");
    const frag=document.createDocumentFragment();
    for(let i=0;i<(compact?5:8);i++){
      const leaf=document.createElement("span");
      leaf.className="info-nature-leaf";
      leaf.style.setProperty("--info-x",(random()*96).toFixed(2)+"%");
      leaf.style.setProperty("--info-size",(4+random()*7).toFixed(1)+"px");
      leaf.style.setProperty("--info-time",(22+random()*20).toFixed(1)+"s");
      leaf.style.setProperty("--info-delay",(-random()*44).toFixed(1)+"s");
      leaf.style.setProperty("--info-color",random()>.5?"#b39365":"#718d69");
      frag.appendChild(leaf);
    }
    layer.appendChild(frag);
    section.prepend(layer);
    if (observer) {
      visibleLayers.set(section, layer);
      observer.observe(section);
    } else {
      layer.classList.add("ambient-active");
    }
  }
})();
