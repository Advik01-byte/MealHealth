(() => {
  const form = document.getElementById("recoveryForm");
  const emailInput = document.getElementById("recoveryEmail");
  const status = document.getElementById("recoveryStatus");
  const toast = document.getElementById("toast");

  const emailServiceConfig = {
    serviceId: "service_tm23eyy",
    templateId: "template_kr7q746",
    publicKey: "s4iMZvzMPPo4i1b9e",
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

  function isConfigured() {
    return !Object.values(emailServiceConfig).some((value) => String(value).startsWith("YOUR_"));
  }

  async function sendRecoveryEmail(email, code) {
    if (!isConfigured()) {
      throw new Error("Configure EmailJS credentials in recover.js to send mail on GitHub Pages.");
    }

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: emailServiceConfig.serviceId,
        template_id: emailServiceConfig.templateId,
        user_id: emailServiceConfig.publicKey,
        template_params: {
          to_email: email,
          recovery_code: code,
          expires_minutes: "10",
          reply_to: email,
        },
      }),
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(text || "Unable to send recovery email.");
    }
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!window.MealHealthStore) return;

    const store = window.MealHealthStore.getStore();
    const email = emailInput.value.trim().toLowerCase();

    if (email !== store.adminEmail) {
      showToast("Enter the correct admin email.");
      return;
    }

    updateStatus("Sending recovery code...");

    const code = window.MealHealthStore.generateRecoveryCode();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    sendRecoveryEmail(email, code)
      .then(() => {
        window.MealHealthStore.setRecoveryCode(email, code, expiresAt);
        updateStatus(`Recovery email sent to ${email}. Enter the code on the reset page.`);
        showToast("Recovery code sent.");
        form.reset();
      })
      .catch((error) => {
        const message = error.message || "Unable to send recovery email.";
        updateStatus(message);
        showToast(message);
      });
  });
})();
