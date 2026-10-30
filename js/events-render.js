/* ============================================================
   Shared event card renderer
   Used by index.html and events.html.
   Exposes window.MBAEvents.
   ============================================================ */
(function () {
  "use strict";

  function escapeHtml(value) {
    if (value == null) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function toDate(value) {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  function parseStart(ev) {
    return toDate(ev.startDate);
  }

  /* An event is "upcoming" until its end (or start, if no end) has passed.
     Events without a usable date are treated as upcoming (TBD). */
  function getStatus(ev, now) {
    if (ev.isTBD) return "upcoming";
    if (ev.status === "past" || ev.status === "upcoming") return ev.status;

    const start = parseStart(ev);
    if (!start) return "upcoming";

    const end = toDate(ev.endDate) || start;
    return end >= (now || new Date()) ? "upcoming" : "past";
  }

  /* ---------- Sorting (undated events always go last) ---------- */
  function compareBy(direction) {
    return function (a, b) {
      const da = parseStart(a);
      const db = parseStart(b);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return direction * (da - db);
    };
  }

  function sortByDateAsc(list) {
    return list.slice().sort(compareBy(1));
  }

  function sortByDateDesc(list) {
    return list.slice().sort(compareBy(-1));
  }

  /* ---------- Formatting ---------- */
  function formatShortDate(startISO, endISO) {
    const start = toDate(startISO);
    if (!start) return "";

    const full = { month: "short", day: "numeric", year: "numeric" };
    const end = toDate(endISO);

    if (end && end.toDateString() !== start.toDateString()) {
      const sameMonth =
        start.getMonth() === end.getMonth() &&
        start.getFullYear() === end.getFullYear();

      if (sameMonth) {
        const month = start.toLocaleDateString("en-US", { month: "short" });
        return `${month} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;
      }
      return `${start.toLocaleDateString("en-US", full)} – ${end.toLocaleDateString("en-US", full)}`;
    }

    return start.toLocaleDateString("en-US", full);
  }

  /* ---------- Card pieces ---------- */
  function buildDateBadge(ev) {
    const month = escapeHtml(ev.month || (ev.isTBD ? "Date" : ""));
    const day = escapeHtml(ev.day || (ev.isTBD ? "TBD" : ""));
    const year = escapeHtml(ev.year || "");

    if (ev.isTBD) {
      return `
        <div class="event-card__date event-card__date--tbd">
          <span class="event-card__month">${month}</span>
          <span class="event-card__day">${day}</span>
          <span class="event-card__year">${year}</span>
        </div>`;
    }

    const isRange = /[–-]/.test(ev.day || "");
    const dayClass = isRange ? " event-card__day--range" : "";

    return `
      <time class="event-card__date" datetime="${escapeHtml(ev.startDate || "")}">
        <span class="event-card__month">${month}</span>
        <span class="event-card__day${dayClass}">${day}</span>
        <span class="event-card__year">${year}</span>
      </time>`;
  }

  function buildMetaItem(icon, text) {
    return `
      <span class="event-card__meta-item">
        <i class="${icon}" aria-hidden="true"></i>
        ${escapeHtml(text)}
      </span>`;
  }

  function buildMeta(ev) {
    const items = [];

    const dateLabel =
      ev.displayDate ||
      (ev.isTBD ? "Date to be announced" : formatShortDate(ev.startDate, ev.endDate));
    if (dateLabel) items.push(buildMetaItem("fa-regular fa-calendar", dateLabel));

    if (ev.time) items.push(buildMetaItem("fa-regular fa-clock", ev.time));

    return items.length ? `<div class="event-card__meta">${items.join("")}</div>` : "";
  }

  function buildCard(ev, index) {
    const delay = 1 + ((index || 0) % 3); // reveal-delay-1..3 (defined in main.css)
    const status = getStatus(ev, new Date());

    const speaker = ev.speaker
      ? `<p class="event-card__speaker">
           <i class="fa-solid fa-user" aria-hidden="true"></i>
           Guest speaker: ${escapeHtml(ev.speaker)}
         </p>`
      : "";

    const description = ev.description
      ? `<p class="event-card__description">${escapeHtml(ev.description)}</p>`
      : "";

    // Trusted author HTML (events-data.js is maintained by the site team).
    const note = ev.note ? `<p class="event-card__note">${ev.note}</p>` : "";

    return `
      <article class="event-card event-card--${status} reveal reveal-delay-${delay} card-lift" data-event-id="${escapeHtml(ev.id)}">
        <div class="event-card__image">
          <img src="${escapeHtml(ev.image)}" alt="" decoding="async" loading="lazy" />
        </div>
        ${buildDateBadge(ev)}
        <div class="event-card__body">
          <h3 class="event-card__title">${escapeHtml(ev.title)}</h3>
          ${buildMeta(ev)}
          ${speaker}
          ${description}
          ${note}
        </div>
      </article>`;
  }

  window.MBAEvents = {
    all() {
      return (window.MBA_EVENTS || []).slice();
    },
    sortByDateAsc,
    sortByDateDesc,
    getStatus,
    buildCard,
    formatShortDate
  };
})();
