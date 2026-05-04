(() => {
  const navActions = document.querySelector(".nav-actions");
  const session = window.MealHealthAuth?.getSession?.();
  if (!navActions) return;

  if (session) {
    navActions.innerHTML = `
      <a class="nav-pill" href="/pages/admin-dashboard.html">Dashboard</a>
      <a class="nav-pill" href="/pages/waitlist-admin.html">Waitlist table</a>
      <button class="nav-pill nav-button" type="button" id="authLogout">Logout</button>
    `;

    document.getElementById("authLogout")?.addEventListener("click", () => {
      window.MealHealthAuth?.signOut?.("/index.html");
    });
    return;
  }

  if (
    window.location.pathname.endsWith("reset-password.html") ||
    window.location.pathname.endsWith("recover.html")
  ) {
    navActions.querySelector('a[href="waitlist-admin.html"]')?.remove();
  }
})();
