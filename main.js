function setupNav() {
  const nav = document.getElementById("siteNav");
  const menu = document.getElementById("mainMenu");
  const toggle = document.querySelector(".navtoggle");

  const onScroll = () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 16);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle("is-open", open);
    toggle.classList.toggle("is-active", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
  };

  toggle.addEventListener("click", () => {
    setOpen(!menu.classList.contains("is-open"));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
}

function setupStatus() {
  const dot = document.getElementById("statusDot");
  const text = document.getElementById("statusText");
  if (!dot || !text) return;

  const hours = {
    0: null,
    1: [600, 1200],
    2: [600, 1200],
    3: [600, 1200],
    4: [600, 1200],
    5: [600, 1200],
    6: [540, 1020]
  };

  const fmt = (minutes) => {
    const h = String(Math.floor(minutes / 60)).padStart(2, "0");
    const m = String(minutes % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  const now = new Date();
  const day = now.getDay();
  const current = now.getHours() * 60 + now.getMinutes();
  const today = hours[day];

  if (today && current >= today[0] && current < today[1]) {
    dot.classList.remove("closed");
    text.textContent = `Otwarte teraz · do ${fmt(today[1])}`;
    return;
  }

  dot.classList.add("closed");

  for (let i = 0; i < 7; i++) {
    const nextDay = (day + i) % 7;
    const range = hours[nextDay];
    if (!range) continue;
    if (i === 0 && current >= range[1]) continue;

    if (i === 0) text.textContent = `Zamknięte · otwieramy o ${fmt(range[0])}`;
    else if (i === 1) text.textContent = `Zamknięte · otwieramy jutro o ${fmt(range[0])}`;
    else text.textContent = `Zamknięte · najbliższe otwarcie: ${fmt(range[0])}`;
    return;
  }

  text.textContent = "Sprawdź najbliższy termin na Booksy";
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  items.forEach((el) => io.observe(el));
}

function setupPriceAccordion() {
  const accordion = document.getElementById("priceAccordion");
  if (!accordion) return;

  const groups = accordion.querySelectorAll("details");
  groups.forEach((group) => {
    group.addEventListener("toggle", () => {
      if (!group.open) return;
      groups.forEach((other) => {
        if (other !== group) other.open = false;
      });
    });
  });
}

function setupCourseFallback() {
  const form = document.getElementById("courseForm");
  const note = document.getElementById("courseNote");
  if (!form) return;

  const formspreePlaceholder = form.getAttribute("action")?.includes("TWOJ_ID");
  if (!formspreePlaceholder) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const get = (id) => document.getElementById(id)?.value.trim() || "";
    const body = encodeURIComponent(
      `Imię: ${get("cf-name")}\nTelefon: ${get("cf-phone")}\nE-mail: ${get("cf-email")}\n\n${get("cf-msg")}`
    );

    window.location.href = `mailto:kontakt@cmabarbershop.pl?subject=${encodeURIComponent("Zapytanie o kurs barberski")}&body=${body}`;
  });

  if (note) {
    note.textContent = "Formularz tymczasowo otwiera wiadomość e-mail. Docelowo podłącz Formspree lub backend, żeby zgłoszenia wysyłały się bezpośrednio ze strony.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupNav();
  setupStatus();
  setupReveal();
  setupPriceAccordion();
  setupCourseFallback();
});
