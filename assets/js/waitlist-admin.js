(() => {
  const tableBody = document.getElementById("waitlistTableBody");
  const waitlistCount = document.getElementById("waitlistCount");
  const waitlistEmpty = document.getElementById("waitlistEmpty");
  const logoutButton = document.getElementById("logoutButton");
  const clearEmailsButton = document.getElementById("clearEmailsButton");

  function renderTable() {
    if (!window.MealHealthStore || !tableBody || !waitlistCount || !waitlistEmpty) return;

    const entries = window.MealHealthStore.getStore().emails || [];
    tableBody.innerHTML = "";
    waitlistCount.textContent = `${entries.length} email${entries.length === 1 ? "" : "s"}`;
    waitlistEmpty.hidden = entries.length !== 0;
    if (clearEmailsButton) {
      clearEmailsButton.disabled = entries.length === 0;
    }

    entries.forEach((entry, index) => {
      const row = document.createElement("tr");

      const numberCell = document.createElement("td");
      numberCell.textContent = String(index + 1);

      const emailCell = document.createElement("td");
      emailCell.textContent = entry.email;

      const dateCell = document.createElement("td");
      dateCell.textContent = new Date(entry.createdAt).toLocaleString();

      row.append(numberCell, emailCell, dateCell);
      tableBody.appendChild(row);
    });
  }

  renderTable();

  logoutButton?.addEventListener("click", () => {
    window.MealHealthAuth?.signOut?.("/MealHealth/index.html");
  });

  clearEmailsButton?.addEventListener("click", () => {
    const confirmed = window.confirm("Delete all stored waitlist emails?");
    if (!confirmed) return;

    window.MealHealthStore?.clearWaitlistEmails?.();
    renderTable();
  });
})();
