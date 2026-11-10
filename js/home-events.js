/* ============================================================
   Homepage events — render the 4 most relevant events
   Order: everything sorted by end date (or start date if none),
   newest-first. This naturally surfaces:
     - in-progress events (endDate still in the future)
     - the soonest upcoming event(s)
     - the most recently finished events
   ...all in one chronological line, with no "upcoming beats previous"
   distortion.
   ============================================================ */
(function () {
  function endOf(ev) {
    const raw = ev.endDate || ev.startDate;
    const t = new Date(raw).getTime();
    return isNaN(t) ? 0 : t;
  }

  function init() {
    const grid = document.getElementById("homeEventsGrid");
    if (!grid || !window.MBAEvents) return;

    const events = window.MBAEvents.all();

    const top4 = events
      .slice()
      .sort((a, b) => endOf(b) - endOf(a))
      .slice(0, 4);

    grid.innerHTML = top4.map((ev, i) => window.MBAEvents.buildCard(ev, i)).join("");

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