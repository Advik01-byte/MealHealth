(() => {
  const logoutButton = document.getElementById("logoutButton");
  const greeting = document.getElementById("adminGreeting");

  const session = window.MealHealthAuth?.getSession?.();
  if (greeting && session?.email) {
    greeting.textContent = `You are signed in as ${session.email}. Waitlist access, recovery tools, and admin actions are available here.`;
  }

  logoutButton?.addEventListener("click", () => {
    window.MealHealthAuth?.signOut?.("index.html");
  });
})();
