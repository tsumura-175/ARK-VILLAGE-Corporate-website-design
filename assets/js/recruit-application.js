/* Static recruitment preview. Stores text and the resume filename, never file contents.
 * Production must validate/upload the file server-side; a remembered name is not an upload.
 */
(() => {
  const storageKey = "ark-garden-recruitment-preview";
  const textKeys = ["name", "email", "phone", "role", "career", "motivation"];
  const requiredKeys = ["name", "email", "role", "motivation", "resume"];
  const form = document.querySelector("[data-recruit-form]");
  const confirm = document.querySelector("[data-recruit-confirm]");
  if (!form && !confirm) return;

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
    && value.privacy === true
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email);

  if (form) {
    const attachment = form.querySelector(".attachment-control");
    const resume = form.elements.namedItem("resume");
    const status = form.querySelector("[data-recruit-status]");
    const prior = read();
    textKeys.forEach((key) => {
      if (typeof prior?.[key] === "string") form.elements.namedItem(key).value = prior[key];
    });
    form.elements.namedItem("privacy").checked = prior?.privacy === true;
    attachment.dispatchEvent(new CustomEvent("attachment:restore", {
      detail: { name: typeof prior?.resume === "string" ? prior.resume : "" },
    }));
    const validateResume = () => {
      const hasFilename = Boolean(attachment.dataset.attachmentName);
      // A saved filename is sufficient only for this metadata-only static preview.
      resume.required = !hasFilename;
      resume.setCustomValidity(hasFilename ? "" : "履歴書を選択してください。");
    };
    resume.addEventListener("change", validateResume);
    attachment.querySelector("[data-attachment-remove]").addEventListener("click", validateResume);
    validateResume();

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      status.hidden = true;
      textKeys.forEach((key) => {
        const field = form.elements.namedItem(key);
        field.value = field.value.trim();
      });
      validateResume();
      if (!form.reportValidity()) return;
      const value = Object.fromEntries(textKeys.map((key) => [key, form.elements.namedItem(key).value]));
      value.privacy = form.elements.namedItem("privacy").checked;
      value.resume = attachment.dataset.attachmentName || "";
      // Keep validation identical when the confirmation URL is accessed directly.
      if (!isComplete(value)) {
        status.textContent = "メールアドレスなどの入力内容を確認してください。";
        status.hidden = false;
        return;
      }
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(value));
      } catch {
        status.textContent = "ブラウザの保存機能を利用できないため、確認画面へ進めません。";
        status.hidden = false;
        return;
      }
      window.location.href = "confirm/#recruit-confirm";
    });
  }

  if (confirm) {
    const empty = document.querySelector("[data-recruit-empty]");
    const complete = confirm.querySelector("[data-recruit-complete]");
    const render = () => {
      const value = read();
      const valid = Boolean(isComplete(value));
      confirm.hidden = !valid;
      empty.hidden = valid;
      complete.disabled = !valid;
      confirm.querySelectorAll("[data-recruit-field]").forEach((field) => {
        const key = field.dataset.recruitField;
        field.textContent = !valid ? "" : key === "privacy" ? "同意済み"
          : (typeof value[key] === "string" && value[key] ? value[key] : "入力なし");
      });
      return valid;
    };
    complete.addEventListener("click", () => {
      if (!render()) return;
      complete.disabled = true;
      try {
        sessionStorage.removeItem(storageKey);
      } catch {
        // The static completion page remains available if storage access is revoked.
      }
      window.location.replace("../complete/#recruit-complete");
    });
    render();
    // Do not show a previously submitted application when returning via browser history.
    window.addEventListener("pageshow", render);
  }
})();
