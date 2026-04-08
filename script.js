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

window.addEventListener("load", initGlobalScrollAnimations);
