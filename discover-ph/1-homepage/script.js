(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     Sticky header — add a "scrolled" state once the page moves
  --------------------------------------------------------------------- */
  var header = document.getElementById("siteHeader");
  var SCROLL_THRESHOLD = 24;

  function updateHeaderState() {
    if (!header) return;
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  if (header) {
    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Mobile hamburger menu
  --------------------------------------------------------------------- */
  var menuToggle = document.getElementById("menuToggle");
  var mobileNav = document.getElementById("mobileNav");
  var scrim = document.getElementById("mobileNavScrim");

  if (menuToggle && mobileNav && scrim) {
    var mobileLinks = mobileNav.querySelectorAll(".mobile-nav_link");

    var openMenu = function () {
      mobileNav.classList.add("is-open");
      scrim.classList.add("is-visible");
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Close menu");
      mobileNav.setAttribute("aria-hidden", "false");
      document.body.classList.add("nav-open");
    };
    var closeMenu = function () {
      mobileNav.classList.remove("is-open");
      scrim.classList.remove("is-visible");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
      mobileNav.setAttribute("aria-hidden", "true");
      document.body.classList.remove("nav-open");
    };
    var toggleMenu = function () {
      if (mobileNav.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    menuToggle.addEventListener("click", toggleMenu);
    scrim.addEventListener("click", closeMenu);
    mobileLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
        closeMenu();
        menuToggle.focus();
      }
    });

    var mq = window.matchMedia("(min-width: 901px)");
    var handleBreakpointChange = function (e) {
      if (e.matches) closeMenu();
    };
    if (mq.addEventListener) {
      mq.addEventListener("change", handleBreakpointChange);
    } else if (mq.addListener) {
      mq.addListener(handleBreakpointChange);
    }
  }

  /* ---------------------------------------------------------------------
     Desktop dropdown navigation (About Philippines, Attractions)
     - opens on hover (CSS handles this by default)
     - opens on keyboard focus and stays open while focus is inside
     - Escape closes the open dropdown and returns focus to its trigger
     - parent link still navigates normally on click
  --------------------------------------------------------------------- */
  var dropdownItems = document.querySelectorAll(".nav-item--has-dropdown");

  if (dropdownItems.length) {
    var closeDropdown = function (item) {
      item.classList.remove("is-open");
      var trigger = item.querySelector(".primary-nav_link");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    };
    var openDropdown = function (item) {
      item.classList.add("is-open");
      var trigger = item.querySelector(".primary-nav_link");
      if (trigger) trigger.setAttribute("aria-expanded", "true");
    };
    var closeAllDropdowns = function (except) {
      dropdownItems.forEach(function (item) {
        if (item !== except) closeDropdown(item);
      });
    };

    dropdownItems.forEach(function (item) {
      var trigger = item.querySelector(".primary-nav_link");
      var dropdown = item.querySelector(".primary-nav_dropdown");

      // Hover: open, and keep open while pointer is over trigger or panel.
      item.addEventListener("mouseenter", function () {
        closeAllDropdowns(item);
        openDropdown(item);
      });
      item.addEventListener("mouseleave", function () {
        closeDropdown(item);
      });

      // Keyboard: focusing the trigger or any link inside opens it;
      // focus leaving the whole item closes it.
      item.addEventListener("focusin", function () {
        closeAllDropdowns(item);
        openDropdown(item);
      });
      item.addEventListener("focusout", function (e) {
        if (!item.contains(e.relatedTarget)) {
          closeDropdown(item);
        }
      });

      // Escape closes the dropdown and returns focus to the parent link.
      item.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && item.classList.contains("is-open")) {
          closeDropdown(item);
          if (trigger) trigger.focus();
        }
      });

      if (trigger && dropdown) {
        // no-op: parent link keeps its normal href/navigation behavior
      }
    });

    document.addEventListener("click", function (e) {
      dropdownItems.forEach(function (item) {
        if (!item.contains(e.target)) closeDropdown(item);
      });
    });
  }

  /* ---------------------------------------------------------------------
     Mobile submenu toggles (About Philippines, Attractions)
     - the "+" / chevron button expands/collapses the submenu
     - clicking the parent link text still navigates normally
  --------------------------------------------------------------------- */
  var mobileSubmenuToggles = document.querySelectorAll(".mobile-nav_submenu-toggle");

  mobileSubmenuToggles.forEach(function (toggle) {
    var submenu = document.getElementById(toggle.getAttribute("aria-controls"));
    if (!submenu) return;

    toggle.addEventListener("click", function () {
      var isOpen = submenu.classList.contains("is-open");
      if (isOpen) {
        submenu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      } else {
        submenu.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------------------------------------------------------------------
     Active navigation — determined by the current page URL, not scroll
     position. Pages now live in their own folders (e.g. ../3-attraction-
     page/attraction.html), so hrefs are no longer bare filenames. We
     compare the *basename* of each nav link's href against the current
     page's basename, so the active state still resolves correctly no
     matter which folder a link points into. The "About Philippines" and
     "Attractions" parents also stay active for their child pages.
  --------------------------------------------------------------------- */
  function getBasename(pathOrHref) {
    var clean = (pathOrHref || "").split("#")[0].split("?")[0];
    var parts = clean.split("/");
    var base = parts[parts.length - 1];
    return base === "" ? "home.html" : base;
  }

  function setCurrentPageNav() {
    var navLinks = document.querySelectorAll(".primary-nav_link, .mobile-nav_link");
    if (!navLinks.length) return;

    var currentPage = getBasename(window.location.pathname);

    var aboutGroup = ["about.html", "history.html", "culture.html", "food.html", "people.html", "geography.html"];
    var attractionsGroup = ["attraction.html"];

    navLinks.forEach(function (link) {
      var href = getBasename(link.getAttribute("href") || "");
      var isMatch = href === currentPage;

      if (href === "about.html" && aboutGroup.indexOf(currentPage) !== -1) {
        isMatch = true;
      }
      if (href === "attraction.html" && attractionsGroup.indexOf(currentPage) !== -1) {
        isMatch = true;
      }

      link.classList.toggle("is-active", isMatch);
    });
  }
  setCurrentPageNav();

  /* ---------------------------------------------------------------------
     Scroll-reveal — fade + rise elements into view once
  --------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var revealObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );
      revealEls.forEach(function (el, i) {
        el.style.transitionDelay = (i % 4) * 60 + "ms";
        revealObserver.observe(el);
      });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }
  }

  /* ---------------------------------------------------------------------
     Featured Attractions — horizontal carousel controls (homepage only)
  --------------------------------------------------------------------- */
  var featuredTrack = document.getElementById("featuredTrack");
  var featuredPrev = document.getElementById("featuredPrev");
  var featuredNext = document.getElementById("featuredNext");

  if (featuredTrack && featuredPrev && featuredNext) {
    var scrollFeatured = function (direction) {
      var card = featuredTrack.querySelector(".featured-card");
      var step = card ? card.getBoundingClientRect().width + 26 : 320;
      featuredTrack.scrollBy({ left: direction * step, behavior: "smooth" });
    };
    featuredPrev.addEventListener("click", function () { scrollFeatured(-1); });
    featuredNext.addEventListener("click", function () { scrollFeatured(1); });
  }

  /* ---------------------------------------------------------------------
     Interactive Philippines map — region select drives the side panel
     (homepage only)
  --------------------------------------------------------------------- */
  var regionData = {
    luzon: { label: "Luzon", places: ["Sagada", "Banaue", "Palawan"] },
    visayas: { label: "Visayas", places: ["Cebu", "Bohol", "Siargao"] },
    mindanao: { label: "Mindanao", places: ["Davao", "Camiguin", "Surigao"] }
  };

  var landmasses = document.querySelectorAll(".map-landmass");
  var legendButtons = document.querySelectorAll("[data-region-btn]");
  var panelRegion = document.getElementById("mapPanelRegion");
  var panelList = document.getElementById("mapPanelList");

  if (landmasses.length || legendButtons.length) {
    var setActiveRegion = function (regionKey) {
      var data = regionData[regionKey];
      if (!data) return;

      landmasses.forEach(function (shape) {
        shape.classList.toggle("is-active", shape.getAttribute("data-region") === regionKey);
      });
      legendButtons.forEach(function (btn) {
        btn.classList.toggle("is-active", btn.getAttribute("data-region-btn") === regionKey);
      });

      if (panelRegion) panelRegion.textContent = data.label;
      if (panelList) {
        panelList.innerHTML = "";
        data.places.forEach(function (place) {
          var li = document.createElement("li");
          li.textContent = place;
          panelList.appendChild(li);
        });
      }
    };

    landmasses.forEach(function (shape) {
      shape.addEventListener("click", function () {
        setActiveRegion(shape.getAttribute("data-region"));
      });
    });
    legendButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        setActiveRegion(btn.getAttribute("data-region-btn"));
      });
    });
  }

  /* ---------------------------------------------------------------------
     Attractions page — category filter + region/province/type filters
     (attraction.html only; guarded by element presence)
  --------------------------------------------------------------------- */
  var attractionsGrid = document.getElementById("attractionsGrid");
  if (attractionsGrid) {
    var attractionCards = attractionsGrid.querySelectorAll(".entry-card");
    var pills = document.querySelectorAll("[data-filter-category]");
    var regionSelect = document.getElementById("filterRegion");
    var typeSelect = document.getElementById("filterType");
    var resultsCount = document.getElementById("attractionsCount");
    var resultsEmpty = document.getElementById("attractionsEmpty");
    var activeCategory = "all";

    function applyAttractionFilters() {
      var region = regionSelect ? regionSelect.value : "all";
      var type = typeSelect ? typeSelect.value : "all";
      var visibleCount = 0;

      attractionCards.forEach(function (card) {
        var cardCategory = card.getAttribute("data-category") || "";
        var cardRegion = card.getAttribute("data-region") || "";
        var cardType = card.getAttribute("data-type") || "";

        var matches =
          (activeCategory === "all" || cardCategory === activeCategory) &&
          (region === "all" || cardRegion === region) &&
          (type === "all" || cardType === type);

        card.style.display = matches ? "" : "none";
        if (matches) visibleCount++;
      });

      if (resultsCount) {
        resultsCount.textContent = visibleCount + (visibleCount === 1 ? " attraction found" : " attractions found");
      }
      if (resultsEmpty) {
        resultsEmpty.classList.toggle("is-visible", visibleCount === 0);
      }
    }

    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        pills.forEach(function (p) { p.classList.remove("is-active"); });
        pill.classList.add("is-active");
        activeCategory = pill.getAttribute("data-filter-category");
        applyAttractionFilters();
      });
    });
    if (regionSelect) regionSelect.addEventListener("change", applyAttractionFilters);
    if (typeSelect) typeSelect.addEventListener("change", applyAttractionFilters);

    applyAttractionFilters();
  }

  /* ---------------------------------------------------------------------
     Directory page — search + category filter
     (directory.html only; guarded by element presence)
  --------------------------------------------------------------------- */
  var directoryGrid = document.getElementById("directoryGrid");
  if (directoryGrid) {
    var directoryCards = directoryGrid.querySelectorAll(".entry-card");
    var directoryPills = document.querySelectorAll("[data-directory-category]");
    var directorySearch = document.getElementById("directorySearch");
    var directoryLocation = document.getElementById("directoryLocation");
    var directoryCount = document.getElementById("directoryCount");
    var directoryEmpty = document.getElementById("directoryEmpty");
    var activeDirectoryCategory = "all";

    function applyDirectoryFilters() {
      var query = directorySearch ? directorySearch.value.trim().toLowerCase() : "";
      var location = directoryLocation ? directoryLocation.value : "all";
      var visibleCount = 0;

      directoryCards.forEach(function (card) {
        var category = card.getAttribute("data-category") || "";
        var cardLocation = card.getAttribute("data-location") || "";
        var name = (card.getAttribute("data-name") || "").toLowerCase();

        var matches =
          (activeDirectoryCategory === "all" || category === activeDirectoryCategory) &&
          (location === "all" || cardLocation === location) &&
          (query === "" || name.indexOf(query) !== -1);

        card.style.display = matches ? "" : "none";
        if (matches) visibleCount++;
      });

      if (directoryCount) {
        directoryCount.textContent = visibleCount + (visibleCount === 1 ? " listing found" : " listings found");
      }
      if (directoryEmpty) {
        directoryEmpty.classList.toggle("is-visible", visibleCount === 0);
      }
    }

    directoryPills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        directoryPills.forEach(function (p) { p.classList.remove("is-active"); });
        pill.classList.add("is-active");
        activeDirectoryCategory = pill.getAttribute("data-directory-category");
        applyDirectoryFilters();
      });
    });
    if (directorySearch) directorySearch.addEventListener("input", applyDirectoryFilters);
    if (directoryLocation) directoryLocation.addEventListener("change", applyDirectoryFilters);

    applyDirectoryFilters();
  }

  /* ---------------------------------------------------------------------
     News page — category filter
     (news.html only; guarded by element presence)
  --------------------------------------------------------------------- */
  var articleGrid = document.getElementById("articleGrid");
  if (articleGrid) {
    var articleCards = articleGrid.querySelectorAll(".article-card");
    var newsPills = document.querySelectorAll("[data-news-category]");
    var activeNewsCategory = "all";

    newsPills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        newsPills.forEach(function (p) { p.classList.remove("is-active"); });
        pill.classList.add("is-active");
        activeNewsCategory = pill.getAttribute("data-news-category");

        articleCards.forEach(function (card) {
          var category = card.getAttribute("data-category") || "";
          var matches = activeNewsCategory === "all" || category === activeNewsCategory;
          card.style.display = matches ? "" : "none";
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
     Contact page — client-side validation + success state
     (contact.html only; guarded by element presence)
  --------------------------------------------------------------------- */
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
})();
