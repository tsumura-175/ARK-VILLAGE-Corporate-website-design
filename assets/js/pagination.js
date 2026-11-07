/* Shared pagination for NEWS, WORKS, and declarative design samples. */
(() => {
  const desktop = window.matchMedia("(min-width: 48rem)");
  const controllers = new Set();

  const pageNumbers = (total, current) => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const radius = desktop.matches ? 1 : 0;
    return [...new Set([1, total, ...Array.from({ length: radius * 2 + 1 }, (_, i) => current - radius + i)])]
      .filter((number) => number >= 1 && number <= total).sort((a, b) => a - b);
  };

  const create = (container, { onChange, scrollTarget }) => {
    let total = 1;
    let current = 1;

    const focusButton = (key) => {
      const button = [...container.querySelectorAll("button")]
        .find((item) => item.dataset.paginationKey === key && !item.disabled)
        || container.querySelector('[aria-current="page"]');
      button?.focus({ preventScroll: true });
    };

    const render = () => {
      const active = container.contains(document.activeElement)
        ? document.activeElement.dataset.paginationKey : null;
      container.hidden = total <= 1;
      container.classList.toggle("news-pagination--many", total >= 6);
      const wrapper = container.closest(".news-pagination-wrap");
      if (wrapper) wrapper.hidden = container.hidden;
      container.replaceChildren();
      if (container.hidden) return;

      const makeButton = (label, target, key, disabled = false, direction = false) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.disabled = disabled;
        button.dataset.paginationTarget = String(target);
        button.dataset.paginationKey = key;
        button.setAttribute("aria-label", direction ? { first: "最初のページ", previous: "前のページ", next: "次のページ", last: "最後のページ" }[key] : `${target}ページ目`);
        if (direction) button.className = "news-pagination__direction";
        else if (target === current) button.setAttribute("aria-current", "page");
        return button;
      };
      const start = document.createElement("div");
      start.className = "news-pagination__start";
      const numbers = document.createElement("div");
      numbers.className = "news-pagination__numbers";
      const end = document.createElement("div");
      end.className = "news-pagination__end";
      if (total >= 6) start.append(makeButton("最初へ", 1, "first", current === 1, true));
      start.append(makeButton("前へ", Math.max(1, current - 1), "previous", current === 1, true));
      const pages = pageNumbers(total, current);
      pages.forEach((number, index) => {
        if (index && number - pages[index - 1] > 1) {
          const ellipsis = document.createElement("span");
          ellipsis.className = "news-pagination__ellipsis";
          ellipsis.textContent = "…";
          numbers.append(ellipsis);
        }
        numbers.append(makeButton(String(number), number, `page-${number}`));
      });
      end.append(makeButton("次へ", Math.min(total, current + 1), "next", current === total, true));
      if (total >= 6) end.append(makeButton("最後へ", total, "last", current === total, true));
      container.append(start, numbers, end);
      if (active) focusButton(active);
    };

    container.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-pagination-target]");
      if (!button || !container.contains(button) || button.disabled) return;
      const target = Number(button.dataset.paginationTarget);
      if (target === current) return;
      const key = button.dataset.paginationKey;
      onChange(target);
      if (!container.hidden) focusButton(key);
      scrollTarget?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block: "start",
      });
    });
    const controller = {
      update({ pageCount, page }) {
        total = Math.max(1, Math.trunc(Number(pageCount)) || 1);
        current = Math.max(1, Math.min(total, Math.trunc(Number(page)) || 1));
        render();
      },
      refresh: render,
    };
    controllers.add(controller);
    return controller;
  };

  desktop.addEventListener("change", () => controllers.forEach((controller) => controller.refresh()));
  window.ARKPagination = Object.freeze({ create });

  document.querySelectorAll("[data-pagination-total]").forEach((container) => {
    const pageCount = Number(container.dataset.paginationTotal);
    const status = container.parentElement.querySelector("[data-pagination-status]");
    const pagination = create(container, { onChange(page) {
      container.dataset.paginationCurrent = String(page);
      pagination.update({ pageCount, page });
      const caption = document.getElementById(container.dataset.paginationCaption);
      if (caption) caption.textContent = `${pageCount}ページの場合：${page === 1 ? "最初のページ" : page === pageCount ? "最後のページ" : "中間のページ"}`;
      if (status) status.textContent = `${pageCount}ページ中${page}ページ目を表示しています。`;
    } });
    pagination.update({ pageCount, page: Number(container.dataset.paginationCurrent) });
  });
})();
