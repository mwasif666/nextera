(function () {
  const cardsContainer = document.querySelector(".services-cards");
  const cards = Array.from(document.querySelectorAll(".service-card"));
  const navItems = Array.from(document.querySelectorAll(".services-nav li"));
  const navLinks = Array.from(document.querySelectorAll(".services-nav a"));

  if (!cardsContainer || !cards.length) return;

  function setActive(index) {
    navItems.forEach((item, i) => {
      item.classList.toggle("active", i === index);
    });
  }

  function setupCards() {
    if (window.innerWidth <= 1200) {
      cardsContainer.style.setProperty("--cards-count", cards.length);
      cardsContainer.style.setProperty("--card-height", "auto");

      cards.forEach((card) => {
        card.style.paddingTop = "0px";
        const inner = card.querySelector(".service-card__inner");
        inner.style.transform = "none";
        inner.style.filter = "none";
      });

      return;
    }

    const firstInner = cards[0].querySelector(".service-card__inner");
    const cardHeight = firstInner.offsetHeight;

    cardsContainer.style.setProperty("--cards-count", cards.length);
    cardsContainer.style.setProperty("--card-height", `${cardHeight}px`);

    cards.forEach((card, index) => {
      const offsetTop = 18 + index * 18;
      card.style.paddingTop = `${offsetTop}px`;
    });
  }

  function updateCards() {
    if (window.innerWidth <= 1200) return;

    cards.forEach((card, index) => {
      const inner = card.querySelector(".service-card__inner");

      if (index === cards.length - 1) {
        inner.style.transform = "scale(1)";
        inner.style.filter = "brightness(1)";
        return;
      }

      const nextCard = cards[index + 1];
      const nextRect = nextCard.getBoundingClientRect();
      const cardHeight = inner.offsetHeight;
      const start = window.innerHeight - cardHeight;
      const end = 90;
      let progress = 0;

      if (start !== end) {
        progress = (start - nextRect.top) / (start - end);
      }

      progress = Math.max(0, Math.min(1, progress));

      const toScale = 1 - (cards.length - 1 - index) * 0.06;
      const scale = 1 - (1 - toScale) * progress;
      const brightness = 1 - 0.22 * progress;

      inner.style.transform = `scale(${scale})`;
      inner.style.filter = `brightness(${brightness})`;
    });

    let activeIndex = cards.length - 1;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.35) {
        activeIndex = index;
      }
    });

    setActive(activeIndex);
  }

  function onScroll() {
    requestAnimationFrame(updateCards);
  }

  function handleNavClick() {
    navLinks.forEach((link, index) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        const target = document.querySelector(targetId);
        if (!target) return;

        const y = target.getBoundingClientRect().top + window.pageYOffset - 30;
        window.scrollTo({
          top: y,
          behavior: "smooth",
        });

        setTimeout(() => setActive(index), 150);
      });
    });
  }

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setupCards();
      updateCards();
    }, 120);
  });

  window.addEventListener("scroll", onScroll, { passive: true });

  setupCards();
  updateCards();
  handleNavClick();
})();
