/* ============================================================
   Events listing page controller
   - Tabs: upcoming / previous / all
   - Search across title, description, speaker, note, month, year
   - Pagination
   Depends on: events-data.js, events-render.js, main.js (optional)
   ============================================================ */
(function () {
  "use strict";

  const CARDS_PER_PAGE = 8; // 2 rows of 4

  const state = {
    filter: "all", // all | upcoming | previous (matches the active tab in events.html)
    query: "",
    page: 1,
    total: 0,
    totalPages: 1
  };

  const el = {};

  /* ---------- Data ---------- */
  function stripTags(html) {
    return String(html || "").replace(/<[^>]*>/g, " ");
  }

  function matchesQuery(ev, query) {
    const haystack = [ev.title, ev.description, ev.speaker, stripTags(ev.note), ev.month, ev.year]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return query
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .every((word) => haystack.includes(word));
  }

  function computeList() {
    const api = window.MBAEvents;
    const now = new Date();
    const all = api.all();
    const upcoming = () =>
      api.sortByDateAsc(all.filter((ev) => api.getStatus(ev, now) === "upcoming"));
    const previous = () =>
      api.sortByDateDesc(all.filter((ev) => api.getStatus(ev, now) === "previous"));

    let list;
    if (state.filter === "upcoming") list = upcoming();
    else if (state.filter === "previous") list = previous();
    else list = upcoming().concat(previous());

    return state.query ? list.filter((ev) => matchesQuery(ev, state.query)) : list;
  }

  /* ---------- Rendering ---------- */
  function updateCount() {
    if (state.total === 0) {
      el.count.textContent = "No events";
      return;
    }
    const label = state.total === 1 ? "1 event" : `${state.total} events`;
    el.count.textContent =
      state.totalPages > 1 ? `${label} – page ${state.page} of ${state.totalPages}` : label;
  }

  function updateEmptyState() {
    const message = el.empty.querySelector("p");
    if (message) {
      message.textContent = state.query
        ? `Nothing matches “${state.query}”. Check the spelling or clear the search.`
        : state.filter === "upcoming"
          ? "No upcoming events are scheduled yet. Check the Previous tab for earlier events."
          : "There are no events to show here.";
    }
    el.empty.hidden = state.total !== 0;
  }

  function pageRange(current, total) {
    const pages = new Set([1, total, current - 1, current, current + 1]);
    return Array.from(pages)
      .filter((p) => p >= 1 && p <= total)
      .sort((a, b) => a - b);
  }

  function makePageButton(content, page, { active = false, disabled = false, label } = {}) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "events-page-btn";
    btn.innerHTML = content;
    if (label) btn.setAttribute("aria-label", label);
    if (active) {
      btn.classList.add("is-active");
      btn.setAttribute("aria-current", "page");
    }
    if (disabled) btn.disabled = true;
    if (!disabled && !active) {
      btn.addEventListener("click", () => goToPage(page));
    }
    return btn;
  }

  function renderPagination() {
    const nav = el.pagination;
    nav.innerHTML = "";

    if (state.totalPages <= 1) {
      nav.hidden = true;
      return;
    }
    nav.hidden = false;

    nav.appendChild(
      makePageButton('<i class="fa-solid fa-chevron-left" aria-hidden="true"></i>', state.page - 1, {
        disabled: state.page === 1,
        label: "Previous page"
      })
    );

    const pages = pageRange(state.page, state.totalPages);
    pages.forEach((p, i) => {
      if (i > 0 && p - pages[i - 1] > 1) {
        const dots = document.createElement("span");
        dots.className = "events-page-ellipsis";
        dots.setAttribute("aria-hidden", "true");
        dots.textContent = "…";
        nav.appendChild(dots);
      }
      nav.appendChild(
        makePageButton(String(p), p, { active: p === state.page, label: `Page ${p}` })
      );
    });

    nav.appendChild(
      makePageButton('<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>', state.page + 1, {
        disabled: state.page === state.totalPages,
        label: "Next page"
      })
    );
  }

  function render() {
    const list = computeList();
    state.total = list.length;
    state.totalPages = Math.max(1, Math.ceil(list.length / CARDS_PER_PAGE));
    state.page = Math.min(Math.max(state.page, 1), state.totalPages);

    const start = (state.page - 1) * CARDS_PER_PAGE;
    el.grid.innerHTML = list
      .slice(start, start + CARDS_PER_PAGE)
      .map((ev, i) => window.MBAEvents.buildCard(ev, i))
      .join("");

    // Let main.js animate the freshly inserted cards; show them immediately if it is absent.
    if (typeof window.__mbaRevealRefresh === "function") {
      window.__mbaRevealRefresh();
    } else {
      el.grid.querySelectorAll(".reveal").forEach((n) => n.classList.add("visible", "is-revealed"));
    }

    updateEmptyState();
    updateCount();
    renderPagination();
  }

  function goToPage(page) {
    state.page = page;
    render();
    const top = el.grid.getBoundingClientRect().top + window.scrollY - 160;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  /* ---------- Events ---------- */
  function setFilter(filter, { focus = false } = {}) {
    if (!filter || filter === state.filter) return;
    state.filter = filter;
    state.page = 1;

    el.tabButtons.forEach((tab) => {
      const active = tab.dataset.filter === filter;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    render();
  }

  function bindTabs() {
    el.tabButtons = Array.from(el.tabs.querySelectorAll(".events-tab"));
    el.tabButtons.forEach((tab) => {
      tab.tabIndex = tab.classList.contains("is-active") ? 0 : -1;
    });

    el.tabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".events-tab");
      if (btn) setFilter(btn.dataset.filter);
    });

    // Arrow-key navigation between tabs (standard tablist behaviour).
    el.tabs.addEventListener("keydown", (e) => {
      const keys = { ArrowRight: 1, ArrowLeft: -1 };
      const current = el.tabButtons.findIndex((t) => t.classList.contains("is-active"));
      let next = current;
      if (e.key in keys) next = (current + keys[e.key] + el.tabButtons.length) % el.tabButtons.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = el.tabButtons.length - 1;
      else return;

      e.preventDefault();
      setFilter(el.tabButtons[next].dataset.filter, { focus: true });
    });
  }

  function bindSearch() {
    let timer;
    el.search.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        state.query = el.search.value.trim();
        state.page = 1;
        render();
      }, 180);
    });
  }

  // Missing/broken image → show the branded placeholder instead of a broken icon.
  function bindImageFallback() {
    el.grid.addEventListener(
      "error",
      (e) => {
        if (e.target.tagName !== "IMG") return;
        e.target.closest(".event-card__image")?.classList.add("is-broken");
        e.target.remove();
      },
      true
    );
  }

  /* ---------- Init ---------- */
  function init() {
    el.grid = document.getElementById("eventsGrid");
    el.empty = document.getElementById("eventsEmpty");
    el.count = document.getElementById("eventsCount");
    el.pagination = document.getElementById("eventsPagination");
    el.search = document.getElementById("eventsSearch");
    el.tabs = document.querySelector(".events-tabs");

    if (!el.grid || !el.empty || !el.count || !el.pagination || !el.search || !el.tabs) return;

    if (!window.MBAEvents) {
      el.count.textContent = "Events could not be loaded.";
      return;
    }

    bindTabs();
    bindSearch();
    bindImageFallback();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
