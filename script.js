/* Progressive enhancement: pages and project links remain usable without JS. */
(() => {
  "use strict";
  const dictionaries = window.RIXOBYTE_TRANSLATIONS;
  if (!dictionaries?.nl || !dictionaries?.en) return;
  const root = document.documentElement;
  const menu = document.querySelector("#mainNav");
  const menuButton = document.querySelector(".menu-toggle");
  const mobile = window.matchMedia("(max-width: 600px)");
  const form = document.querySelector("#quoteForm");
  const status = document.querySelector("#formStatus");
  const fallback = document.querySelector(".email-fallback");
  const submitButton = form?.querySelector('[type="submit"]');
  const submitLabel = form?.querySelector("[data-submit-label]");
  let language = "nl";
  let pending = false;
  let statusKey = "";
  let statusType = "";
  const errors = new Map();
  const t = (key) => dictionaries[language][key] || dictionaries.nl[key] || "";
  try {
    language = localStorage.getItem("siteLanguage") === "en" ? "en" : "nl";
  } catch {
    /* Storage can be blocked. */
  }

  function renderStatus() {
    if (!status) return;
    status.textContent = statusKey ? t(statusKey) : "";
    status.dataset.state = statusType;
  }

  function updatePhoneRequirement() {
    if (!form) return;
    const required = form.elements.contact.value === "Telefonisch";
    form.elements.phone.required = required;
    const note = form.querySelector('label[for="phone"] small');
    if (note) note.textContent = t(required ? "phoneRequired" : "optional");
  }

  function setLanguage(next) {
    language = next === "en" ? "en" : "nl";
    root.lang = language;
    try {
      localStorage.setItem("siteLanguage", language);
    } catch {
      /* Preference persistence is optional. */
    }
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = t(el.dataset.i18n);
      if (value) el.textContent = value;
    });
    for (const name of ["placeholder", "aria-label", "alt", "data-label"]) {
      document.querySelectorAll(`[data-i18n-${name}]`).forEach((el) => {
        const value = t(el.getAttribute(`data-i18n-${name}`));
        if (value) el.setAttribute(name, value);
      });
    }
    document
      .querySelectorAll("[data-lang]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.lang === language),
        ),
      );
    const isInfo = document.body.dataset.page === "info";
    document.title = t(isInfo ? "titleInfo" : "titleHome");
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", t(isInfo ? "descInfo" : "descHome"));
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", document.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", t(isInfo ? "descInfo" : "descHome"));
    document
      .querySelector('meta[property="og:locale"]')
      ?.setAttribute("content", language === "nl" ? "nl_NL" : "en_GB");
    if (menuButton)
      menuButton.setAttribute(
        "aria-label",
        t(
          menuButton.getAttribute("aria-expanded") === "true"
            ? "closeMenu"
            : "openMenu",
        ),
      );
    if (form) {
      form.elements.language.value = language;
      form.elements.subject.value = t("mailSubject");
      updatePhoneRequirement();
      errors.forEach((key, name) => {
        document.getElementById(`${name}Error`).textContent = t(key);
      });
      if (submitLabel && pending) submitLabel.textContent = t("sending");
      renderStatus();
      updateFallback();
    }
  }

  function setMenu(open, returnFocus = false) {
    if (!menu || !menuButton) return;
    const expanded = Boolean(open && mobile.matches);
    menu.classList.toggle("is-open", expanded);
    menuButton.setAttribute("aria-expanded", String(expanded));
    menuButton.setAttribute(
      "aria-label",
      t(expanded ? "closeMenu" : "openMenu"),
    );
    document.body.classList.toggle("menu-open", expanded);
    document.querySelectorAll("main, .site-footer").forEach((el) => {
      el.inert = expanded;
    });
    if (expanded) menu.querySelector("a")?.focus();
    else if (returnFocus) menuButton.focus();
  }

  if (menu && menuButton) {
    menuButton.addEventListener("click", () =>
      setMenu(menuButton.getAttribute("aria-expanded") !== "true"),
    );
    menu.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        const target = link.hash && document.querySelector(link.hash);
        setMenu(false);
        if (target && link.pathname === location.pathname) {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
          target.addEventListener(
            "blur",
            () => target.removeAttribute("tabindex"),
            { once: true },
          );
        }
      }),
    );
    document.addEventListener("keydown", (event) => {
      if (menuButton.getAttribute("aria-expanded") !== "true") return;
      if (event.key === "Escape") {
        event.preventDefault();
        setMenu(false, true);
      }
      if (event.key === "Tab") {
        const focusable = [
          ...document.querySelectorAll(".site-header a, .site-header button"),
        ].filter((el) => el.getClientRects().length && !el.disabled);
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    const onResize = () => {
      if (!mobile.matches) setMenu(false);
    };
    if (mobile.addEventListener) mobile.addEventListener("change", onResize);
    else mobile.addListener(onResize);
    window.addEventListener("pageshow", () => setMenu(false));
  }
  document
    .querySelectorAll("[data-lang]")
    .forEach((button) =>
      button.addEventListener("click", () => setLanguage(button.dataset.lang)),
    );
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  const projectTrack = document.querySelector("#projectTrack");
  const projectControls = document.querySelector(".project-controls");
  if (projectTrack && projectControls) {
    const previousButton = projectControls.querySelector(
      '[data-project-scroll="previous"]',
    );
    const nextButton = projectControls.querySelector(
      '[data-project-scroll="next"]',
    );
    const updateProjectControls = () => {
      const maxScroll = projectTrack.scrollWidth - projectTrack.clientWidth;
      previousButton.disabled = projectTrack.scrollLeft <= 1;
      nextButton.disabled = projectTrack.scrollLeft >= maxScroll - 1;
    };
    const scrollProjects = (direction) => {
      const project = projectTrack.querySelector(".project");
      const gap = parseFloat(getComputedStyle(projectTrack).gap) || 0;
      const distance = project.getBoundingClientRect().width + gap;
      projectTrack.scrollBy({
        left: direction * distance,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    };
    previousButton.addEventListener("click", () => scrollProjects(-1));
    nextButton.addEventListener("click", () => scrollProjects(1));
    projectTrack.addEventListener("scroll", updateProjectControls, {
      passive: true,
    });
    window.addEventListener("resize", updateProjectControls);
    projectControls.hidden = false;
    updateProjectControls();
  }

  if (
    document.body.dataset.page === "home" &&
    "IntersectionObserver" in window
  ) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          document.querySelectorAll("[data-section]").forEach((link) => {
            if (link.dataset.section === entry.target.id)
              link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-12% 0px -65% 0px", threshold: 0 },
    );
    document
      .querySelectorAll("section[id]")
      .forEach((section) => observer.observe(section));
  }

  function markError(name, key) {
    const field = form.elements[name];
    const output = document.getElementById(`${name}Error`);
    if (key) {
      errors.set(name, key);
      field.setAttribute("aria-invalid", "true");
      output.textContent = t(key);
    } else {
      errors.delete(name);
      field.removeAttribute("aria-invalid");
      output.textContent = "";
    }
  }

  function validationKey(name) {
    const field = form.elements[name];
    const value = field.value.trim();
    if (name === "name" && !value) return "requiredName";
    if (name === "email" && (!value || !field.validity.valid))
      return "requiredEmail";
    if (name === "message" && !value) return "requiredMessage";
    if (name === "phone") {
      if (field.required && !value) return "requiredPhone";
      const digits = value.replace(/\D/g, "");
      if (
        value &&
        (digits.length < 6 ||
          digits.length > 16 ||
          !/^[+\d\s().-]+$/.test(value))
      )
        return "invalidPhone";
    }
    return "";
  }

  function updateFallback() {
    if (!fallback || !form) return;
    const names = [
      "name",
      "company",
      "email",
      "phone",
      "project",
      "contact",
      "message",
    ];
    const labels = [
      "labelname",
      "labelcompany",
      "labelemail",
      "labelphone",
      "projectLabel",
      "contactLabel",
      "messageLabel",
    ];
    const body = names
      .map((name, i) => {
        const control = form.elements[name];
        const value =
          control.tagName === "SELECT"
            ? control.selectedOptions[0]?.textContent
            : control.value.trim();
        return `${t(labels[i])}: ${value || "—"}`;
      })
      .join("\n\n");
    fallback.href = `mailto:mrr.zakelijk@gmail.com?subject=${encodeURIComponent(t("mailSubject"))}&body=${encodeURIComponent(body)}`;
  }

  if (form && window.fetch && window.AbortController) {
    form.noValidate = true;
    ["name", "email", "phone", "message"].forEach((name) => {
      form.elements[name].addEventListener("input", () => {
        if (errors.has(name)) markError(name, validationKey(name));
      });
      form.elements[name].addEventListener("blur", () => {
        if (form.elements[name].value || errors.has(name))
          markError(name, validationKey(name));
      });
    });
    form.elements.contact.addEventListener("change", () => {
      updatePhoneRequirement();
      if (errors.has("phone")) markError("phone", validationKey("phone"));
    });
    form.addEventListener("input", updateFallback);
    form.addEventListener("change", updateFallback);
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (pending || form.elements.botcheck.checked) return;
      updatePhoneRequirement();
      ["name", "email", "phone", "message"].forEach((name) =>
        markError(name, validationKey(name)),
      );
      if (errors.size) {
        statusKey = "invalidForm";
        statusType = "error";
        renderStatus();
        form.elements[errors.keys().next().value].focus();
        return;
      }
      pending = true;
      submitButton.disabled = true;
      submitLabel.textContent = t("sending");
      form.setAttribute("aria-busy", "true");
      statusKey = "sending";
      statusType = "sending";
      renderStatus();
      fallback.hidden = true;
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15000);
      const data = new FormData(form);
      ["name", "email", "message", "company", "phone"].forEach((name) =>
        data.set(name, String(data.get(name) || "").trim()),
      );
      data.set("replyto", data.get("email"));
      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: data,
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        const result = await response.json();
        if (!response.ok || result.success !== true)
          throw new Error("Submission not confirmed");
        // Preserve edits made while the request was in flight.
        const changed = [
          "name",
          "email",
          "message",
          "company",
          "phone",
          "project",
          "contact",
        ].some(
          (name) =>
            form.elements[name].value.trim() !== String(data.get(name) || ""),
        );
        if (!changed) form.reset();
        form.elements.language.value = language;
        form.elements.subject.value = t("mailSubject");
        updatePhoneRequirement();
        statusKey = "sent";
        statusType = "success";
      } catch (error) {
        statusKey = error.name === "AbortError" ? "sendTimeout" : "sendError";
        statusType = "error";
        updateFallback();
        fallback.hidden = false;
      } finally {
        window.clearTimeout(timeout);
        pending = false;
        submitButton.disabled = false;
        submitLabel.textContent = t("send");
        form.removeAttribute("aria-busy");
        renderStatus();
      }
    });
  }
  setLanguage(language);
  root.classList.add("js");
})();
