/* ============================================================
   MBA EVENTS DATA
   ------------------------------------------------------------
   To add an event: append one object to the array below.
   Fields:
     id           unique string
     title        card title
     startDate    ISO date-time string (used for sorting/status)
     endDate      optional ISO string for multi-day events
     displayDate  human-readable date (fallback if format differs)
     day          day text on badge, e.g. "16" or "28–31"
     month        3-letter month, e.g. "Oct"
     year         year string
     time         time label, e.g. "6:00 PM"
     speaker      optional speaker name
     description  body text
     note         optional italic note (HTML allowed for <strong>)
     image        image path
     status       "upcoming" | "past"  (derived at runtime if omitted)
     isTBD        true for events without a confirmed date (always "upcoming")
   ============================================================ */
window.MBA_EVENTS = [
  {
    id: "series-talks-oct-2026",
    title: "MBA Series Talks",
    startDate: "2026-10-16T18:00:00",
    endDate: "2026-10-16T19:30:00",
    day: "16",
    month: "Oct",
    year: "2026",
    time: "6:00 PM",
    speaker: "Christine Aswad",
    description:
      "A talking series offering MBA students a real-world perspective on investment decision-making, entrepreneurial thinking, and the mindset behind successful investing.",
    image: "images/AUB-OSB-MBA-talk.jpg"
  },
  {
    id: "lebanese-industry-expo-2026",
    title: "Lebanese Industry Expo 2026",
    startDate: "2026-10-28T15:00:00",
    endDate: "2026-10-31T21:00:00",
    day: "28–31",
    month: "Oct",
    year: "2026",
    time: "3:00 PM–9:00 PM",
    description:
      "The MBA will be participating with a booth at the Lebanese Industry Expo 2026, taking place over four days in late October.",
    image: "images/AUB-OSB-MBA-industry-expo.jpg"
  },
  {
    id: "omba-fall1-advising",
    title: "OMBA Fall 1 Advising Session",
    startDate: "2026-10-19T17:30:00",
    endDate: "2026-10-19T19:00:00",
    day: "19",
    month: "Oct",
    year: "2026",
    time: "5:30 PM",
    speaker: "Dina Eido",
    description: "",
    note: "This event is <strong>only for those enrolled in the term.</strong>",
    image: "images/AUB-OSB-MBA-advising.jpg"
  },
  {
    id: "omba-info-session",
    title: "OMBA Info Session",
    startDate: "",
    day: "TBD",
    month: "Date",
    year: "2026",
    time: "",
    description: "Details about the OMBA Info Session will be announced soon.",
    image: "images/AUB-OSB-MBA-info-session.jpg",
    isTBD: true
  },
  /* ---- past events (example) ---- */
  {
    id: "career-bootcamp-summer-2026",
    title: "MBA Career Bootcamp",
    startDate: "2026-06-12T09:00:00",
    endDate: "2026-06-12T17:00:00",
    day: "12",
    month: "Jun",
    year: "2026",
    time: "9:00 AM–5:00 PM",
    description:
      "A full-day career readiness bootcamp covering CV review, interview practice, and employer networking.",
    image: "images/AUB-OSB-MBA-advising.jpg"
  },
  {
    id: "alumni-panel-spring-2026",
    title: "Alumni Panel — Consulting Careers",
    startDate: "2026-04-04T18:00:00",
    endDate: "2026-04-04T20:00:00",
    day: "04",
    month: "Apr",
    year: "2026",
    time: "6:00 PM",
    speaker: "OSB Alumni Panel",
    description:
      "Hear from OSB alumni now working in consulting across the MENA region.",
    image: "images/AUB-OSB-MBA-industry-expo.jpg"
  }
];