/* =========================================================
   DY Visuals — interactivity
   Vanilla JS, no dependencies.
   ========================================================= */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header on scroll ---------- */
  const header = $("#siteHeader");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 60);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile navigation ---------- */
  const navToggle = $("#navToggle");
  const nav = $("#primaryNav");
  const body = document.body;

  // Inject a backdrop element for the off-canvas menu
  const backdrop = document.createElement("div");
  backdrop.className = "nav-backdrop";
  body.appendChild(backdrop);

  const closeNav = () => {
    body.classList.remove("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    }
  };
  const openNav = () => {
    body.classList.add("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Close menu");
    }
  };

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      body.classList.contains("nav-open") ? closeNav() : openNav();
    });
  }
  backdrop.addEventListener("click", closeNav);
  if (nav) $$(".nav__link", nav).forEach((l) => l.addEventListener("click", closeNav));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  /* ---------- Active nav link highlighting ---------- */
  const navLinks = $$(".nav__link");
  const sections = navLinks
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((l) =>
              l.classList.toggle("is-current", l.getAttribute("href") === "#" + id)
            );
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // small stagger for grouped elements
            setTimeout(() => entry.target.classList.add("is-visible"), (i % 6) * 70);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => revealObs.observe(el));
  }

  /* ---------- Animated stat counters ---------- */
  const counters = $$(".stat__num[data-count]");
  if (counters.length) {
    const animateCount = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      if (prefersReduced) { el.textContent = target; return; }
      const dur = 1600;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
    };
    if ("IntersectionObserver" in window) {
      const countObs = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { animateCount(entry.target); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach((c) => countObs.observe(c));
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ---------- Portfolio filtering ---------- */
  const filters = $$(".filter");
  const galleryItems = $$(".gallery__item");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      const cat = btn.dataset.filter;
      galleryItems.forEach((item) => {
        const show = cat === "all" || item.dataset.category === cat;
        item.classList.toggle("is-hidden", !show);
      });
      rebuildLightboxList();
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbCap = $("#lbCap");
  const lbClose = $("#lbClose");
  const lbPrev = $("#lbPrev");
  const lbNext = $("#lbNext");
  let lbList = [];
  let lbIndex = 0;

  function rebuildLightboxList() {
    lbList = galleryItems.filter((it) => !it.classList.contains("is-hidden"));
  }
  rebuildLightboxList();

  function showLightboxAt(i) {
    if (!lbList.length) return;
    lbIndex = (i + lbList.length) % lbList.length;
    const item = lbList[lbIndex];
    const img = $("img", item);
    const cap = $(".gallery__cap", item);
    lbImg.src = img.dataset.full || img.src;
    lbImg.alt = img.alt || "";
    lbCap.textContent = cap ? cap.querySelector("span").textContent : "";
  }

  function openLightbox(item) {
    rebuildLightboxList();
    showLightboxAt(lbList.indexOf(item));
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    body.style.overflow = "hidden";
    lbClose.focus();
  }
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    body.style.overflow = "";
  }

  galleryItems.forEach((item) => {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.addEventListener("click", () => openLightbox(item));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(item); }
    });
  });

  if (lightbox) {
    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", () => showLightboxAt(lbIndex - 1));
    lbNext.addEventListener("click", () => showLightboxAt(lbIndex + 1));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showLightboxAt(lbIndex - 1);
      if (e.key === "ArrowRight") showLightboxAt(lbIndex + 1);
    });
  }

  /* ---------- Testimonial slider ---------- */
  const track = $("#sliderTrack");
  const quotes = track ? $$(".quote", track) : [];
  const dotsWrap = $("#sliderDots");
  const prevQ = $("#prevQuote");
  const nextQ = $("#nextQuote");
  let qIndex = 0;
  let autoTimer;

  if (track && quotes.length) {
    // build dots
    quotes.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Review " + (i + 1));
      dot.addEventListener("click", () => { goToQuote(i); resetAuto(); });
      dotsWrap.appendChild(dot);
    });
    const dots = $$("button", dotsWrap);

    function goToQuote(i) {
      qIndex = (i + quotes.length) % quotes.length;
      track.style.transform = `translateX(-${qIndex * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle("is-active", di === qIndex));
    }
    function resetAuto() {
      if (prefersReduced) return;
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goToQuote(qIndex + 1), 6000);
    }

    prevQ.addEventListener("click", () => { goToQuote(qIndex - 1); resetAuto(); });
    nextQ.addEventListener("click", () => { goToQuote(qIndex + 1); resetAuto(); });

    // Touch swipe
    let startX = 0;
    track.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { dx < 0 ? goToQuote(qIndex + 1) : goToQuote(qIndex - 1); resetAuto(); }
    }, { passive: true });

    // Pause on hover
    const slider = $("#testimonialSlider");
    slider.addEventListener("mouseenter", () => clearInterval(autoTimer));
    slider.addEventListener("mouseleave", resetAuto);

    goToQuote(0);
    resetAuto();
  }

  /* ---------- Contact form: validate + submit ---------- */
  const form = $("#bookingForm");
  const statusEl = $("#formStatus");
  const submitBtn = $("#submitBtn");

  const setError = (field, msg) => {
    const wrap = field.closest(".field");
    const errEl = wrap ? wrap.querySelector(".field__error") : null;
    if (wrap) wrap.classList.toggle("has-error", !!msg);
    if (errEl) errEl.textContent = msg || "";
    field.setAttribute("aria-invalid", msg ? "true" : "false");
  };

  const validators = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid email.",
    service: (v) => (v ? "" : "Please choose a service."),
    message: (v) => (v.trim().length >= 10 ? "" : "A little more detail helps (10+ characters)."),
  };

  function validateField(field) {
    const fn = validators[field.name];
    if (!fn) return true;
    const msg = fn(field.value);
    setError(field, msg);
    return !msg;
  }

  if (form) {
    // Live-clear errors as the user fixes them
    ["name", "email", "service", "message"].forEach((n) => {
      const f = form.elements[n];
      if (f) f.addEventListener("input", () => {
        if (f.closest(".field").classList.contains("has-error")) validateField(f);
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Honeypot: silently ignore bots
      if (form.elements["bot-field"] && form.elements["bot-field"].value) return;

      let ok = true;
      ["name", "email", "service", "message"].forEach((n) => {
        const f = form.elements[n];
        if (f && !validateField(f)) ok = false;
      });

      if (!ok) {
        statusEl.textContent = "Please fix the highlighted fields.";
        statusEl.className = "form__status is-error";
        const firstErr = form.querySelector(".has-error .field__input");
        if (firstErr) firstErr.focus();
        return;
      }

      const action = form.getAttribute("action") || "";
      const notConfigured = !action || action.includes("your-form-id");

      submitBtn.disabled = true;
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = "Sending…";
      statusEl.textContent = "";
      statusEl.className = "form__status";

      // Demo mode: no real endpoint set yet — simulate success so the UX is testable.
      if (notConfigured) {
        await new Promise((r) => setTimeout(r, 800));
        onSuccess();
        console.info(
          "[DY Visuals] Form endpoint not configured. Set the <form action> to your Formspree/Netlify endpoint. See README."
        );
        return;
      }

      try {
        const res = await fetch(action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (res.ok) onSuccess();
        else throw new Error("Bad response " + res.status);
      } catch (err) {
        statusEl.textContent =
          "Something went wrong. Please email us directly at hello@dyvisuals.com.";
        statusEl.className = "form__status is-error";
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }

      function onSuccess() {
        form.reset();
        statusEl.textContent =
          "Thank you! Your enquiry is on its way — we'll reply within one business day.";
        statusEl.className = "form__status is-success";
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }
})();
