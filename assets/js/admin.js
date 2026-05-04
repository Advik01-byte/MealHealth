(() => {
  const adminOpen = document.getElementById("adminOpen");
  const adminModal = document.getElementById("adminModal");
  const adminClose = document.getElementById("adminClose");
  const adminLoginForm = document.getElementById("adminLoginForm");
  const adminEmail = document.getElementById("adminEmail");
  const adminPassword = document.getElementById("adminPassword");
  const rememberMe = document.getElementById("rememberMe");
  const loginAlert = document.getElementById("loginAlert");
  const toast = document.getElementById("toast");

  function showToast(message) {
    if (window.MealHealthUI && typeof window.MealHealthUI.showToast === "function") {
      window.MealHealthUI.showToast(message);
      return;
    }

    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  function openModal() {
    adminModal?.classList.add("open");
    adminModal?.setAttribute("aria-hidden", "false");
    adminLoginForm?.reset();
    if (rememberMe) rememberMe.checked = false;
    clearInlineError();
    window.setTimeout(() => adminEmail?.focus?.(), 0);
  }

  function closeModal() {
    adminModal?.classList.remove("open");
    adminModal?.setAttribute("aria-hidden", "true");
  }

  function showInlineError(message) {
    if (!loginAlert) return;
    loginAlert.textContent = message;
    loginAlert.hidden = false;
  }

  function clearInlineError() {
    if (!loginAlert) return;
    loginAlert.textContent = "";
    loginAlert.hidden = true;
  }

  function setupPasswordToggle(inputId) {
    const input = document.getElementById(inputId);
    const toggle = document.querySelector(`[data-password-toggle="${inputId}"]`);
    if (!input || !toggle) return;

    toggle.addEventListener("click", () => {
      const nextType = input.type === "password" ? "text" : "password";
      input.type = nextType;
      toggle.classList.toggle("active", nextType === "text");
      toggle.setAttribute("aria-label", nextType === "password" ? "Show password" : "Hide password");
    });
  }

  setupPasswordToggle("adminPassword");

  adminOpen?.addEventListener("click", openModal);
  adminClose?.addEventListener("click", closeModal);
  adminModal?.addEventListener("click", (event) => {
    if (event.target === adminModal) closeModal();
  });

  adminLoginForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const store = window.MealHealthStore?.getStore?.();
    const email = adminEmail.value.trim().toLowerCase();
    const password = adminPassword.value;
    const shouldRemember = Boolean(rememberMe?.checked);
    const message = "Incorrect email or password.";

    if (email !== store?.adminEmail) {
      showInlineError(message);
      showToast(message);
      return;
    }

    if (password !== store?.adminPassword) {
      showInlineError(message);
      showToast(message);
      return;
    }

    clearInlineError();
    adminLoginForm.reset();
    if (rememberMe) rememberMe.checked = false;
    window.MealHealthAuth?.signInWithRemember?.(email, shouldRemember);
    closeModal();
    window.location.href = "/pages/admin-dashboard.html";
  });

  adminEmail?.addEventListener("input", clearInlineError);
  adminPassword?.addEventListener("input", clearInlineError);

  adminEmail?.addEventListener("blur", () => {
    const store = window.MealHealthStore?.getStore?.();
    const email = adminEmail.value.trim().toLowerCase();
    const message = "Incorrect email or password.";
    if (!email) return;
    if (email !== store?.adminEmail) {
      showInlineError(message);
      showToast(message);
    }
  });

  adminPassword?.addEventListener("blur", () => {
    const store = window.MealHealthStore?.getStore?.();
    const email = adminEmail.value.trim().toLowerCase();
    const password = adminPassword.value;
    const message = "Incorrect email or password.";

    if (!email || !password) return;
    if (email !== store?.adminEmail) return;
    if (password !== store?.adminPassword) {
      showInlineError(message);
      showToast(message);
    }
  });
})();
