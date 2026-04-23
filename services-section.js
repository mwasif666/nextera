const cards = document.querySelectorAll(".card");
const serviceLinks = document.querySelectorAll(".service-link");
const cardsSection = document.getElementById("cards");
const desktopStackQuery = window.matchMedia("(min-width: 961px)");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateCards() {
  if (!desktopStackQuery.matches) {
    cards.forEach((card) => {
      card.style.transform = "none";
      card.style.filter = "none";
    });
    return;
  }

  const viewportHeight = window.innerHeight;

  cards.forEach((card, index) => {
    if (index === cards.length - 1) {
      card.style.transform = "scale(1)";
      card.style.filter = "brightness(1)";
      return;
    }

    const nextCard = cards[index + 1];
    const nextRect = nextCard.getBoundingClientRect();

    const start = viewportHeight * 0.82;
    const end = viewportHeight * 0.16;

    const progress = clamp((start - nextRect.top) / (start - end), 0, 1);

    const targetScale = 1 - (cards.length - 1 - index) * 0.045;
    const currentScale = 1 - (1 - targetScale) * progress;
    const brightness = 1 - progress * 0.12;
    const yShift = progress * -8;
    const xShift = progress * 6;

    card.style.transform = `translate(${xShift}px, ${yShift}px) scale(${currentScale})`;
    card.style.filter = `brightness(${brightness})`;
  });
}

function updateActiveNav() {
  if (!cardsSection || cards.length === 0) return;

  if (!desktopStackQuery.matches) {
    let activeIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.top - 80);
      if (rect.top <= window.innerHeight * 0.45 && distance < closestDistance) {
        closestDistance = distance;
        activeIndex = index;
      }
    });

    serviceLinks.forEach((link, index) => {
      link.classList.toggle("active", index === activeIndex);
    });
    return;
  }

  const sectionRect = cardsSection.getBoundingClientRect();
  const totalScrollable = Math.max(
    cardsSection.offsetHeight - window.innerHeight * 0.55,
    1,
  );
  const rawProgress = (-sectionRect.top + window.innerHeight * 0.18) / totalScrollable;
  const progress = clamp(rawProgress, 0, 1);
  const activeIndex = Math.round(progress * (cards.length - 1));

  serviceLinks.forEach((link, index) => {
    link.classList.toggle("active", index === activeIndex);
  });
}

function onScroll() {
  updateCards();
  updateActiveNav();
}

serviceLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const targetId = link.getAttribute("data-target");
    const target = document.getElementById(targetId);

    if (target) {
      const topOffset =
        target.getBoundingClientRect().top + window.scrollY - 20;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  });
});

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
window.addEventListener("load", onScroll);

onScroll();
