(() => {
  const STORAGE_KEY = "mealhealth-store";
  const SESSION_KEY = "mealhealth-admin-session";
  const DEFAULT_STORE = {
    adminEmail: "iamadvikgoyal@gmail.com",
    adminPassword: "Advik7326##",
    recoveryCode: "",
    recoveryCodeExpiresAt: 0,
    recoveryCodeEmail: "",
    emails: [],
  };

  function readRawStore() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function writeRawStore(value) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Ignore storage failures in restricted environments.
    }
  }

  function normalizeStore(candidate) {
    const store = { ...DEFAULT_STORE, ...(candidate || {}) };
    store.emails = Array.isArray(store.emails) ? store.emails : [];
    return store;
  }

  function getStore() {
    const raw = readRawStore();
    if (!raw) {
      const initial = normalizeStore();
      writeRawStore(initial);
      return initial;
    }

    try {
      return normalizeStore(JSON.parse(raw));
    } catch {
      const fallback = normalizeStore();
      writeRawStore(fallback);
      return fallback;
    }
  }

  function saveStore(nextStore) {
    const store = normalizeStore(nextStore);
    writeRawStore(store);
    return store;
  }

  function updateStore(patch) {
    return saveStore({ ...getStore(), ...patch });
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  }

  function isStrongPassword(value) {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(String(value));
  }

  function generateRecoveryCode() {
    const bytes = new Uint8Array(4);
    if (window.crypto?.getRandomValues) {
      window.crypto.getRandomValues(bytes);
    } else {
      for (let index = 0; index < bytes.length; index += 1) {
        bytes[index] = Math.floor(Math.random() * 256);
      }
    }

    return `MH-${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
  }

  function addWaitlistEmail(email) {
    const store = getStore();
    const normalizedEmail = String(email).trim().toLowerCase();
    const alreadyExists = store.emails.some((entry) => entry.email === normalizedEmail);

    if (!alreadyExists) {
      store.emails.push({
        email: normalizedEmail,
        createdAt: new Date().toISOString(),
      });
      saveStore(store);
    }

    return store;
  }

  function clearWaitlistEmails() {
    return updateStore({ emails: [] });
  }

  function setRecoveryCode(email, code, expiresAt) {
    return updateStore({
      recoveryCodeEmail: String(email).trim().toLowerCase(),
      recoveryCode: code,
      recoveryCodeExpiresAt: expiresAt,
    });
  }

  function clearRecoveryCode() {
    return updateStore({
      recoveryCodeEmail: "",
      recoveryCode: "",
      recoveryCodeExpiresAt: 0,
    });
  }

  function setAdminPassword(password) {
    return updateStore({ adminPassword: password });
  }

  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const session = JSON.parse(raw);
        return session && session.loggedIn ? session : null;
      }

      const sessionRaw = sessionStorage.getItem(SESSION_KEY);
      if (!sessionRaw) return null;
      const session = JSON.parse(sessionRaw);
      return session && session.loggedIn ? session : null;
    } catch {
      return null;
    }
  }

  function signInAdmin(email) {
    const session = {
      loggedIn: true,
      email: String(email).trim().toLowerCase(),
      signedInAt: new Date().toISOString(),
    };

    try {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // Ignore storage failures in restricted environments.
    }

    return session;
  }

  function signInAdminWithRemember(email, rememberMe) {
    const session = {
      loggedIn: true,
      email: String(email).trim().toLowerCase(),
      signedInAt: new Date().toISOString(),
    };

    const storage = rememberMe ? localStorage : sessionStorage;
    try {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      storage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // Ignore storage failures in restricted environments.
    }

    return session;
  }

  function signOutAdmin() {
    try {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignore storage failures in restricted environments.
    }
  }

  window.MealHealthStore = {
    getStore,
    saveStore,
    updateStore,
    isValidEmail,
    isStrongPassword,
    generateRecoveryCode,
    addWaitlistEmail,
    clearWaitlistEmails,
    setRecoveryCode,
    clearRecoveryCode,
    setAdminPassword,
    getSession,
    signInAdmin,
    signInAdminWithRemember,
    signOutAdmin,
    defaults: DEFAULT_STORE,
  };
})();
