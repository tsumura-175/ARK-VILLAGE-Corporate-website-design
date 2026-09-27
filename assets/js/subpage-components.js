/* Shared lower-page controls. Persistence and submission belong to the form controller. */
(() => {
  const scope = document.querySelector(".subpage");
  if (!scope) return;

  scope.querySelectorAll(".attachment-control").forEach((control) => {
    const input = control.querySelector('input[type="file"]');
    const name = control.querySelector("[data-attachment-selection]");
    const remove = control.querySelector("[data-attachment-remove]");
    const field = control.querySelector(".attachment-control__field");
    if (!input || !name || !remove || !field) return;
    const render = (filename = "") => {
      control.dataset.attachmentName = filename;
      name.textContent = filename || "選択されていません";
      field.classList.toggle("has-file", Boolean(filename));
      remove.hidden = !filename;
    };
    input.addEventListener("change", () => render(input.files[0]?.name || ""));
    control.addEventListener("attachment:restore", (event) => {
      render(typeof event.detail?.name === "string" ? event.detail.name : "");
    });
    remove.addEventListener("click", () => {
      input.value = "";
      render();
      input.focus();
    });
    render();
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  scope.querySelectorAll(".faq-item").forEach((item) => {
    const summary = item.querySelector("summary");
    const answer = item.querySelector(".faq-item__answer");
    if (!summary || !answer || typeof answer.animate !== "function") return;
    const panel = document.createElement("div");
    panel.className = "faq-item__panel";
    answer.before(panel);
    panel.append(answer);
    let expanded = item.open;
    let animation = null;
    item.dataset.animated = "";
    const sync = () => {
      item.dataset.expanded = String(expanded);
      summary.setAttribute("aria-expanded", String(expanded));
      panel.inert = !expanded;
      panel.setAttribute("aria-hidden", String(!expanded));
    };
    const settle = () => {
      if (animation) {
        animation.onfinish = null;
        animation.cancel();
        animation = null;
      }
      item.open = expanded;
      panel.style.removeProperty("height");
      sync();
    };
    sync();
    summary.addEventListener("click", (event) => {
      event.preventDefault();
      const start = item.open ? panel.getBoundingClientRect().height : 0;
      if (animation) {
        animation.onfinish = null;
        animation.cancel();
      }
      expanded = !expanded;
      sync();
      if (reducedMotion.matches) {
        settle();
        return;
      }
      item.open = true;
      const end = expanded ? answer.getBoundingClientRect().height : 0;
      panel.style.height = end + "px";
      animation = panel.animate(
        [{ height: start + "px" }, { height: end + "px" }],
        { duration: 400, easing: "cubic-bezier(0.4, 0, 0.2, 1)" }
      );
      animation.onfinish = settle;
    });
    // End at a natural height if wrapping or the motion preference changes mid-animation.
    window.addEventListener("resize", settle);
    reducedMotion.addEventListener("change", settle);
  });
})();
