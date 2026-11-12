/* ============================================================
   Homepage events — render the last 4 entries from MBA_EVENTS
   "Last" = the most recently appended items in the source array.
   Their source order is preserved (no re-sorting).
   ============================================================ */
(function () {
  function getEvents() {
    // Prefer the raw array if present; otherwise fall back to the helper.
    if (Array.isArray(window.MBA_EVENTS)) return window.MBA_EVENTS;
    if (window.MBAEvents && typeof window.MBAEvents.all === "function") {
      return window.MBAEvents.all();
    }
    return null;
  }

  function init() {
    const grid = document.getElementById("homeEventsGrid");
    if (!grid) return;

    const events = getEvents();
    if (!events || !events.length) return;

    // Take the last 4 (most recently added) without reordering.
    const last4 = events.slice(-4).reverse();

    grid.innerHTML = last4
      .map((ev, i) => window.MBAEvents.buildCard(ev, i))
      .join("");

    if (typeof window.__mbaRevealRefresh === "function") {
      window.__mbaRevealRefresh();
    } else {
      grid.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();