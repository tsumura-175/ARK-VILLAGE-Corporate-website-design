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
})();
