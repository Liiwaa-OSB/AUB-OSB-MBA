/* ============================================================
   Homepage events — render latest 4 events
   ============================================================ */
(function () {
  function init() {
    const grid = document.getElementById("homeEventsGrid");
    if (!grid || !window.MBAEvents) return;
    const events = window.MBAEvents.all();
    // Show the 4 most recent events (upcoming first, then latest past)
    const now = new Date();
    const upcoming = window.MBAEvents
      .sortByDateAsc(events.filter((e) => window.MBAEvents.getStatus(e, now) === "upcoming"));
    const past = window.MBAEvents
      .sortByDateDesc(events.filter((e) => window.MBAEvents.getStatus(e, now) === "past"));
    const top4 = upcoming.concat(past).slice(0, 4);
    grid.innerHTML = top4.map((ev, i) => window.MBAEvents.buildCard(ev, i)).join("");
    // re-trigger reveal observers if main.js relies on MutationObserver; else force visible
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