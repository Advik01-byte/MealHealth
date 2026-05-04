(() => {
  function getSession() {
    return window.MealHealthStore?.getSession?.() || null;
  }

  function isLoggedIn() {
    return Boolean(getSession());
  }

  function requireAdmin(redirectUrl = "/index.html") {
    if (!isLoggedIn()) {
      window.location.replace(redirectUrl);
      return false;
    }
    return true;
  }

  function signIn(email) {
    return window.MealHealthStore?.signInAdmin?.(email);
  }

  function signInWithRemember(email, rememberMe) {
    return window.MealHealthStore?.signInAdminWithRemember?.(email, rememberMe);
  }

  function signOut(redirectUrl = "/index.html") {
    window.MealHealthStore?.signOutAdmin?.();
    window.location.replace(redirectUrl);
  }

  window.MealHealthAuth = {
    getSession,
    isLoggedIn,
    requireAdmin,
    signIn,
    signInWithRemember,
    signOut,
  };
})();
