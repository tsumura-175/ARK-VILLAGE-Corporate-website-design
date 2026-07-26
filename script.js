document.documentElement.classList.add("js");

(() => {
  const root = document.documentElement;
  if (!root.classList.contains("is-github-pages")) return;

  const gate = document.querySelector("[data-access-gate]");
  const form = document.querySelector("[data-access-form]");
  const idInput = document.querySelector("[data-access-id]");
  const passwordInput = document.querySelector("[data-access-password]");
  const error = document.querySelector("[data-access-error]");

  if (!root.classList.contains("is-access-locked")) {
    gate?.setAttribute("aria-hidden", "true");
    return;
  }

  if (!gate || !form || !idInput || !passwordInput || !error) return;

  gate.setAttribute("aria-hidden", "false");

  const clearError = () => {
    form.classList.remove("is-error");
    error.textContent = "";
  };

  const unlock = () => {
    try {
      sessionStorage.setItem("ark-preview-access", "granted");
    } catch {
      // The current page still unlocks when storage is unavailable.
    }

    clearError();
    form.reset();
    gate.setAttribute("aria-hidden", "true");
    root.classList.remove("is-access-locked");
    window.dispatchEvent(new CustomEvent("ark:access-granted"));
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const idIsValid = idInput.value.trim() === "test";
    const passwordIsValid = passwordInput.value === "test";

    if (idIsValid && passwordIsValid) {
      unlock();
      return;
    }

    form.classList.add("is-error");
    error.textContent = "IDまたはパスワードが正しくありません。";
    passwordInput.select();
  });

  idInput.addEventListener("input", clearError);
  passwordInput.addEventListener("input", clearError);

  requestAnimationFrame(() => idInput.focus({ preventScroll: true }));
})();

(() => {
  const root = document.documentElement;
  const loader = document.querySelector("[data-site-loader]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const readDuration = (token, fallback) => {
    const value = getComputedStyle(root).getPropertyValue(token).trim();
    if (!value) return fallback;
    if (value.endsWith("ms")) return Number.parseFloat(value);
    if (value.endsWith("s")) return Number.parseFloat(value) * 1000;
    return fallback;
  };

  const announceReady = () => {
    root.classList.add("page-ready");
    root.classList.remove("is-loading", "loader-started");
    window.dispatchEvent(new CustomEvent("ark:page-ready"));
  };

  let started = false;

  const startLoader = () => {
    if (started) return;
    started = true;

    if (!loader) {
      announceReady();
      return;
    }

    root.classList.add("is-loading");
    loader.hidden = false;
    loader.classList.remove("is-leaving");

    let hasSeenLoader = false;
    try {
      hasSeenLoader = sessionStorage.getItem("ark-loader-seen") === "true";
    } catch {
      hasSeenLoader = false;
    }

    if (reducedMotion.matches || hasSeenLoader) {
      loader.hidden = true;
      announceReady();
      return;
    }

    const loaderDuration = readDuration("--dur-loader", 1800);
    const exitDuration = readDuration("--dur-loader-exit", 520);
    const startedAt = performance.now();
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;

      try {
        sessionStorage.setItem("ark-loader-seen", "true");
      } catch {
        // Storage can be unavailable in privacy-restricted contexts.
      }

      loader.classList.add("is-leaving");
      announceReady();

      window.setTimeout(() => {
        loader.hidden = true;
      }, exitDuration);
    };

    const finishAfterMinimum = () => {
      const remaining = Math.max(
        0,
        loaderDuration - (performance.now() - startedAt),
      );
      window.setTimeout(finish, remaining);
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.add("loader-started"));
    });

    if (document.readyState === "complete") {
      finishAfterMinimum();
    } else {
      window.addEventListener("load", finishAfterMinimum, { once: true });
    }

    window.setTimeout(finish, loaderDuration + 3000);
  };

  if (root.classList.contains("is-access-locked")) {
    if (loader) loader.hidden = true;
    window.addEventListener("ark:access-granted", startLoader, { once: true });
    return;
  }

  startLoader();
})();

(() => {
  const header = document.querySelector("[data-site-header]");
  if (!header) return;

  const morphDistance = 120;
  let ticking = false;

  const updateHeader = () => {
    const scrollPosition = Math.max(
      window.scrollY,
      document.documentElement.scrollTop,
    );
    const progress = Math.min(1, Math.max(0, scrollPosition / morphDistance));
    const offset = progress * 8;
    const panelScale = 0.985 + progress * 0.015;

    header.style.setProperty("--header-progress", progress.toFixed(4));
    header.style.setProperty(
      "--header-wash-opacity",
      (1 - progress).toFixed(4),
    );
    header.style.setProperty("--header-offset", `${offset.toFixed(2)}px`);
    header.style.setProperty("--header-panel-scale", panelScale.toFixed(4));
    header.classList.toggle("is-floating", progress >= 0.999);
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateHeader();
      ticking = false;
    });
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.addEventListener("pageshow", updateHeader);

  updateHeader();
})();

(() => {
  const dialog = document.querySelector("#mobile-menu");
  const openButton = document.querySelector("[data-menu-open]");
  const closeButton = document.querySelector("[data-menu-close]");
  if (!dialog || !openButton || !closeButton) return;

  const openMenu = () => {
    dialog.showModal();
    openButton.setAttribute("aria-expanded", "true");
    closeButton.focus();
  };

  const closeMenu = () => {
    dialog.close();
    openButton.setAttribute("aria-expanded", "false");
    openButton.focus();
  };

  openButton.addEventListener("click", openMenu);
  closeButton.addEventListener("click", closeMenu);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeMenu();
  });

  dialog.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      dialog.close();
      openButton.setAttribute("aria-expanded", "false");
    });
  });

  dialog.addEventListener("close", () => {
    openButton.setAttribute("aria-expanded", "false");
  });
})();

(() => {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;

  const slides = [...hero.querySelectorAll("[data-slide]")];
  const selectors = [...hero.querySelectorAll("[data-slide-select]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const readTimeToken = (name, fallback) => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
    const amount = Number.parseFloat(value);
    if (!Number.isFinite(amount)) return fallback;
    if (value.endsWith("ms")) return amount;
    if (value.endsWith("s")) return amount * 1000;
    return fallback;
  };
  const delay = readTimeToken("--slider-delay", 7000);
  const fadeDuration = readTimeToken("--dur-slide", 1400);
  let current = 0;
  let timer = null;
  let leavingTimer = null;
  let progressAnimation = null;
  let remaining = delay;
  let startedAt = 0;
  let focusPaused = false;
  let keyboardFocus = false;
  let pageReady = document.documentElement.classList.contains("page-ready");

  const canPlay = () => {
    const playing =
      !focusPaused &&
      !document.hidden &&
      !reducedMotion.matches &&
      pageReady;
    hero.dataset.playing = String(playing);
    return playing;
  };

  const createProgress = () => {
    progressAnimation?.cancel();
    const progress = selectors[current]?.querySelector(".hero__progress");
    if (!progress || typeof progress.animate !== "function") return;

    progressAnimation = progress.animate(
      [
        { transform: "scaleX(0)" },
        { transform: "scaleX(1)" },
      ],
      {
        duration: delay,
        easing: "linear",
        fill: "forwards",
      },
    );
    progressAnimation.pause();
  };

  const render = (previousIndex = null) => {
    if (leavingTimer) {
      window.clearTimeout(leavingTimer);
      leavingTimer = null;
    }

    slides.forEach((slide, index) => {
      const active = index === current;
      const leaving =
        previousIndex !== null && index === previousIndex && !active;
      slide.classList.toggle("is-active", active);
      slide.classList.toggle("is-leaving", leaving);
      slide.setAttribute("aria-hidden", String(!active));
    });
    selectors.forEach((selector, index) => {
      const active = index === current;
      selector.classList.toggle("is-active", active);
      selector.setAttribute("aria-current", String(active));
    });
    createProgress();

    if (previousIndex !== null && previousIndex !== current) {
      leavingTimer = window.setTimeout(() => {
        slides[previousIndex]?.classList.remove("is-leaving");
        leavingTimer = null;
      }, fadeDuration + 80);
    }
  };

  const stopTimer = () => {
    if (timer) {
      window.clearTimeout(timer);
      timer = null;
    }
  };

  const pause = () => {
    if (timer) {
      remaining = Math.max(0, remaining - (performance.now() - startedAt));
    }
    stopTimer();
    progressAnimation?.pause();
    canPlay();
  };

  const schedule = () => {
    stopTimer();
    if (!canPlay()) return;
    startedAt = performance.now();
    timer = window.setTimeout(() => {
      const previous = current;
      current = (current + 1) % slides.length;
      remaining = delay;
      render(previous);
      schedule();
    }, remaining);
    progressAnimation?.play();
  };

  const goTo = (index) => {
    stopTimer();
    const next = (index + slides.length) % slides.length;
    const previous = next === current ? null : current;
    current = next;
    remaining = delay;
    render(previous);
    schedule();
  };

  selectors.forEach((selector, index) => {
    selector.addEventListener("click", () => goTo(index));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab") keyboardFocus = true;
  });

  document.addEventListener("pointerdown", () => {
    keyboardFocus = false;
    focusPaused = false;
  });

  hero.addEventListener("focusin", () => {
    if (!keyboardFocus) return;
    focusPaused = true;
    pause();
  });

  hero.addEventListener("focusout", (event) => {
    if (hero.contains(event.relatedTarget)) return;
    focusPaused = false;
    schedule();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pause();
    } else {
      schedule();
    }
  });

  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      remaining = delay;
      pause();
    } else {
      schedule();
    }
    canPlay();
  });

  window.addEventListener(
    "ark:page-ready",
    () => {
      pageReady = true;
      schedule();
    },
    { once: true },
  );

  render();
  if (pageReady) schedule();
})();

(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const revealTargets = [
    ...document.querySelectorAll("[data-title-reveal]"),
  ];

  if (!revealTargets.length || reducedMotion.matches) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.2,
    },
  );

  revealTargets.forEach((target) => observer.observe(target));
})();
