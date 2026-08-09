/* ==========================================================================
   TARA. — Shared site script
   Loaded on every page. Handles: sticky/glass header on scroll, mobile nav
   drawer + submenus, desktop dropdown keyboard support, and scroll-triggered
   reveal animations for elements with the .reveal class.
   ========================================================================== */
(function () {
  'use strict';

  // Swap the no-js fallback class as soon as JS is confirmed running.
  document.documentElement.classList.remove('no-js');

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Sticky header — add .is-scrolled once the page scrolls past a
     small threshold so the glass background/tint kicks in.
     ------------------------------------------------------------------ */
  var header = document.getElementById('siteHeader');
  if (header) {
    var SCROLL_THRESHOLD = 12;
    var ticking = false;

    var updateHeaderState = function () {
      if (window.scrollY > SCROLL_THRESHOLD) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
      ticking = false;
    };

    var onScroll = function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderState);
        ticking = true;
      }
    };

    updateHeaderState();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------
     Mobile nav drawer (hamburger <-> X, slide-in panel, scrim)
     FIX: aria-label now reflects actual open/closed state, not just
     aria-expanded — screen readers previously always heard "Open menu".
     ------------------------------------------------------------------ */
  var menuToggle = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('mobileNav');
  var mobileNavScrim = document.getElementById('mobileNavScrim');
  var body = document.body;

  var openMobileNav = function () {
    if (!mobileNav) return;
    mobileNav.classList.add('is-open');
    mobileNav.setAttribute('aria-hidden', 'false');
    if (mobileNavScrim) mobileNavScrim.classList.add('is-visible');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Close menu');
    }
    body.classList.add('nav-open');
  };

  var closeMobileNav = function () {
    if (!mobileNav) return;
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
    if (mobileNavScrim) mobileNavScrim.classList.remove('is-visible');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
    }
    body.classList.remove('nav-open');
  };

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.contains('is-open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileNavScrim) {
    mobileNavScrim.addEventListener('click', closeMobileNav);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('is-open')) {
      closeMobileNav();
      if (menuToggle) menuToggle.focus();
    }
  });

  // Close the drawer whenever a real navigation link inside it is followed.
  if (mobileNav) {
    var mobileLinks = mobileNav.querySelectorAll('.mobile-nav_link, .mobile-nav_submenu-link');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* ------------------------------------------------------------------
     Mobile submenu accordions (About Philippines / Attractions)
     ------------------------------------------------------------------ */
  var submenuToggles = document.querySelectorAll('.mobile-nav_submenu-toggle');
  submenuToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var item = toggle.closest('.mobile-nav_item');
      if (!item) return;
      var isOpen = item.classList.contains('is-open');

      // Close any other open submenu for a clean accordion feel.
      submenuToggles.forEach(function (otherToggle) {
        var otherItem = otherToggle.closest('.mobile-nav_item');
        if (otherItem && otherItem !== item) {
          otherItem.classList.remove('is-open');
          otherToggle.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('is-open', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ------------------------------------------------------------------
     Desktop dropdown nav — CSS handles hover/focus-within, this just
     keeps aria-expanded accurate for assistive tech and supports tap
     on touch-capable desktops (first tap opens, second tap follows link).

     FIX 1: focusout previously trusted e.relatedTarget, which is null
     in several real browser cases (clicking outside the window, some
     touch/hybrid interactions) — that left the dropdown stuck open
     with aria-expanded="true" forever. Now falls back to checking
     document.activeElement on a microtask delay.

     FIX 2: Escape now closes an open desktop dropdown (previously only
     the mobile drawer responded to Escape).
     ------------------------------------------------------------------ */
  var dropdownItems = document.querySelectorAll('.nav-item--has-dropdown');
  dropdownItems.forEach(function (item) {
    var trigger = item.querySelector(':scope > .primary-nav_link');
    if (!trigger) return;

    var setExpanded = function (expanded) {
      trigger.setAttribute('aria-expanded', String(expanded));
    };

    item.addEventListener('mouseenter', function () { setExpanded(true); });
    item.addEventListener('mouseleave', function () { setExpanded(false); });
    item.addEventListener('focusin', function () { setExpanded(true); });

    item.addEventListener('focusout', function (e) {
      if (e.relatedTarget) {
        if (!item.contains(e.relatedTarget)) setExpanded(false);
        return;
      }
      // relatedTarget was null — verify against activeElement instead
      // of assuming focus left the item.
      window.setTimeout(function () {
        if (!item.contains(document.activeElement)) setExpanded(false);
      }, 0);
    });

    item.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
        setExpanded(false);
        trigger.focus();
      }
    });
  });

  /* ------------------------------------------------------------------
     Scroll reveal — IntersectionObserver adds .is-visible to any
     .reveal element as it enters the viewport, then stops watching it.
     ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else if (revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------------------------
     Hero scroll cue — hide once the user has scrolled past the hero.
     ------------------------------------------------------------------ */
  var scrollCues = document.querySelectorAll('.about_hero-scroll, .hero-scroll');
  if (scrollCues.length) {
    var onCueScroll = function () {
      var hidden = window.scrollY > 80;
      scrollCues.forEach(function (cue) {
        cue.style.opacity = hidden ? '0' : '1';
        cue.style.pointerEvents = hidden ? 'none' : 'auto';
      });
    };
    window.addEventListener('scroll', onCueScroll, { passive: true });
  }
})();