/* Static application preview: metadata only; no upload or email is performed. */
(() => {
  const storageKey = "ark-garden-application-preview";
  const textKeys = ["organization", "name", "email", "phone", "business-type", "products", "history", "conditions"];
  const checkKeys = ["confirmation", "privacy"];
  const requiredKeys = ["organization", "name", "email", "business-type", "products"];
  const form = document.querySelector("[data-application-form]");
  const confirm = document.querySelector("[data-application-confirm]");
  const read = () => {
    try {
      const value = JSON.parse(sessionStorage.getItem(storageKey) || "null");
      return value && typeof value === "object" && !Array.isArray(value) ? value : null;
    } catch {
      return null;
    }
  };
  const isComplete = (value) => value
    && requiredKeys.every((key) => typeof value[key] === "string" && value[key].trim())
    && checkKeys.every((key) => value[key] === true);
  const prior = read();

  if (form) {
    const attachmentControl = form.querySelector(".attachment-control");
    const status = form.querySelector("[data-application-status]");
    textKeys.forEach((key) => {
      if (typeof prior?.[key] === "string") form.elements.namedItem(key).value = prior[key];
    });
    checkKeys.forEach((key) => {
      form.elements.namedItem(key).checked = prior?.[key] === true;
    });
    attachmentControl.dispatchEvent(new CustomEvent("attachment:restore", {
      detail: { name: typeof prior?.attachment === "string" ? prior.attachment : "" },
    }));

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      textKeys.forEach((key) => {
        const control = form.elements.namedItem(key);
        control.value = control.value.trim();
      });
      if (!form.reportValidity()) return;
      const value = Object.fromEntries(textKeys.map((key) => [key, form.elements.namedItem(key).value]));
      checkKeys.forEach((key) => { value[key] = form.elements.namedItem(key).checked; });
      value.attachment = attachmentControl.dataset.attachmentName || "";
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(value));
      } catch {
        status.textContent = "ブラウザの保存機能を利用できないため、確認画面へ進めません。";
        status.hidden = false;
        return;
      }
      window.location.href = "confirm/#application-confirm";
    });
  }

  if (confirm && isComplete(prior)) {
    confirm.hidden = false;
    document.querySelector("[data-application-empty]").hidden = true;
    confirm.querySelectorAll("[data-application-field]").forEach((field) => {
      const key = field.dataset.applicationField;
      field.textContent = checkKeys.includes(key)
        ? "確認済み"
        : (typeof prior[key] === "string" && prior[key] ? prior[key] : "入力なし");
      if (key === "attachment" && !prior[key]) field.textContent = "添付なし";
    });
    confirm.querySelector("[data-application-complete]").addEventListener("click", (event) => {
      event.currentTarget.disabled = true;
      try {
        sessionStorage.removeItem(storageKey);
      } catch {
        // Local preview still completes when storage access is subsequently restricted.
      }
      window.location.href = "../complete/#application-complete";
    });
  }
})();
