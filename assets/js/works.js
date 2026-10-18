/* Static works preview. Replace this array with CMS data in production. */
(() => {
  const list = document.querySelector("[data-works-list]");
  const filterGroup = document.querySelector("[data-works-filters]");
  const categorySelect = document.querySelector("[data-works-category-select]");
  const pagination = document.querySelector("[data-works-pagination]");
  const status = document.querySelector("[data-works-status]");
  if (!list || !filterGroup || !categorySelect || !pagination || !status) return;

  const categories = Object.freeze({
    event: "大会・イベント",
    supervision: "監修",
  });
  const placeholder = "../assets/images/placeholder/sample-1.webp";
  const dummyWorks = (category, first, count) => Array.from({ length: count }, (_, index) => ({
    category,
    title: `仮実績 ${String(first + index).padStart(2, "0")}`,
    description: "実績内容を確認中です。",
    image: placeholder,
    alt: "",
    width: 1920,
    height: 1280,
  }));
  const works = [
    {
      category: "event",
      title: "湘南 OPEN",
      description: "BMX SHOWCASEの実績。テキストテキストテキストテキスト。",
      image: "../assets/images/works/shonan-open-hero.webp",
      alt: "湘南 OPEN 2026のBMXショーケース会場",
      width: 1920,
      height: 1280,
    },
    ...dummyWorks("event", 1, 5),
    {
      category: "supervision",
      title: "広島アーバンサイクルスポーツパーク",
      description: "施設づくりに携わった実績。テキストテキストテキストテキスト。",
      image: "../assets/images/media/hiroshima-bmx-flatland.webp",
      alt: "広島アーバンサイクルスポーツパークのBMXフラットランドゾーン",
      width: 2560,
      height: 1707,
    },
    ...dummyWorks("supervision", 6, 5),
  ];
  const pageSize = 9;
  let selected = "all";
  let page = 1;

  [["all", "すべて"], ...Object.entries(categories)].forEach(([value, label]) => {
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

  const makeWork = (work) => {
    const article = document.createElement("article");
    article.className = "work-entry";
    const figure = document.createElement("figure");
    figure.className = "work-entry__media";
    const image = document.createElement("img");
    image.src = work.image;
    image.alt = work.alt;
    image.width = work.width;
    image.height = work.height;
    image.loading = "lazy";
    image.decoding = "async";
    figure.append(image);
    const info = document.createElement("div");
    info.className = "work-entry__info";
    const category = document.createElement("p");
    category.className = "work-entry__category";
    category.textContent = categories[work.category];
    const title = document.createElement("h3");
    title.textContent = work.title;
    const description = document.createElement("p");
    description.textContent = work.description;
    info.append(category, title, description);
    article.append(figure, info);
    return article;
  };

  const render = () => {
    const visible = selected === "all" ? works : works.filter((work) => work.category === selected);
    const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
    page = Math.min(page, pageCount);
    list.replaceChildren(...visible.slice((page - 1) * pageSize, page * pageSize).map(makeWork));
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
