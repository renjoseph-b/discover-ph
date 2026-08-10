/* ==========================================================================
   TARA. — shared interactions
   Header state, dropdowns, mobile drawer, scroll-reveal, carousels
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------- Sticky header state ---------------- */
  var header = document.getElementById("siteHeader");
  var onScroll = function () {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- Desktop dropdowns (click + keyboard, hover via CSS) ---------------- */
  var navItems = document.querySelectorAll(".nav-item--has-dropdown");
  navItems.forEach(function (item) {
    var link = item.querySelector(":scope > .primary-nav_link");
    if (!link) return;

    link.addEventListener("click", function (e) {
      // Only intercept when the dropdown itself is the target of interaction
      // (small screens fall back to the drawer, so this only matters on desktop)
      if (window.innerWidth < 900) return;
      var isOpen = item.classList.contains("is-open");
      navItems.forEach(function (other) {
        other.classList.remove("is-open");
        var otherLink = other.querySelector(":scope > .primary-nav_link");
        if (otherLink) otherLink.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        e.preventDefault();
        item.classList.add("is-open");
        link.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav-item--has-dropdown")) {
      navItems.forEach(function (item) {
        item.classList.remove("is-open");
        var link = item.querySelector(":scope > .primary-nav_link");
        if (link) link.setAttribute("aria-expanded", "false");
      });
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      navItems.forEach(function (item) {
        item.classList.remove("is-open");
        var link = item.querySelector(":scope > .primary-nav_link");
        if (link) link.setAttribute("aria-expanded", "false");
      });
    }
  });

  /* ---------------- Mobile drawer ---------------- */
  var menuToggle = document.getElementById("menuToggle");
  var mobileNav = document.getElementById("mobileNav");
  var mobileScrim = document.getElementById("mobileNavScrim");

  function openDrawer() {
    if (!mobileNav) return;
    mobileNav.classList.add("is-open");
    mobileScrim.classList.add("is-visible");
    mobileNav.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  }
  function closeDrawer() {
    if (!mobileNav) return;
    mobileNav.classList.remove("is-open");
    mobileScrim.classList.remove("is-visible");
    mobileNav.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      var isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) closeDrawer();
      else openDrawer();
    });
  }
  if (mobileScrim) mobileScrim.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDrawer();
  });

  /* ---------------- Mobile submenus (About Philippines / Attractions) ---------------- */
  var subToggles = document.querySelectorAll(".mobile-nav_submenu-toggle");
  subToggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetId = btn.getAttribute("aria-controls");
      var target = document.getElementById(targetId);
      var isOpen = btn.getAttribute("aria-expanded") === "true";
      subToggles.forEach(function (other) {
        if (other !== btn) {
          other.setAttribute("aria-expanded", "false");
          var otherTarget = document.getElementById(other.getAttribute("aria-controls"));
          if (otherTarget) otherTarget.classList.remove("is-open");
        }
      });
      btn.setAttribute("aria-expanded", String(!isOpen));
      if (target) target.classList.toggle("is-open", !isOpen);
    });
  });

  /* ---------------- Scroll reveal ---------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------- Generic horizontal carousels ---------------- */
  var carousels = document.querySelectorAll("[data-carousel]");
  carousels.forEach(function (carousel) {
    var track = carousel.querySelector("[data-carousel-track]");
    var prev = carousel.querySelector("[data-carousel-prev]");
    var next = carousel.querySelector("[data-carousel-next]");
    var counter = carousel.querySelector("[data-carousel-count]");
    if (!track) return;

    function itemWidth() {
      var item = track.querySelector("[data-carousel-item]");
      if (!item) return track.clientWidth;
      var style = window.getComputedStyle(track);
      var gap = parseFloat(style.columnGap || style.gap || "0") || 0;
      return item.getBoundingClientRect().width + gap;
    }

    function updateCounter() {
      var items = track.querySelectorAll("[data-carousel-item]");
      if (!items.length || !counter) return;
      var scrollLeft = track.scrollLeft;
      var w = itemWidth();
      var index = Math.round(scrollLeft / w);
      index = Math.max(0, Math.min(items.length - 1, index));
      var total = items.length;
      counter.textContent =
        String(index + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
    }

    if (prev) {
      prev.addEventListener("click", function () {
        track.scrollBy({ left: -itemWidth(), behavior: "smooth" });
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        track.scrollBy({ left: itemWidth(), behavior: "smooth" });
      });
    }
    track.addEventListener("scroll", function () {
      window.requestAnimationFrame(updateCounter);
    }, { passive: true });
    updateCounter();
  });

  /* ---------------- Video-placeholder play buttons ---------------- */
  var playButtons = document.querySelectorAll("[data-video-play]");
  playButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest("[data-video-card]");
      if (card) card.classList.toggle("is-playing");
    });
  });
})();