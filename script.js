const reviewsSwiper = new Swiper(".reviewsSwiper", {
  loop: true,
  speed: 700,
  centeredSlides: true,
  grabCursor: true,
  watchSlidesProgress: true,
  observer: true,
  observeParents: true,
  navigation: {
    nextEl: ".reviews-nav--next",
    prevEl: ".reviews-nav--prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1.08,
      spaceBetween: 14,
      centeredSlides: true,
    },
    768: {
      slidesPerView: 2.2,
      spaceBetween: 22,
      centeredSlides: true,
    },
    1200: {
      slidesPerView: 3,
      spaceBetween: 28,
      centeredSlides: true,
    },
  },
  on: {
    init: function () {
      this.update();
    },
    resize: function () {
      this.update();
    },
  },
});

let practiceSwiper;

function initPracticeSwiper() {
  const practiceRoot = document.querySelector(".practiceSwiper");
  if (!practiceRoot || typeof Swiper === "undefined") return;

  const paginationEl = practiceRoot.querySelector(".practice-pagination");

  function syncPracticeSwiper() {
    if (window.innerWidth <= 768) {
      if (!practiceSwiper) {
        practiceSwiper = new Swiper(practiceRoot, {
          slidesPerView: 1,
          spaceBetween: 16,
          speed: 650,
          grabCursor: true,
          pagination: {
            el: paginationEl,
            clickable: true,
          },
        });
      } else {
        practiceSwiper.update();
      }

      return;
    }

    if (practiceSwiper) {
      practiceSwiper.destroy(true, true);
      practiceSwiper = null;
    }
  }

  syncPracticeSwiper();
  window.addEventListener("resize", syncPracticeSwiper);
}

function initLanguageTabs() {
  const legacySwitcher = document.querySelector(".top-nav__lang");
  if (!legacySwitcher) return;

  let langSwitcher = legacySwitcher;

  if (legacySwitcher.tagName === "BUTTON") {
    const tabsMarkup = [
      '<button class="lang-item is-active" type="button" role="tab" aria-selected="true" data-lang="en">EN</button>',
      '<button class="lang-item" type="button" role="tab" aria-selected="false" data-lang="de">DE</button>',
    ].join("");

    const nextSwitcher = document.createElement("div");
    nextSwitcher.className = legacySwitcher.className;
    nextSwitcher.setAttribute("role", "tablist");
    nextSwitcher.setAttribute("aria-label", "Language switcher");
    nextSwitcher.innerHTML = tabsMarkup;

    legacySwitcher.replaceWith(nextSwitcher);
    langSwitcher = nextSwitcher;
  }

  const tabs = Array.from(langSwitcher.querySelectorAll(".lang-item[data-lang]"));
  if (!tabs.length) return;

  function setActiveLanguage(nextTab) {
    tabs.forEach((tab) => {
      const isActive = tab === nextTab;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    if (nextTab.dataset.lang) {
      document.documentElement.lang = nextTab.dataset.lang;
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setActiveLanguage(tab));
  });
}

function initResponsiveNav() {
  const nav = document.querySelector(".top-nav");
  if (!nav) return;

  const toggle = nav.querySelector(".top-nav__toggle");
  const menu = nav.querySelector(".top-nav__menu");
  if (!toggle || !menu) return;

  function closeMenu() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  menu.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (nav.classList.contains("is-open") && !nav.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}

function initGlobalScrollAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const isReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (isReducedMotion) return;

  const sectionSelectors = [
    ".about-section",
    ".track-record-section",
    ".practice-section",
    ".working-section",
    ".reviews-section",
    ".contact-section",
    ".site-footer",
  ];

  const sections = gsap.utils.toArray(sectionSelectors.join(", "));

  sections.forEach((section, index) => {
    gsap.set(section, { opacity: 0, y: 56 });

    gsap.to(section, {
      opacity: 1,
      y: 0,
      duration: 0.95,
      ease: "power2.out",
      overwrite: "auto",
      scrollTrigger: {
        trigger: section,
        start: "top 82%",
        end: "top 45%",
        scrub: index === 0 ? 0.35 : 0.5,
      },
    });
  });

  const contentGroups = gsap.utils.toArray(
    [
      ".about-content h2, .about-actions .btn",
      ".track-record__item, .track-record__actions .btn",
      ".practice-card, .practice-actions .btn",
      ".working-card, .working-actions .btn",
      ".review-card",
      ".contact-header, .contact-form",
      ".footer-col",
    ].join(", "),
  );

  contentGroups.forEach((item) => {
    gsap.from(item, {
      opacity: 0,
      y: 24,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
    });
  });

  const heroTitle = document.querySelector(".hero__content h1");
  if (heroTitle) {
    gsap.fromTo(
      heroTitle,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
    );

    gsap.to(heroTitle, {
      y: -36,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
  }

  ScrollTrigger.refresh();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initResponsiveNav();
    initLanguageTabs();
    initPracticeSwiper();
  });
} else {
  initResponsiveNav();
  initLanguageTabs();
  initPracticeSwiper();
}

window.addEventListener("load", initGlobalScrollAnimations);
