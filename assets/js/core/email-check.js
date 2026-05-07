(() => {
  const form = document.getElementById("waitlistForm");
  const input = document.getElementById("email");
  const toast = document.getElementById("toast");

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  if (!form || !input || !window.MealHealthStore) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim().toLowerCase();

    if (!window.MealHealthStore.isValidEmail(value)) {
      showToast("Please enter a valid email address.");
      input.focus();
      return;
    }

    window.MealHealthStore.addWaitlistEmail(value);
    input.value = "";
    showToast("Email added to the waitlist.");
  });

  window.MealHealthUI = window.MealHealthUI || {};
  window.MealHealthUI.showToast = showToast;
})();
