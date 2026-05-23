/* ============================================================
   Exponential Venture Capital — shared site script
   Minimal vanilla JS. No build step.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 8) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile drawer ---------- */
  const drawer = document.querySelector(".drawer");
  const openBtn = document.querySelector("[data-drawer-open]");
  const closeBtn = document.querySelector("[data-drawer-close]");
  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  if (openBtn) openBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (drawer) {
    drawer
      .querySelectorAll("a")
      .forEach((a) => a.addEventListener("click", closeDrawer));
  }

  /* ---------- Routing modal (Talk to us) ---------- */
  const modal = document.querySelector(".modal");
  const modalOpens = document.querySelectorAll("[data-modal-open]");
  const modalClose = document.querySelector("[data-modal-close]");
  function openModal() {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }
  modalOpens.forEach((b) =>
    b.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    }),
  );
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeDrawer();
    }
  });

  /* ---------- Subscribe (Supabase newsletter_signups) ---------- */
  const SUBSCRIBE_WIDGETS = document.querySelectorAll(".subscribe");
  if (SUBSCRIBE_WIDGETS.length > 0) {
    const SUPABASE_URL = "https://blkidupaogqyvetgyhyo.supabase.co";
    const SUPABASE_KEY = "sb_publishable_p9ktPDpGYqqJOCpCPj0sdg_BEkLhSQu";
    const SUBSCRIBE_SOURCE = location.hostname || "exponentialventure.capital";
    let sbReady = null;

    function loadSupabase() {
      if (sbReady) return sbReady;
      sbReady = new Promise((resolve, reject) => {
        if (window.supabase) {
          return resolve(
            window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY),
          );
        }
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        s.onload = () =>
          resolve(window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY));
        s.onerror = reject;
        document.head.appendChild(s);
      });
      return sbReady;
    }

    SUBSCRIBE_WIDGETS.forEach((widget) => {
      const row = widget.querySelector(".subscribe__row");
      const btn = widget.querySelector("button");
      const input = widget.querySelector("input[type=email]");
      if (!btn || !input || !row) return;

      function flagError() {
        input.style.borderColor = "#a8323a";
        input.focus();
        setTimeout(() => {
          input.style.borderColor = "";
        }, 1800);
      }

      async function submit(e) {
        if (e) e.preventDefault();
        const email = input.value.trim();
        if (!email || !email.includes("@")) return flagError();

        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = "...";

        try {
          const sb = await loadSupabase();
          const { error } = await sb
            .from("newsletter_signups")
            .insert({ email, source: SUBSCRIBE_SOURCE });
          // 23505 = unique constraint (already subscribed) — treat as success.
          if (!error || error.code === "23505") {
            widget.classList.add("is-done");
          } else {
            btn.disabled = false;
            btn.textContent = originalText;
            flagError();
          }
        } catch (err) {
          btn.disabled = false;
          btn.textContent = originalText;
          flagError();
        }
      }

      btn.addEventListener("click", submit);
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") submit(e);
      });
    });
  }

  /* ---------- Inquiry forms (founder + LP) ---------- */
  document.querySelectorAll("[data-inquiry-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // TODO: POST to Formspree / Basin endpoint configured in form's action attribute.
      // Until backend is wired, treat as successful local-only submission.
      form.classList.add("is-submitted");
      const success = form.querySelector(".form__success");
      if (success) success.classList.add("is-visible");
      window.scrollTo({
        top: form.getBoundingClientRect().top + window.scrollY - 100,
        behavior: "smooth",
      });
    });
  });

  /* ---------- Reveal on scroll ---------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    document
      .querySelectorAll(".reveal, .reveal-layer")
      .forEach((el) => io.observe(el));
  } else {
    document
      .querySelectorAll(".reveal, .reveal-layer")
      .forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Current year footer ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
