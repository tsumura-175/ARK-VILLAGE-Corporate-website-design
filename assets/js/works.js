/* TOP and WORKS share the Excel-backed records in works-data.js. */
(() => {
  const data = window.ARK_WORKS_DATA;
  if (!data) return;
  const imageBase = new URL("../images/works/", document.currentScript.src);
  const works = data.items;
  const homeList = document.querySelector("[data-home-works]");
  const list = document.querySelector("[data-works-list]");
  const filterGroup = document.querySelector("[data-works-filters]");
  const categorySelect = document.querySelector("[data-works-category-select]");
  const pagination = document.querySelector("[data-works-pagination]");
  const status = document.querySelector("[data-works-status]");

  const makeWork = (work, home = false) => {
    const prefix = home ? "work-panel" : "work-entry";
    const article = document.createElement("article");
    article.className = prefix;
    article.dataset.workRow = String(work.sourceRow);
    if (work.image) {
      const figure = document.createElement("figure");
      figure.className = `${prefix}__media`;
      const image = document.createElement("img");
      image.src = new URL(work.image.src, imageBase).href;
      image.alt = work.image.alt;
      image.width = work.image.width;
      image.height = work.image.height;
      image.loading = "lazy";
      image.decoding = "async";
      figure.append(image);
      if (work.image.credit) {
        const credit = document.createElement("figcaption");
        credit.className = "media-caption";
        credit.textContent = work.image.credit;
        figure.append(credit);
      }
      article.append(figure);
    }
    const info = document.createElement("div");
    info.className = home ? "work-panel__meta" : "work-entry__info";
    const category = document.createElement("p");
    category.className = `${prefix}__category`;
    category.textContent = work.category;
    const title = document.createElement("h3");
    title.textContent = work.title;
    const detail = document.createElement("p");
    detail.className = home ? "work-panel__category" : "work-entry__description";
    detail.textContent = `${work.year}年${work.note ? ` / ${work.note}` : ""}`;
    info.append(category, title, detail);
    article.append(info);
    return article;
  };

  if (homeList) homeList.replaceChildren(...works.slice(0, 6).map((work) => makeWork(work, true)));
  if (!list || !filterGroup || !categorySelect || !pagination || !status) return;
  const pageSize = 12;
  let selected = "all";
  let page = 1;

  [["all", "すべて"], ...data.categories.map((category) => [category, category])].forEach(([value, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.worksCategory = value;
    button.setAttribute("aria-pressed", String(value === "all"));
    button.textContent = label;
    filterGroup.append(button);

    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    categorySelect.append(option);
  });
  const filters = [...filterGroup.querySelectorAll("[data-works-category]")];

  const makePageButton = (label, target, disabled = false, current = false, className = "", ariaLabel = "") => {
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
    const visible = selected === "all" ? works : works.filter((work) => work.category === selected);
    const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
    page = Math.min(page, pageCount);
    list.replaceChildren(...visible.slice((page - 1) * pageSize, page * pageSize).map((work) => makeWork(work)));
    status.textContent = `${visible.length}件の実績、${pageCount}ページ中${page}ページ目を表示しています。`;

    pagination.replaceChildren();
    pagination.append(makePageButton("← 前へ", page - 1, page === 1, false, "news-pagination__direction", "前のページ"));
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
      pagination.append(makePageButton(String(number), number, false, page === number,
        edge ? "news-pagination__edge" : "", `${number}ページ目`));
    });
    pagination.append(makePageButton("次へ →", page + 1, page === pageCount, false, "news-pagination__direction", "次のページ"));
    filters.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.worksCategory === selected)));
    categorySelect.value = selected;
  };

  filters.forEach((button) => button.addEventListener("click", () => {
    selected = button.dataset.worksCategory;
    page = 1;
    render();
  }));
  categorySelect.addEventListener("change", () => {
    selected = categorySelect.value;
    page = 1;
    render();
  });
  render();
})();
