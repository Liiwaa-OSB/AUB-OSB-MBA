/* ============================================================
   Events data – the ONLY file you need to edit to add/change events.
   Exposes window.MBA_EVENTS (read by events-render.js / events-page.js).

   Fields
   - id            unique slug
   - title, description, speaker
   - startDate     "YYYY-MM-DDTHH:mm:ss" (required – drives upcoming/past + sorting)
   - endDate       optional; the event counts as upcoming until this passes
   - day/month/year  text shown on the date badge ("28–31" for ranges)
   - displayDate   optional override for the date line (e.g. non-consecutive sessions)
   - time, venue, booth, format, targetAudience
   - image         cover image path, or "" when there is none yet (branded placeholder is shown)
   - gallery       optional array of image paths shown on the event page
   - photosLink    optional URL to a full photo album
   - photoCredit   optional photo credit line
   - highlights    array of bullet points
   - registerLink  optional http(s)/mailto URL. Shows a "Register" button on the event page
                   while the event is upcoming and the deadline has not passed.
   - registrationDeadline  optional. "YYYY-MM-DD" (valid through end of that day) or a full
                   "YYYY-MM-DDTHH:mm:ss". If empty, registration closes when the event starts.
   ============================================================ */
window.MBA_EVENTS = [
  {
    id: "mba-advising-session-fall-2026-2027",
    title: "MBA Advising Session – Fall 2026–2027 Incoming Cohort",
    startDate: "2026-07-22T17:30:00",
    endDate: "2026-07-22T18:30:00",
    day: "22",
    month: "Jul",
    year: "2026",
    time: "5:30 PM – 6:30 PM",
    speaker: "",
    description: "The MBA Advising Session was organized for the incoming Fall 2026–2027 MBA cohort to introduce students to the program and provide them with essential academic and administrative information ahead of the start of the academic year. The session covered the MBA program structure, curriculum, academic requirements, and course registration. It also provided students with the opportunity to ask questions, clarify expectations, and better understand the resources and requirements that will guide them throughout their MBA journey.",
    image: "images/AUB-OSB-MBA-Events-Advising-6-7.jpeg",
    venue: "Room 425, Suliman S. Olayan School of Business (OSB), AUB",
    format: "In Person",
    highlights: [
      "Introduced the incoming cohort to the MBA program structure, curriculum, and academic expectations.",
      "Provided guidance on course registration and academic requirements.",
      "Clarified important program policies, procedures, and administrative guidelines.",
      "Addressed students' questions and concerns ahead of the academic year.",
      "Helped students prepare for a smooth transition into the Fall 2026–2027 MBA program."
    ]
  },
  {
    id: "career-readiness-program-2026-10-15",
    title: "Career Readiness Program (CRP)",
    startDate: "2026-10-15T17:30:00",
    endDate: "",
    day: "15",
    month: "Oct",
    year: "2026",
    time: "5:30 PM",
    speaker: "",
    description: "The Career Readiness Program (CRP) session introduced MBA students to the program's objectives, structure, and opportunities. Organized by the Suliman S. Olayan School of Business, the session highlighted how the CRP bridges the gap between academic learning and professional practice by allowing students to apply their knowledge and skills to real-world business challenges through practical, company-based projects. It also provided students with an overview of the program's expectations, timeline, and potential engagement with participating organizations.",
    image: "images/AUB-OSB-MBA-Events-CRP.jpg",
    venue: "OSB Room 334",
    format: "In Person",
    highlights: [
      "Introduced students to the objectives and structure of the Career Readiness Program.",
      "Explained how students can apply their academic knowledge to real-world business challenges.",
      "Highlighted opportunities to collaborate with companies through practical, supervised projects.",
      "Provided an overview of program expectations, deliverables, and timeline.",
      "Emphasized the importance of developing professional, analytical, and problem-solving skills.",
      "Highlighted the program's role in preparing MBA students for future career opportunities."
    ]
  },
  {
    id: "thinking-like-an-entrepreneur-2026-10-16",
    title: "Thinking Like an Entrepreneur with Christine Aswad",
    startDate: "2026-10-16T18:00:00",
    endDate: "",
    day: "16",
    month: "Oct",
    year: "2026",
    time: "6:00 PM",
    speaker: "Christine Aswad",
    description: "The MBA Talking Series offers students the opportunity to learn from experienced business professionals and entrepreneurs. This session explored entrepreneurial thinking, business opportunities, and decision-making, providing students with practical insights into navigating the business world.",
    image: "images/AUB-OSB-MBA-Events-Entrepreneur-Christine-Aswad.jpg",
    venue: "OSB Room 334",
    format: "Hybrid",
    // photoCredit: "Photos were taken by George and Tarek.",
    highlights: [
      "Gained insights into entrepreneurial thinking and identifying business opportunities.",
      "Explored practical approaches to business decision-making.",
      "Connected academic learning with real-world business experiences."
    ]
  },
  {
    id: "lebanese-industry-expo-2026",
    title: "Lebanese Industry Expo 2026",
    startDate: "2026-10-28T15:00:00",
    endDate: "2026-10-31T21:00:00",
    day: "28–31",
    month: "Oct",
    year: "2026",
    time: "3:00 PM – 9:00 PM",
    speaker: "",
    description: "The Suliman S. Olayan School of Business (OSB) participated in the Lebanese Industry Expo 2026, held at Seaside Arena from October 28 to 31. The event provided OSB with an opportunity to showcase its graduate programs, connect with prospective students and professionals, and raise awareness about the School's academic offerings. Throughout the four days, the OSB team engaged with visitors, shared information about its programs, and highlighted the opportunities available to individuals interested in advancing their education and professional careers.",
    image: "images/AUB-OSB-MBA-Events-LebaneseIndustryExpo-26.jpg",
    venue: "Seaside Arena, Beirut, Lebanon",
    booth: "Stand G42",
    format: "In Person",
    highlights: [
      "Represented the Suliman S. Olayan School of Business at the Lebanese Industry Expo 2026.",
      "Promoted OSB graduate programs and provided visitors with information about available academic opportunities.",
      "Engaged with prospective students and professionals interested in pursuing graduate studies.",
      "Increased awareness of OSB's programs and academic offerings among the wider Lebanese community.",
      "Created opportunities to connect with potential applicants and strengthen OSB's visibility."
    ]
  },
  {
    id: "mba-leadership-workshop-2026-11-06",
    title: "From Manager to Enterprise Leader",
    startDate: "2026-11-06T18:00:00",
    endDate: "2026-11-06T21:00:00",
    day: "6",
    month: "Nov",
    year: "2026",
    time: "6:00 PM – 9:00 PM",
    speaker: "Mr. Karim Dimitri",
    description: "The MBA Leadership Workshop focused on strengthening students' leadership capabilities, strategic judgment, and ability to lead effectively across functions. Titled \"From Manager to Enterprise Leader: Empowering, Influencing and Leading Through Others,\" the workshop explored the transition from functional management to enterprise leadership, emphasizing strategic decision-making, cross-functional collaboration, influencing without formal authority, and empowering teams to achieve results. Led by Mr. Karim Dimitri, the highly interactive session combined evidence-based leadership concepts with real-world executive experience through practical insights, leadership dilemmas, group discussions, video illustrations, and experiential coaching exercises.",
    image: "images/AUB-OSB-MBA-Events-Karim-Dimitri-Photo.png",
    venue: "OSB Room 333",
    registerLink: "",
    registrationDeadline: "",
    format: "In Person",
    highlights: [
      "Explored the transition from functional management to enterprise leadership.",
      "Strengthened understanding of strategic judgment and cross-functional collaboration.",
      "Examined ways to influence others and lead effectively without formal authority.",
      "Highlighted the importance of empowering teams and achieving results through others.",
      "Engaged in practical leadership discussions, dilemmas, and coaching exercises.",
      "Encouraged participants to reflect on their leadership styles and identify areas for professional development."
    ]
  },
  {
    id: "mba-communication-skills-workshop-2026-11",
    title: "MBA Communication Skills Workshop",
    startDate: "2026-11-06T18:00:00",
    endDate: "2026-11-13T20:30:00",
    day: "6 & 13",
    month: "Nov",
    year: "2026",
    displayDate: "Nov 6 & 13, 2026",
    time: "6:00 PM – 8:30 PM",
    speaker: "",
    description: "The MBA Communication Skills Workshop was designed to strengthen the professional communication and leadership capabilities of newly enrolled Fall 2026–2027 MBA students. The mandatory workshop highlighted the importance of effective communication as a key driver of career growth, workplace performance, and professional success. Through a hands-on approach, the workshop bridged theoretical knowledge with practical application, equipping students with essential communication skills across written, visual, and oral formats. It aimed to enhance students' ability to communicate effectively in business settings while strengthening their professionalism, academic performance, and leadership capabilities.",
    image: "images/AUB-OSB-MBA-Events-Communication-Skills-Workshop.jpeg",
    venue: "OSB Room 340",
    registerLink: "",
    registrationDeadline: "",
    format: "In Person",
    targetAudience: "New Fall 2026–2027 MBA Students",
    highlights: [
      "Strengthened students' written, visual, and oral communication skills.",
      "Highlighted the role of effective communication in career development and workplace success.",
      "Provided practical tools and techniques for communicating professionally in business contexts.",
      "Connected communication theory with real-world business applications.",
      "Enhanced students' confidence in expressing ideas and communicating with different audiences.",
      "Supported the professional and leadership development of the incoming MBA cohort."
    ]
  }
];