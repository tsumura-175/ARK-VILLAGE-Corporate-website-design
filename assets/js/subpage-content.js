/* Static content and form-flow previews. Replace the data source and submission layer in the CMS build. */
const newsCategoryLabels = Object.freeze({
  important: "重要なお知らせ",
  notice: "お知らせ",
  event: "イベント",
});

(() => {
  const list = document.querySelector("[data-news-list]");
  const filterGroup = document.querySelector("[data-news-filters]");
  const categorySelect = document.querySelector("[data-news-category-select]");
  const pagination = document.querySelector("[data-news-pagination]");
  if (!list || !pagination || !filterGroup || !categorySelect) return;

  const categoryChoices = [["all", "すべて"], ...Object.entries(newsCategoryLabels)];
  categoryChoices.forEach(([value, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.newsCategory = value;
    button.setAttribute("aria-pressed", String(value === "all"));
    button.textContent = label;
    filterGroup.append(button);

    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    categorySelect.append(option);
  });
  const filters = [...filterGroup.querySelectorAll("[data-news-category]")];
  const items = [
    ["2026-09-23", "important"],
    ["2026-09-18", "event"],
    ["2026-09-10", "notice"],
    ["2026-08-28", "event"],
    ["2026-08-20", "notice"],
    ["2026-08-08", "important"],
    ["2026-07-25", "event"],
    ["2026-07-18", "notice"],
    ["2026-07-04", "event"],
    ["2026-06-21", "notice"],
    ["2026-06-10", "important"],
    ["2026-05-29", "event"],
  ].map(([date, category]) => ({
    date,
    category,
    title: "テキストテキストテキストテキストテキスト",
    href: `sample-news/?date=${date}&category=${category}#news-article-section`,
  })).sort((a, b) => b.date.localeCompare(a.date));

  const pageSize = 10;
  let selected = "all";
  let page = 1;

  const makeButton = (label, target, disabled = false, current = false, className = "", ariaLabel = "") => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.className = className;
    button.disabled = disabled;
    if (ariaLabel) button.setAttribute("aria-label", ariaLabel);
    if (current) button.setAttribute("aria-current", "page");
    button.addEventListener("click", () => {
      page = target;
      render();
      list.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return button;
  };

  const render = () => {
    const visible = selected === "all" ? items : items.filter((item) => item.category === selected);
    const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
    page = Math.min(page, pageCount);
    const currentItems = visible.slice((page - 1) * pageSize, page * pageSize);
    const fragment = document.createDocumentFragment();

    currentItems.forEach((item) => {
      const link = document.createElement("a");
      link.className = `news__item news__item--link${item.category === "important" ? " news__item--important" : ""}`;
      link.href = item.href;
      const time = document.createElement("time");
      time.className = "news__date";
      time.dateTime = item.date;
      time.textContent = item.date.replaceAll("-", ".");
      const category = document.createElement("span");
      category.className = `news__category${item.category === "important" ? " news__category--important" : ""}`;
      category.textContent = newsCategoryLabels[item.category];
      const title = document.createElement("p");
      title.textContent = item.title;
      const arrow = document.createElement("span");
      arrow.className = "news__arrow ui-arrow-glyph";
      arrow.textContent = "→";
      arrow.setAttribute("aria-hidden", "true");
      link.append(time, category, title, arrow);
      fragment.append(link);
    });

    list.replaceChildren(fragment);
    pagination.replaceChildren();
    pagination.append(makeButton("← 前へ", page - 1, page === 1, false, "news-pagination__direction", "前のページ"));
    const numbers = pageCount <= 5
      ? Array.from({ length: pageCount }, (_, index) => index + 1)
      : [...new Set([1, page - 1, page, page + 1, pageCount].filter((number) => number >= 1 && number <= pageCount))]
        .sort((a, b) => a - b);
    numbers.forEach((number, index) => {
      if (index > 0 && number - numbers[index - 1] > 1) {
        const ellipsis = document.createElement("span");
        ellipsis.className = "news-pagination__ellipsis news-pagination__edge-gap";
        ellipsis.textContent = "…";
        ellipsis.setAttribute("aria-hidden", "true");
        pagination.append(ellipsis);
      }
      const edge = (number === 1 || number === pageCount) && Math.abs(number - page) > 1;
      pagination.append(makeButton(String(number), number, false, page === number,
        edge ? "news-pagination__edge" : "", `${number}ページ目`));
    });
    pagination.append(makeButton("次へ →", page + 1, page === pageCount, false, "news-pagination__direction", "次のページ"));
    filters.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.newsCategory === selected));
    });
    categorySelect.value = selected;
  };

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      selected = button.dataset.newsCategory;
      page = 1;
      render();
    });
  });
  categorySelect.addEventListener("change", () => {
    selected = categorySelect.value;
    page = 1;
    render();
  });
  render();
})();

(() => {
  const articleDate = document.querySelector("[data-article-date]");
  const articleCategory = document.querySelector("[data-article-category]");
  if (!articleDate || !articleCategory) return;

  // Direct visits without an anchor start at the article, once the loader releases scrolling.
  const revealArticle = () => {
    if (window.location.hash) return;
    requestAnimationFrame(() => {
      document.getElementById("news-article-section")?.scrollIntoView({ behavior: "instant", block: "start" });
    });
  };
  if (document.documentElement.classList.contains("page-ready")) {
    revealArticle();
  } else {
    window.addEventListener("ark:page-ready", revealArticle, { once: true });
  }

  const params = new URLSearchParams(window.location.search);
  const date = params.get("date");
  const category = params.get("category");
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    articleDate.dateTime = date;
    articleDate.textContent = date.replaceAll("-", ".");
  }
  if (category && newsCategoryLabels[category]) {
    articleCategory.textContent = newsCategoryLabels[category];
    articleCategory.classList.toggle("news__category--important", category === "important");
  }
})();

(() => {
  const storageKey = "ark-contact-preview";
  const form = document.querySelector("[data-contact-form]");
  const fields = [...document.querySelectorAll("[data-confirm-field]")];
  const status = document.querySelector("[data-contact-status]");
  const read = () => {
    try {
      return JSON.parse(sessionStorage.getItem(storageKey) || "null");
    } catch {
      return null;
    }
  };

  if (form) {
    const prior = read();
    if (prior) {
      ["type", "organization", "name", "email", "phone", "message"].forEach((key) => {
        const control = form.elements.namedItem(key);
        if (control && typeof prior[key] === "string") control.value = prior[key];
      });
      const consent = form.elements.namedItem("consent");
      if (consent) consent.checked = prior.consent === true;
    }

    const next = () => {
      if (!form.reportValidity()) return;
      const values = Object.fromEntries(new FormData(form).entries());
      values.consent = form.elements.namedItem("consent").checked;
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(values));
      } catch {
        if (status) {
          status.textContent = "ブラウザの保存機能を利用できないため、確認画面へ進めません。";
          status.hidden = false;
        }
        return;
      }
      window.location.href = "confirm/#contact-confirm-section";
    };
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      next();
    });
    form.querySelector("[data-contact-next]")?.addEventListener("click", next);
  }

  if (fields.length) {
    const values = read();
    fields.forEach((field) => {
      const key = field.dataset.confirmField;
      if (key === "consent") {
        field.textContent = values?.consent ? "同意済み" : "未選択";
      } else {
        field.textContent = values?.[key] || "入力なし";
      }
    });
    document.querySelector("[data-contact-preview-complete]")?.addEventListener("click", () => {
      try {
        sessionStorage.removeItem(storageKey);
      } catch {
        // The preview can still proceed when browser storage is unavailable.
      }
      window.location.href = "../complete/#contact-complete-section";
    });
  }
})();
