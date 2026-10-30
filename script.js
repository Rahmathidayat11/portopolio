// =========================================
// Rahmat Hidayat — Portfolio interactions
// =========================================

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const links = navLinks.querySelectorAll("a");
  const sections = document.querySelectorAll("section[id]");
  const revealItems = document.querySelectorAll(".reveal");

  // ---- Navbar background on scroll ----
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
    highlightActiveSection();
  };

  // ---- Active nav link based on scroll position ----
  const highlightActiveSection = () => {
    const pos = window.scrollY + 120;
    let current = "";

    sections.forEach((section) => {
      if (pos >= section.offsetTop) current = section.id;
    });

    links.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`
      );
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Mobile menu ----
  const closeMenu = () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });

  links.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target)) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });

  // ---- Scroll reveal with stagger ----
  revealItems.forEach((item) => {
    const parent = item.parentElement;
    const siblings = parent
      ? Array.from(parent.children).filter((child) =>
          child.classList.contains("reveal")
        )
      : [];
    const index = siblings.indexOf(item);
    if (index > 0) item.style.setProperty("--delay", `${index * 90}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));

  // ---- Typing effect for hero role ----
  const roles = [
    "Software Engineer",
    "Machine Learning Enthusiast",
    "Cloud Technology Learner",
  ];
  const roleEl = document.getElementById("typedRole");
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const typeLoop = () => {
    const current = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    roleEl.textContent = current.slice(0, charIndex);

    let delay = deleting ? 40 : 75;

    if (!deleting && charIndex === current.length) {
      deleting = true;
      delay = 1800;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 350;
    }

    setTimeout(typeLoop, delay);
  };

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (roleEl && !prefersReducedMotion) {
    setTimeout(typeLoop, 800);
  }

  // ---- Animated stat counters ----
  const statsEl = document.querySelector(".stats");
  const statValues = document.querySelectorAll(".stat strong");

  const animateStat = (el) => {
    const match = el.textContent.trim().match(/^([\d.]+)(.*)$/);
    if (!match) return;

    const target = parseFloat(match[1]);
    const suffix = match[2];
    const decimals = (match[1].split(".")[1] || "").length;
    const duration = 1300;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (statsEl && !prefersReducedMotion) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            statValues.forEach(animateStat);
            statsObserver.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    statsObserver.observe(statsEl);
  }

  // ---- Project detail modals ----
  const modals = document.querySelectorAll(".modal");
  let lastFocused = null;

  const openModal = (modal) => {
    lastFocused = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    const closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = (modal) => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (lastFocused) lastFocused.focus();
  };

  document.querySelectorAll("[data-modal]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const modal = document.getElementById(trigger.dataset.modal);
      if (modal) openModal(modal);
    });
  });

  modals.forEach((modal) => {
    modal.querySelectorAll("[data-close]").forEach((el) => {
      el.addEventListener("click", () => closeModal(modal));
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const openModalEl = document.querySelector(".modal.open");
      if (openModalEl) closeModal(openModalEl);
    }
  });

  // ---- Footer year ----
  document.getElementById("year").textContent = new Date().getFullYear();
});
