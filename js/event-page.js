/* ============================================================
   Single event page controller (event.html?id=<event id>)
   Depends on: events-data.js, events-render.js
   ============================================================ */
(function () {
  "use strict";

  const A = window.MBAEvents;

  const $ = (id) => document.getElementById(id);

  function esc(v) {
    return A.escapeHtml(v);
  }

  function chip(icon, text) {
    return text ? `<span class="event-chip"><i class="${icon}" aria-hidden="true"></i>${esc(text)}</span>` : "";
  }

  function fmtDeadline(d) {
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }

  function fmtDeadlineTime(d) {
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }

  /* ---------- Registration block (hero + sidebar share it) ---------- */
  function registrationHtml(ev) {
    const reg = A.getRegistration(ev);
    if (reg.state === "none") return "";

    if (reg.state === "closed") {
      return `<p class="event-reg-note event-reg-note--closed">
                <i class="fa-regular fa-circle-xmark" aria-hidden="true"></i> Registration is closed
              </p>`;
    }

    const when = reg.deadline
      ? `<p class="event-reg-note"><i class="fa-regular fa-clock" aria-hidden="true"></i>
           Register by ${esc(fmtDeadline(reg.deadline))}${/^\d{4}-\d{2}-\d{2}$/.test(String(ev.registrationDeadline || "").trim()) ? "" : " at " + esc(fmtDeadlineTime(reg.deadline))}
         </p>`
      : "";

    return `
      <a class="btn btn-primary event-register" href="${esc(reg.link)}" target="_blank" rel="noopener">
        <i class="fa-solid fa-pen-to-square" aria-hidden="true"></i> Register now
      </a>${when}`;
  }

  /* ---------- Hero ---------- */
  function renderHero(ev) {
    const status = A.getStatus(ev);
    const bg = $("eventHeroBg");
    const img = A.realImage(ev.image);
    const reg = registrationHtml(ev);
    if (bg && img) {
      bg.style.setProperty("--event-hero-image", `url("${img.replace(/["\\\n]/g, encodeURIComponent)}")`);
      bg.classList.add("has-image");
    }

    $("eventCrumb").textContent = ev.title;

    $("eventHero").innerHTML = `
      <div class="event-kicker event-kicker--${status}">${status === "upcoming" ? "Upcoming event" : "Past event"}</div>
      <h1>${esc(ev.title)}</h1>
      <div class="event-chips">
        ${chip("fa-regular fa-calendar", A.dateLabel(ev))}
        ${chip("fa-regular fa-clock", ev.time)}
        ${chip("fa-solid fa-location-dot", ev.venue)}
        ${chip("fa-solid fa-users", ev.format)}
      </div>
      ${reg ? `<div class="event-hero__actions">${reg}</div>` : ""}`;

  }

  /* ---------- Body ---------- */
  function detailRow(icon, label, value) {
    return value
      ? `<div class="event-facts__row">
           <dt><i class="${icon}" aria-hidden="true"></i>${esc(label)}</dt>
           <dd>${esc(value)}</dd>
         </div>`
      : "";
  }

  function renderBody(ev) {
    const img = A.realImage(ev.image);
    const gallery = (Array.isArray(ev.gallery) ? ev.gallery : []).map(A.realImage).filter(Boolean);
    const photosLink = A.cleanLink(ev.photosLink);

    const paragraphs = String(ev.description || "")
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p>${esc(p)}</p>`)
      .join("");

    const highlights =
      Array.isArray(ev.highlights) && ev.highlights.length
        ? `<section class="event-block">
             <div class="section-header"><h2>Highlights</h2></div>
             <ul class="event-highlights">
               ${ev.highlights.map((h) => `<li><i class="fa-solid fa-check" aria-hidden="true"></i><span>${esc(h)}</span></li>`).join("")}
             </ul>
           </section>`
        : "";

    const photos =
      gallery.length || photosLink || ev.photoCredit
        ? `<section class="event-block">
             <div class="section-header"><h2>Event photos</h2></div>
             ${gallery.length ? `<div class="event-gallery">${gallery.map((src) => `<img src="${esc(src)}" alt="" loading="lazy" decoding="async" />`).join("")}</div>` : ""}
             ${ev.photoCredit ? `<p class="event-credit">${esc(ev.photoCredit)}</p>` : ""}
             ${photosLink ? `<a class="btn btn-outline-dark" href="${esc(photosLink)}" target="_blank" rel="noopener"><i class="fa-regular fa-images" aria-hidden="true"></i> View all photos</a>` : ""}
           </section>`
        : "";

    const venue = ev.booth && ev.venue ? `${ev.venue} · ${ev.booth}` : ev.venue;
    const sideReg = registrationHtml(ev);

    $("eventDetail").innerHTML = `
      <div class="event-layout">
        <article class="event-main">
          ${img ? `<figure class="event-cover"><img src="${esc(img)}" alt="${esc(ev.title)}" decoding="async" /></figure>` : ""}
          <section class="event-block">
            <div class="section-header"><h2>About this event</h2></div>
            <div class="event-prose">${paragraphs || "<p>Details will be shared soon.</p>"}</div>
          </section>
          ${highlights}
          ${photos}
        </article>

        <aside class="event-side" aria-label="Event details">
          <div class="event-card-info">
            <h2 class="content-card-title">Event details</h2>
            <dl class="event-facts">
              ${detailRow("fa-regular fa-calendar", "Date", A.dateLabel(ev))}
              ${detailRow("fa-regular fa-clock", "Time", ev.time)}
              ${detailRow("fa-solid fa-location-dot", "Venue", venue)}
              ${detailRow("fa-solid fa-users", "Format", ev.format)}
              ${detailRow("fa-solid fa-user", "Speaker", ev.speaker)}
              ${detailRow("fa-solid fa-user-graduate", "Audience", ev.targetAudience)}
            </dl>
            ${sideReg ? `<div class="event-side__reg">${sideReg}</div>` : ""}
            <a class="text-link event-side__back" href="events.html"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> All events</a>
          </div>
        </aside>
      </div>`;

    // Broken cover / gallery images disappear instead of showing a broken icon.
    $("eventDetail").addEventListener(
      "error",
      (e) => {
        if (e.target.tagName !== "IMG") return;
        (e.target.closest(".event-cover") || e.target).remove();
      },
      true
    );
  }

  /* ---------- More events ---------- */
  function renderMore(current) {
    const now = new Date();
    const others = A.all().filter((ev) => ev.id !== current.id);
    const upcoming = A.sortByDateAsc(others.filter((ev) => A.getStatus(ev, now) === "upcoming"));
    const past = A.sortByDateDesc(others.filter((ev) => A.getStatus(ev, now) === "past"));
    const picks = upcoming.concat(past).slice(0, 4);
    if (!picks.length) return;

    $("eventMoreGrid").innerHTML = picks.map((ev, i) => A.buildCard(ev, i)).join("");
    $("eventMore").hidden = false;

    if (typeof window.__mbaRevealRefresh === "function") window.__mbaRevealRefresh();
    else $("eventMoreGrid").querySelectorAll(".reveal").forEach((n) => n.classList.add("visible", "is-revealed"));

    $("eventMoreGrid").addEventListener(
      "error",
      (e) => {
        if (e.target.tagName !== "IMG") return;
        e.target.closest(".event-card__image")?.classList.add("is-broken");
        e.target.remove();
      },
      true
    );
  }

  /* ---------- Not found ---------- */
  function renderNotFound() {
    document.title = "Event not found | AUB OSB MBA";
    $("eventCrumb").textContent = "Not found";
    $("eventHero").innerHTML = `<h1>Event not found</h1>
      <p class="event-hero__lead">We couldn’t find the event you’re looking for. It may have been moved or removed.</p>
      <div class="event-hero__actions"><a class="btn btn-primary" href="events.html">Browse all events</a></div>`;
    $("eventDetail").innerHTML = "";
    const section = document.querySelector(".event-detail");
    if (section) section.hidden = true;
  }

  function init() {
    if (!A || !$("eventHero") || !$("eventDetail")) return;

    const id = new URLSearchParams(window.location.search).get("id");
    const ev = id ? A.getById(id) : null;

    if (!ev) return renderNotFound();

    document.title = `${ev.title} | AUB OSB MBA Events`;
    renderHero(ev);
    renderBody(ev);
    renderMore(ev);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
