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

  /* ---------- Book reader (iframe + fallback) ---------- */
  const bookReader = document.querySelector("[data-book-reader]");
  if (bookReader) {
    const frame = bookReader.querySelector("[data-book-reader-frame]");
    const titleEl = bookReader.querySelector(".book-reader__title");
    const externals = bookReader.querySelectorAll(
      "[data-book-reader-external]",
    );
    const closeReader = bookReader.querySelector("[data-book-reader-close]");
    let blockedTimer = null;

    function openBookReader(url, title) {
      titleEl.textContent = title || "Book";
      externals.forEach((a) => {
        a.setAttribute("href", url);
      });
      bookReader.classList.remove("is-blocked");
      frame.setAttribute("title", title || "Book");
      frame.setAttribute("src", url);
      bookReader.classList.add("is-open");
      bookReader.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      // If the iframe load event hasn't fired in ~4s, assume framing is blocked
      // and surface the fallback. (Cross-origin frames don't reliably error.)
      if (blockedTimer) clearTimeout(blockedTimer);
      let loaded = false;
      const onLoad = () => {
        loaded = true;
      };
      frame.addEventListener("load", onLoad, { once: true });
      blockedTimer = setTimeout(() => {
        if (!loaded) bookReader.classList.add("is-blocked");
      }, 4000);
    }

    function closeBookReader() {
      bookReader.classList.remove("is-open", "is-blocked");
      bookReader.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      frame.setAttribute("src", "about:blank");
      if (blockedTimer) {
        clearTimeout(blockedTimer);
        blockedTimer = null;
      }
    }

    document.querySelectorAll("[data-book-open]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // Allow modifier-clicks / middle-clicks to use the underlying href
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        openBookReader(
          btn.getAttribute("data-book-url"),
          btn.getAttribute("data-book-title"),
        );
      });
    });

    if (closeReader) closeReader.addEventListener("click", closeBookReader);
    bookReader.addEventListener("click", (e) => {
      if (e.target === bookReader) closeBookReader();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && bookReader.classList.contains("is-open")) {
        closeBookReader();
      }
    });
  }

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
    const submitBtn = form.querySelector('button[type="submit"]');

    function showError(msg) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.dataset.busy = "";
      }
      let errEl = form.querySelector(".form__error");
      if (!errEl) {
        errEl = document.createElement("p");
        errEl.className = "form__error";
        errEl.setAttribute("role", "alert");
        const submitWrap = form.querySelector(".form__submit");
        if (submitWrap) submitWrap.insertAdjacentElement("afterend", errEl);
        else form.appendChild(errEl);
      }
      errEl.textContent =
        msg ||
        "Something went wrong sending your message. Please try again, or email us directly.";
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const action = form.getAttribute("action") || "";
      if (!action || action.indexOf("REPLACE_") !== -1) {
        showError(
          "This form is not yet connected. Please email us directly while we finish setup.",
        );
        return;
      }

      const existingError = form.querySelector(".form__error");
      if (existingError) existingError.remove();

      const originalLabel = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.busy = "1";
        submitBtn.textContent = "Sending…";
      }

      try {
        const res = await fetch(action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          form.classList.add("is-submitted");
          const success = form.querySelector(".form__success");
          if (success) success.classList.add("is-visible");
          window.scrollTo({
            top: form.getBoundingClientRect().top + window.scrollY - 100,
            behavior: "smooth",
          });
        } else {
          let msg = "";
          try {
            const data = await res.json();
            if (data && Array.isArray(data.errors) && data.errors.length) {
              msg = data.errors.map((x) => x.message).join(", ");
            }
          } catch (_) {
            /* non-JSON error body */
          }
          if (submitBtn) submitBtn.innerHTML = originalLabel;
          showError(msg);
        }
      } catch (_) {
        if (submitBtn) submitBtn.innerHTML = originalLabel;
        showError();
      }
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
