/* ==========================================================================
   TARA. — Contact page interactions
   Mirrors the header/nav/reveal patterns established in history.js.
   ========================================================================== */
(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var menuToggle = document.getElementById("menuToggle");
  var mobileNav = document.getElementById("mobileNav");
  var mobileScrim = document.getElementById("mobileScrim");

  /* ------------------------------------------------------------------
     Header — solid on scroll
  ------------------------------------------------------------------ */
  function updateHeaderState() {
    if (!header) return;
    if (window.scrollY > 24) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* ------------------------------------------------------------------
     Mobile nav drawer
  ------------------------------------------------------------------ */
  function openMobileNav() {
    mobileNav.classList.add("is-open");
    mobileScrim.classList.add("is-visible");
    mobileNav.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("nav-open");
  }
  function closeMobileNav() {
    mobileNav.classList.remove("is-open");
    mobileScrim.classList.remove("is-visible");
    mobileNav.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("nav-open");
  }
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.contains("is-open");
      if (isOpen) { closeMobileNav(); } else { openMobileNav(); }
    });
  }
  if (mobileScrim) {
    mobileScrim.addEventListener("click", closeMobileNav);
  }
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    closeMobileNav();
    // Escape also closes any open desktop dropdown, using the same
    // is-open/aria-expanded toggling the click-outside handler below uses.
    document.querySelectorAll(".nav-item.is-open").forEach(function (item) {
      item.classList.remove("is-open");
      var t = item.querySelector(".primary-nav_link");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  });
  if (mobileNav) {
    mobileNav.querySelectorAll(".mobile-nav_submenu-link, .mobile-nav_list > li:not(.mobile-nav_item) > .mobile-nav_link").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });
  }

  /* ------------------------------------------------------------------
     Mobile submenus (About Philippines, Attractions)
  ------------------------------------------------------------------ */
  document.querySelectorAll(".mobile-nav_submenu-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".mobile-nav_item");
      var submenu = item.querySelector(".mobile-nav_submenu");
      var isOpen = submenu.classList.contains("is-open");
      submenu.classList.toggle("is-open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* ------------------------------------------------------------------
     Desktop dropdowns — click/tap + keyboard support
     (hover already handled in CSS; this adds touch + keyboard access)
  ------------------------------------------------------------------ */
  document.querySelectorAll(".nav-item").forEach(function (item) {
    var trigger = item.querySelector(".primary-nav_link");
    if (!trigger) return;
    trigger.addEventListener("click", function (e) {
      var dropdown = item.querySelector(".primary-nav_dropdown");
      if (!dropdown) return;
      e.preventDefault();
      var willOpen = !item.classList.contains("is-open");
      document.querySelectorAll(".nav-item.is-open").forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove("is-open");
          var t = openItem.querySelector(".primary-nav_link");
          if (t) t.setAttribute("aria-expanded", "false");
        }
      });
      item.classList.toggle("is-open", willOpen);
      trigger.setAttribute("aria-expanded", String(willOpen));
    });
  });
  document.addEventListener("click", function (e) {
    document.querySelectorAll(".nav-item.is-open").forEach(function (item) {
      if (!item.contains(e.target)) {
        item.classList.remove("is-open");
        var t = item.querySelector(".primary-nav_link");
        if (t) t.setAttribute("aria-expanded", "false");
      }
    });
  });

  /* ------------------------------------------------------------------
     Scroll reveal — fades/rises elements marked .reveal into view
  ------------------------------------------------------------------ */
  var revealTargets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealTargets.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 6, 5) * 60) + "ms";
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ------------------------------------------------------------------
     Contact form — client-side validation + success state
  ------------------------------------------------------------------ */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    var successBox = document.getElementById("contactSuccess");

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var fields = contactForm.querySelectorAll("[data-required]");

      fields.forEach(function (field) {
        var wrapper = field.closest(".form-field");
        var value = field.value.trim();
        var isValid = value.length > 0;

        if (field.type === "email" && isValid) {
          isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }

        if (wrapper) wrapper.classList.toggle("has-error", !isValid);
        if (!isValid) valid = false;
      });

      if (!valid) {
        if (successBox) successBox.classList.remove("is-visible");
        return;
      }

      if (successBox) successBox.classList.add("is-visible");
      contactForm.reset();
    });
  }

  /* ------------------------------------------------------------------
     Back to top
  ------------------------------------------------------------------ */
  var backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();