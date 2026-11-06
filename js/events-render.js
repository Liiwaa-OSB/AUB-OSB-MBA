/* ============================================================
   Shared event helpers + card renderer
   Used by index.html, events.html and event.html.
   Exposes window.MBAEvents.

   Cards show image, date badge, title and the icon info lines
   (date, time, venue, format, speaker) – no description text. The whole card is a link to event.html?id=<id>.
   ============================================================ */
(function () {
  "use strict";

  const DETAIL_PAGE = "event.html";

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

  /* ---------- Status ---------- */
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

  /* ---------- Registration ----------
     Button shows only when ALL of these hold:
       1. the event has a valid registerLink (http/https/mailto)
       2. the event has not ended
       3. the deadline has not passed
     Deadline = registrationDeadline if given, otherwise the event's start.
     A date-only deadline ("2026-11-05") is valid through the end of that day. */
  function parseDeadline(value) {
    if (!value) return null;
    const s = String(value).trim();
    return toDate(/^\d{4}-\d{2}-\d{2}$/.test(s) ? s + "T23:59:59" : s);
  }

  function cleanLink(value) {
    const v = String(value || "").trim();
    return /^(https?:\/\/|mailto:)/i.test(v) ? v : "";
  }

  function getRegistration(ev, now) {
    now = now || new Date();
    const link = cleanLink(ev.registerLink);
    if (!link) return { state: "none" };
    if (getStatus(ev, now) === "past") return { state: "none" };

    const deadline = parseDeadline(ev.registrationDeadline) || parseStart(ev);
    if (deadline && now > deadline) return { state: "closed", link, deadline };
    return { state: "open", link, deadline };
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

  function dateLabel(ev) {
    return ev.displayDate || (ev.isTBD ? "Date to be announced" : formatShortDate(ev.startDate, ev.endDate));
  }

  /* ---------- Helpers ---------- */
  /* Ignore empty values and "[link]" / "[To be added]" style placeholders. */
  function realImage(value) {
    const v = String(value || "").trim();
    return v && !/^\[.*\]$/.test(v) ? v : "";
  }

  function eventUrl(ev) {
    return `${DETAIL_PAGE}?id=${encodeURIComponent(ev.id || "")}`;
  }

  function all() {
    return (window.MBA_EVENTS || []).slice();
  }

  function getById(id) {
    return all().find((ev) => ev.id === id) || null;
  }

  /* ---------- Card ---------- */
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

    const isRange = /[–&-]/.test(ev.day || "");
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
    const label = dateLabel(ev);
    if (label) items.push(buildMetaItem("fa-regular fa-calendar", label));
    if (ev.time) items.push(buildMetaItem("fa-regular fa-clock", ev.time));
    if (ev.venue) items.push(buildMetaItem("fa-solid fa-location-dot", ev.booth ? `${ev.venue} · ${ev.booth}` : ev.venue));
    if (ev.format) items.push(buildMetaItem("fa-solid fa-users", ev.format));
    if (ev.targetAudience) items.push(buildMetaItem("fa-solid fa-user-graduate", ev.targetAudience));
    return items.length ? `<div class="event-card__meta">${items.join("")}</div>` : "";
  }

  function buildCard(ev, index) {
    const delay = 1 + ((index || 0) % 3); // reveal-delay-1..3 (defined in main.css)
    const status = getStatus(ev, new Date());
    const image = realImage(ev.image);

    const speaker = ev.speaker
      ? `<p class="event-card__speaker">
           <i class="fa-solid fa-user" aria-hidden="true"></i>
           Guest speaker: ${escapeHtml(ev.speaker)}
         </p>`
      : "";

    return `
      <a class="event-card event-card--${status} reveal reveal-delay-${delay} card-lift"
         href="${escapeHtml(eventUrl(ev))}" data-event-id="${escapeHtml(ev.id)}">
        <div class="event-card__image${image ? "" : " is-broken"}">
          ${image ? `<img src="${escapeHtml(image)}" alt="" decoding="async" loading="lazy" />` : ""}
        </div>
        ${buildDateBadge(ev)}
        <div class="event-card__body">
          <h3 class="event-card__title">${escapeHtml(ev.title)}</h3>
          ${buildMeta(ev)}
          ${speaker}
        </div>
      </a>`;
  }

  window.MBAEvents = {
    all,
    getById,
    sortByDateAsc,
    sortByDateDesc,
    getStatus,
    getRegistration,
    buildCard,
    formatShortDate,
    dateLabel,
    realImage,
    cleanLink,
    eventUrl,
    escapeHtml
  };
})();
