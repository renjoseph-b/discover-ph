/* ==========================================================================
   TARA. — History page interactions
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
    if (e.key === "Escape") closeMobileNav();
  });
  // Close drawer when a real link inside it is followed
  if (mobileNav) {
    mobileNav.querySelectorAll(".mobile-nav_link, .mobile-nav_submenu-link").forEach(function (link) {
      link.addEventListener("click", function () {
        if (link.getAttribute("href") && link.getAttribute("href") !== "#") closeMobileNav();
      });
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
      // small stagger for elements that reveal together within a grid
      el.style.transitionDelay = (Math.min(i % 6, 5) * 60) + "ms";
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ------------------------------------------------------------------
     Interactive timeline — accordion, one open at a time
  ------------------------------------------------------------------ */
  var timeline = document.getElementById("interactiveTimeline");
  if (timeline) {
    var items = timeline.querySelectorAll(".h-timeline_item");
    items.forEach(function (item) {
      var head = item.querySelector(".h-timeline_head");
      head.addEventListener("click", function () {
        var isOpen = item.getAttribute("data-open") === "true";
        items.forEach(function (other) {
          other.setAttribute("data-open", "false");
          other.querySelector(".h-timeline_head").setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.setAttribute("data-open", "true");
          head.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     Hero scroll indicator — smooth scroll handled natively via
     html { scroll-behavior: smooth } + href="#before" in the markup.
  ------------------------------------------------------------------ */
})();