(() => {
  const form = document.getElementById("resetForm");
  const emailInput = document.getElementById("resetEmail");
  const codeInput = document.getElementById("resetCode");
  const passwordInput = document.getElementById("resetPassword");
  const confirmInput = document.getElementById("resetConfirm");
  const status = document.getElementById("resetStatus");
  const toast = document.getElementById("toast");
  const ruleItems = {
    length: document.querySelector('[data-rule="length"]'),
    letter: document.querySelector('[data-rule="letter"]'),
    number: document.querySelector('[data-rule="number"]'),
    special: document.querySelector('[data-rule="special"]'),
    match: document.querySelector('[data-rule="match"]'),
  };

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  function updateStatus(message) {
    if (status) status.textContent = message;
  }

  function updateRule(item, met) {
    if (!item) return;
    item.classList.toggle("is-met", met);
  }

  function refreshRules() {
    const password = passwordInput?.value || "";
    const confirmPassword = confirmInput?.value || "";

    updateRule(ruleItems.length, password.length >= 8);
    updateRule(ruleItems.letter, /[A-Za-z]/.test(password));
    updateRule(ruleItems.number, /\d/.test(password));
    updateRule(ruleItems.special, /[^A-Za-z0-9]/.test(password));
    updateRule(ruleItems.match, Boolean(password) && password === confirmPassword);
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

  setupPasswordToggle("resetPassword");
  setupPasswordToggle("resetConfirm");

  passwordInput?.addEventListener("input", refreshRules);
  confirmInput?.addEventListener("input", refreshRules);
  refreshRules();

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!window.MealHealthStore) return;

    const store = window.MealHealthStore.getStore();
    const email = emailInput.value.trim().toLowerCase();
    const code = codeInput.value.trim().toUpperCase();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;

    if (email !== store.adminEmail) {
      showToast("Enter the correct admin email.");
      return;
    }

    if (!store.recoveryCode || store.recoveryCodeEmail !== email) {
      showToast("Request a recovery code first.");
      return;
    }

    if (Date.now() > Number(store.recoveryCodeExpiresAt || 0)) {
      showToast("Recovery code has expired. Request a new one.");
      return;
    }

    if (code !== store.recoveryCode) {
      showToast("Recovery code is incorrect.");
      return;
    }

    if (!window.MealHealthStore.isStrongPassword(password)) {
      showToast("Password must be 8+ characters with a letter, number, and special character.");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match.");
      return;
    }

    window.MealHealthStore.setAdminPassword(password);
    window.MealHealthStore.clearRecoveryCode();
    form.reset();
    refreshRules();
    updateStatus("Password updated successfully. Go back to the admin login page and sign in again.");
    showToast("Password reset successful.");
  });

  passwordInput?.addEventListener("blur", () => {
    if (!passwordInput.value) return;
    if (!window.MealHealthStore?.isStrongPassword?.(passwordInput.value)) {
      showToast("Password is too weak.");
    }
  });

  confirmInput?.addEventListener("blur", () => {
    if (!confirmInput.value || !passwordInput.value) return;
    if (confirmInput.value !== passwordInput.value) {
      showToast("Passwords do not match.");
    }
  });
})();
