(function () {
  "use strict";

  /* ----------------------------------------------------------------
     Sticky header — add is-scrolled state
  ---------------------------------------------------------------- */
  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ----------------------------------------------------------------
     Mobile nav drawer
  ---------------------------------------------------------------- */
  var menuToggle = document.getElementById("menuToggle");
  var mobileNav = document.getElementById("mobileNav");
  var mobileNavScrim = document.getElementById("mobileNavScrim");

  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove("is-open");
    mobileNav.setAttribute("aria-hidden", "true");
    if (mobileNavScrim) mobileNavScrim.classList.remove("is-visible");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }
  function openMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.add("is-open");
    mobileNav.setAttribute("aria-hidden", "false");
    if (mobileNavScrim) mobileNavScrim.classList.add("is-visible");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  }
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.contains("is-open");
      isOpen ? closeMobileNav() : openMobileNav();
    });
  }
  if (mobileNavScrim) mobileNavScrim.addEventListener("click", closeMobileNav);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMobileNav();
  });
  /* keep the drawer from getting stuck open if the viewport grows past the mobile breakpoint */
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) closeMobileNav();
  });

  /* ----------------------------------------------------------------
     Mobile submenus (About Philippines, Attractions)
     Each toggle button references its panel via aria-controls.
  ---------------------------------------------------------------- */
  var submenuToggles = document.querySelectorAll(".mobile-nav_submenu-toggle");
  submenuToggles.forEach(function (btn) {
    var panelId = btn.getAttribute("aria-controls");
    var panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;
    btn.addEventListener("click", function () {
      var isOpen = panel.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  /* ----------------------------------------------------------------
     Desktop dropdowns (About Philippines, Attractions)
     Hover opens them (handled in CSS). This adds click/keyboard
     support: the first activation opens the panel instead of
     navigating away; a second activation (or Enter again) follows
     the link, since the trigger is a real, working page link.
  ---------------------------------------------------------------- */
  var dropdownItems = document.querySelectorAll(".nav-item--has-dropdown");
  dropdownItems.forEach(function (item) {
    var trigger = item.querySelector(":scope > .primary-nav_link");
    var dropdown = item.querySelector(":scope > [data-dropdown]");
    if (!trigger || !dropdown) return;

    trigger.addEventListener("click", function (e) {
      var isDesktop = window.innerWidth > 900;
      var isOpen = item.classList.contains("is-open");
      if (isDesktop && !isOpen) {
        e.preventDefault();
        dropdownItems.forEach(function (other) {
          other.classList.remove("is-open");
          var otherTrigger = other.querySelector(":scope > .primary-nav_link");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        });
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", function (e) {
    dropdownItems.forEach(function (item) {
      if (!item.contains(e.target)) {
        item.classList.remove("is-open");
        var trigger = item.querySelector(":scope > .primary-nav_link");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      }
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      dropdownItems.forEach(function (item) {
        item.classList.remove("is-open");
        var trigger = item.querySelector(":scope > .primary-nav_link");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      });
    }
  });

  /* ----------------------------------------------------------------
     Scroll reveal — fade + rise for elements with .reveal
  ---------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ----------------------------------------------------------------
     05 — Festival carousel controls + counter
  ---------------------------------------------------------------- */
  var festTrack = document.getElementById("festTrack");
  var festPrev = document.getElementById("festPrev");
  var festNext = document.getElementById("festNext");
  var festCurrent = document.getElementById("festCurrent");

  if (festTrack && festCurrent) {
    var festCards = Array.prototype.slice.call(festTrack.children);

    function festStep() {
      var card = festCards[0];
      return card ? card.getBoundingClientRect().width + 22 : 380;
    }
    function scrollByCards(dir) {
      festTrack.scrollBy({ left: dir * festStep(), behavior: "smooth" });
    }
    if (festPrev) festPrev.addEventListener("click", function () { scrollByCards(-1); });
    if (festNext) festNext.addEventListener("click", function () { scrollByCards(1); });

    function updateFestCounter() {
      var trackLeft = festTrack.getBoundingClientRect().left;
      var closestIdx = 0;
      var closestDist = Infinity;
      festCards.forEach(function (card, i) {
        var dist = Math.abs(card.getBoundingClientRect().left - trackLeft);
        if (dist < closestDist) { closestDist = dist; closestIdx = i; }
      });
      festCurrent.textContent = String(closestIdx + 1).padStart(2, "0");
    }
    var festTicking = false;
    festTrack.addEventListener("scroll", function () {
      if (!festTicking) {
        window.requestAnimationFrame(function () { updateFestCounter(); festTicking = false; });
        festTicking = true;
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------------
     10 — Regional culture map interaction
  ---------------------------------------------------------------- */
  var regionData = {
    luzon: {
      label: "Luzon",
      items: ["Highlands", "Lowlands", "Indigenous communities", "Colonial heritage"]
    },
    visayas: {
      label: "Visayas",
      items: ["Festivals", "Maritime traditions", "Visayan languages", "Island hospitality"]
    },
    mindanao: {
      label: "Mindanao",
      items: ["Indigenous cultures", "Islamic heritage", "Diverse communities", "Ancestral domains"]
    }
  };

  var mapLegend = document.getElementById("mapLegend");
  var mapPanelEyebrow = document.getElementById("mapPanelEyebrow");
  var mapPanelList = document.getElementById("mapPanelList");
  var landmasses = document.querySelectorAll(".map-landmass");

  function setRegion(region) {
    var data = regionData[region];
    if (!data) return;

    if (mapPanelEyebrow) mapPanelEyebrow.textContent = data.label;
    if (mapPanelList) {
      mapPanelList.innerHTML = "";
      data.items.forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        mapPanelList.appendChild(li);
      });
    }
    var cta = document.querySelector(".map-panel_cta");
    if (cta) cta.firstChild.textContent = "Explore " + data.label + " ";

    if (mapLegend) {
      mapLegend.querySelectorAll(".map-legend_item").forEach(function (btn) {
        btn.classList.toggle("is-active", btn.dataset.region === region);
      });
    }
    landmasses.forEach(function (path) {
      path.classList.toggle("is-active", path.dataset.region === region);
    });
  }

  if (mapLegend) {
    mapLegend.addEventListener("click", function (e) {
      var btn = e.target.closest(".map-legend_item");
      if (btn) setRegion(btn.dataset.region);
    });
  }
  landmasses.forEach(function (path) {
    path.addEventListener("click", function () { setRegion(path.dataset.region); });
  });

  /* set initial active state to match the default markup (Luzon) */
  setRegion("luzon");
})();