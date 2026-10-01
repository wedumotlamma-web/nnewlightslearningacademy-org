export const PHONE = "3978977";
export const PHONE_TEL = "+2673978977";
export const WHATSAPP_NUMBER = "78733300";
export const WHATSAPP_INTL = "26778733300";
export const EMAIL = "info.newlightsacademy@gmail.com";
export const ADDRESS_LINES = [
  "Plot 825 Masetlheng Ward, Along Zeerust Road, Tlokweng,",
  "PO Box 45325 Riverwalk, Gaborone, Botswana",
];
export const TAGLINE = "Building Strong Foundations For Bright Futures!";

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_INTL}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export type WhatsAppTemplate = {
  label: string;
  message: string;
};

export const whatsappTemplates: WhatsAppTemplate[] = [
  {
    label: "Book a free assessment",
    message:
      "Hello New-Lights Learning Academy, I'd like to book a free assessment for my child. Learner's grade: ____. Preferred day/time: ____.",
  },
  {
    label: "Ask about fees",
    message:
      "Hello New-Lights Learning Academy, please send me the fees and payment options for your programmes. My child is in Grade ____.",
  },
  {
    label: "Homeschooling enquiry",
    message:
      "Hello New-Lights Learning Academy, I'm interested in your full homeschooling programme. My child is in Grade ____ and we'd like to start in ____.",
  },
  {
    label: "Cambridge IGCSE",
    message:
      "Hello New-Lights Learning Academy, I'd like to enquire about your Cambridge IGCSE programme. My child is in Year/Form ____ and the subjects we need are ____.",
  },
  {
    label: "Exam preparation",
    message:
      "Hello New-Lights Learning Academy, I'd like exam preparation support (PSLE / JCE / BGCSE / IGCSE). Subjects needed: ____.",
  },
  {
    label: "Timetable & availability",
    message:
      "Hello New-Lights Learning Academy, what days and times are available for after-school tuition? My child is in Grade ____.",
  },
];

export type Programme = {
  slug: string;
  title: string;
  short: string;
  intro: string;
  highlights: string[];
  curriculum: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  whatsappMessage: string;
};

export const programmes: Programme[] = [
  {
    slug: "after-school-tuition",
    title: "After-school tuition",
    short:
      "Small groups of no more than six learners for Maths, English, Science and Setswana, with weekly progress feedback to parents.",
    intro:
      "Afternoon sessions that turn homework struggle into steady progress. Learners work in capped groups so every question is heard and every gap is closed before it grows.",
    highlights: [
      "Maximum six learners per group",
      "Weekly written feedback to parents",
      "Homework supervision included",
      "Sessions Monday to Friday, 14:00–18:00",
    ],
    curriculum: [
      { title: "Mathematics", body: "Number sense, algebra, geometry and problem-solving aligned to the learner's grade, with weekly drills." },
      { title: "English", body: "Comprehension, grammar, vocabulary building and structured writing practice." },
      { title: "Science", body: "Core concepts, practical explanations and past-paper style questions." },
      { title: "Setswana", body: "Reading fluency, comprehension and composition support." },
    ],
    faqs: [
      { q: "How many days a week can my child attend?", a: "Anything from one to five afternoons. Most families start with two or three subject sessions per week." },
      { q: "Do you help with school homework?", a: "Yes. Homework supervision is part of every session, though our focus stays on closing underlying gaps." },
      { q: "How do you track progress?", a: "Each learner has a written record, and you receive weekly feedback plus a termly summary." },
    ],
    whatsappMessage:
      "Hello New-Lights Learning Academy, I'd like to enquire about after-school tuition. My child is in Grade ____ and needs help with ____.",
  },
  {
    slug: "cambridge-igcse",
    title: "Cambridge IGCSE",
    short:
      "Cambridge IGCSE tuition and full-curriculum support for Years 9-11, taught to the Cambridge syllabus with past-paper practice and coursework support.",
    intro:
      "An international pathway for learners who want Cambridge qualifications. We teach to the published Cambridge syllabus, prepare learners for both the Core and Extended tiers, and keep the coursework and practical requirements on track.",
    highlights: [
      "Taught to the current Cambridge IGCSE syllabus",
      "Core and Extended tiers supported",
      "Past-paper drills against official mark schemes",
      "Coursework and practical support",
      "Prepared for the May/June and Oct/Nov exam series",
    ],
    curriculum: [
      { title: "Mathematics", body: "Cambridge IGCSE Mathematics at Core or Extended tier, including the calculator and non-calculator papers." },
      { title: "English", body: "English as a First Language and English as a Second Language, covering reading, directed writing and the speaking component." },
      { title: "Sciences", body: "Combined and Coordinated Sciences, plus separate Biology, Chemistry and Physics, with practical paper preparation." },
      { title: "Commercial subjects", body: "Business Studies and Accounting taught with structured case-study and question practice." },
      { title: "ICT & Computer Science", body: "Practical ICT tasks and Computer Science theory and programming components." },
      { title: "Humanities", body: "Geography and History, with source work, case studies and essay technique." },
    ],
    faqs: [
      { q: "How does IGCSE differ from BGCSE?", a: "IGCSE is the Cambridge International qualification, recognised worldwide for university entry. BGCSE follows the Botswana national curriculum. The IGCSE route suits families planning to study abroad or already in an international school." },
      { q: "Can my child transfer mid-year?", a: "Yes. We assess what has already been covered against the syllabus and build a catch-up plan for the remaining topics." },
      { q: "Which exam centre do learners sit at?", a: "Learners are entered through a registered Cambridge exam centre in Gaborone. We guide you through registration and deadlines." },
      { q: "How many subjects should we take?", a: "Most learners take between five and eight subjects. We advise on a combination that fits your child's ability and intended career path." },
      { q: "What are the fees and registration deadlines?", a: "Tuition is quoted per subject, and Cambridge entry fees are paid separately to the exam centre. Entries usually close several months before each series — contact us for current fees and dates." },
    ],
    whatsappMessage:
      "Hello New-Lights Learning Academy, I'd like to enquire about Cambridge IGCSE. My child is in Year/Form ____ and the subjects we need are ____.",
  },
  {
    slug: "exam-preparation",
    title: "Exam preparation",
    short:
      "Focused revision, past-paper drills and timed practice for end-of-year, PSLE, JCE, BGCSE and Cambridge IGCSE examinations.",
    intro:
      "Structured revision built around the real examination papers. Learners practise under timed conditions, learn mark-scheme thinking and walk into the exam room prepared.",
    highlights: [
      "PSLE, JCE, BGCSE and Cambridge IGCSE focus",
      "Past-paper drills every session",
      "Timed mock examinations",
      "Examination technique and time management",
    ],
    curriculum: [
      { title: "Diagnostic mock", body: "Learners sit a full past paper so revision starts from measured weaknesses, not guesswork." },
      { title: "Topic revision", body: "Targeted re-teaching of the topics that lost the most marks, with worked examples." },
      { title: "Paper drills", body: "Weekly timed sections marked against the official mark scheme." },
      { title: "Final push", body: "Intensive revision, memory strategies and exam-day preparation in the last weeks." },
    ],
    faqs: [
      { q: "When should we start?", a: "Ideally two terms before the examination, but we also run short intensive blocks closer to the date." },
      { q: "Which subjects do you cover?", a: "Core subjects for each level, including Maths, English, Science, Setswana, Cambridge IGCSE subjects and commercial subjects on request." },
      { q: "Do you give mock results?", a: "Yes — every mock is marked and returned with a written breakdown of marks gained and lost." },
    ],
    whatsappMessage:
      "Hello New-Lights Learning Academy, I'd like exam preparation for my child. Examination: ____ (PSLE / JCE / BGCSE / IGCSE). Subjects: ____.",
  },
  {
    slug: "full-homeschooling",
    title: "Full homeschooling",
    short:
      "A structured full-curriculum day programme with qualified facilitators, termly reports and portfolio record-keeping, with a Cambridge IGCSE pathway available.",
    intro:
      "A complete school day at the centre, without the crowded classroom. Facilitators teach the full curriculum, keep formal records and involve you at every stage.",
    highlights: [
      "Full-day timetable or blended centre/home schedule",
      "National curriculum or Cambridge IGCSE pathway",
      "Qualified facilitators for all core subjects",
      "Portfolio and record-keeping for assessments",
      "Termly written reports and parent meetings",
    ],
    curriculum: [
      { title: "Core academics", body: "Mathematics, English, Science and Setswana taught daily to the national curriculum." },
      { title: "Cambridge IGCSE pathway", body: "Families who prefer an international route can follow the Cambridge IGCSE syllabus instead, with entry through a registered exam centre." },
      { title: "Wider subjects", body: "Social studies, technology, creative and practical subjects appropriate to the grade." },
      { title: "Assessment portfolio", body: "Continuous assessment records, projects and tests filed for each learner." },
      { title: "Enrichment", body: "Group projects, outings and social activities so learners stay connected to peers." },
    ],
    faqs: [
      { q: "Is homeschooling recognised?", a: "We follow the national curriculum and keep the assessment records and portfolios required for registration and progression." },
      { q: "Can we follow Cambridge IGCSE instead?", a: "Yes. Learners can homeschool on the Cambridge IGCSE syllabus and sit their examinations through a registered Cambridge centre in Gaborone." },
      { q: "Can my child attend part-time?", a: "Yes. Many families choose a blended schedule of centre days with guided work at home." },
      { q: "What are the daily hours?", a: "The standard homeschooling day runs Monday to Friday, 08:00–14:00, with optional afternoon support." },
    ],
    whatsappMessage:
      "Hello New-Lights Learning Academy, I'm interested in full homeschooling. My child is in Grade ____ and we'd like to start in ____.",
  },
  {
    slug: "foundation-numeracy-literacy",
    title: "Foundation numeracy & literacy",
    short:
      "Targeted catch-up support for early primary learners who need to rebuild confidence in reading and number work.",
    intro:
      "Gentle, structured catch-up for our youngest learners. We rebuild reading and number confidence step by step, at a pace that keeps children willing to try.",
    highlights: [
      "Standards 1–4 focus",
      "Phonics and reading fluency",
      "Concrete, hands-on number work",
      "Short sessions to match young attention spans",
    ],
    curriculum: [
      { title: "Phonics & decoding", body: "Sound-letter work that gives learners a reliable strategy for unfamiliar words." },
      { title: "Reading fluency", body: "Guided reading with graded books and comprehension conversation." },
      { title: "Number sense", body: "Counting, place value and the four operations using concrete apparatus first." },
      { title: "Writing", body: "Handwriting, sentence building and simple structured paragraphs." },
    ],
    faqs: [
      { q: "How long are sessions?", a: "45 to 60 minutes, which suits younger learners better than longer blocks." },
      { q: "My child dislikes reading — will this help?", a: "That is exactly who this programme is for. We start below the frustration point and build up." },
      { q: "How soon will we see change?", a: "Most parents notice a confidence shift within a term; measurable reading gains follow with consistent attendance." },
    ],
    whatsappMessage:
      "Hello New-Lights Learning Academy, I'd like foundation reading and number support for my child in Standard ____.",
  },
  {
    slug: "holiday-intensives",
    title: "Holiday intensives",
    short:
      "School-holiday bootcamps that close gaps before the new term starts, taught in short, high-focus sessions.",
    intro:
      "Use the holidays to get ahead. Short, high-focus mornings that close the previous term's gaps and preview the next term's work.",
    highlights: [
      "Runs during April, July/August and December holidays",
      "Morning sessions only",
      "Catch-up plus next-term preview",
      "Booked by the week",
    ],
    curriculum: [
      { title: "Gap audit", body: "A quick diagnostic on day one to decide what the week must fix." },
      { title: "Intensive teaching", body: "Focused re-teaching of the weakest topics, one or two per day." },
      { title: "Term preview", body: "An introduction to the first topics of the coming term so learners start ahead." },
      { title: "Parent report", body: "A written summary at the end of the week with recommended next steps." },
    ],
    faqs: [
      { q: "How long is a bootcamp?", a: "Usually one week per block, and families can book multiple weeks." },
      { q: "What are the times?", a: "Mornings, typically 08:30–12:00, leaving the rest of the holiday free." },
      { q: "Do you cover all grades?", a: "Yes, Standard 1 through Form 5, grouped by level." },
    ],
    whatsappMessage:
      "Hello New-Lights Learning Academy, I'd like to book a holiday intensive for my child in Grade ____. Subjects: ____.",
  },
  {
    slug: "one-on-one-tutoring",
    title: "One-on-one tutoring",
    short:
      "Private sessions at the centre or online, built around a personal learning plan for your child's specific subjects.",
    intro:
      "Complete attention on one learner. Ideal for learners who are far behind, far ahead, or working around a busy family schedule.",
    highlights: [
      "At the centre or online",
      "Flexible scheduling, including Saturdays",
      "Personal written learning plan",
      "Any subject in the curriculum, by arrangement",
    ],
    curriculum: [
      { title: "Assessment", body: "A full diagnostic session to map exactly what the learner can and cannot do." },
      { title: "Learning plan", body: "A written plan with goals, subject focus and a session schedule shared with you." },
      { title: "Weekly sessions", body: "One-hour private lessons at a pace set by the learner's progress." },
      { title: "Review", body: "A progress review every half term to adjust the plan." },
    ],
    faqs: [
      { q: "Can lessons be online?", a: "Yes. Online sessions run on video call with a shared digital whiteboard." },
      { q: "Can two siblings share a session?", a: "Yes, if they are close in level — ask us and we'll advise." },
      { q: "How do I pay?", a: "Sessions are booked and paid for monthly. Contact us for the current rate card." },
    ],
    whatsappMessage:
      "Hello New-Lights Learning Academy, I'd like private one-on-one tutoring. Grade: ____. Subjects: ____. Preferred times: ____.",
  },
];

export function getProgramme(slug: string) {
  return programmes.find((programme) => programme.slug === slug);
}

/* ---------- Subjects offered ---------- */

export type SubjectGroup = { group: string; options: string[] };

export const subjectGroups: SubjectGroup[] = [
  { group: "Languages", options: ["Setswana", "English", "Literature in English"] },
  {
    group: "Sciences",
    options: [
      "Combined Science",
      "Science Double Award",
      "Integrated Science",
      "Biology",
      "Physics",
      "Chemistry",
    ],
  },
  {
    group: "Mathematics",
    options: ["Core Mathematics", "Applied Mathematics", "Additional Mathematics"],
  },
  {
    group: "Humanities & Commerce",
    options: ["Social Studies", "Commerce", "Religious Studies", "Moral Education"],
  },
  { group: "Creative", options: ["Creative and Performing Arts"] },
];

export const allSubjects = subjectGroups.flatMap((g) => g.options);

/* ---------- Term dates ---------- */

export const termDates = [
  { term: "Term 2, 2026", dates: "Classes in session — join any time" },
  { term: "Term 3, 2026", dates: "Runs to the end of the 2026 academic year" },
  { term: "January 2027", dates: "Centre reopens for the new academic year" },
];

/* ---------- Fees & packages ---------- */

export type FeeItem = { name: string; price: string; note?: string };
export type FeePackage = { title: string; items: FeeItem[]; note?: string };

export const feePackages: FeePackage[] = [
  {
    title: "Full-time primary",
    items: [
      { name: "Tuition", price: "P4,500 per term" },
      { name: "Registration", price: "P100", note: "once-off" },
    ],
  },
  {
    title: "JCE packages",
    items: [
      { name: "Full package", price: "P1,000" },
      { name: "Half package", price: "P500" },
      { name: "Registration", price: "P150", note: "once-off" },
    ],
  },
  {
    title: "Form 4 full-time",
    items: [
      { name: "Tuition", price: "P1,250" },
      { name: "Registration", price: "Free" },
    ],
  },
  {
    title: "Online lessons",
    items: [
      { name: "IGCSE / BGCSE", price: "P200 per lesson" },
      { name: "JCE", price: "P150 per lesson" },
      { name: "Primary", price: "P100 per lesson" },
    ],
  },
];

export const classOptions = [
  {
    title: "After-school classes",
    body: "Weekday afternoon lessons for learners who need extra support alongside school.",
  },
  {
    title: "Saturday breakthrough classes",
    body: "Weekend intensive sessions focused on closing gaps and building exam confidence.",
  },
  {
    title: "Full-time day programme",
    body: "A complete school day at the centre for primary and Form 4 learners.",
  },
  {
    title: "Online lessons",
    body: "Live online lessons for IGCSE, BGCSE, JCE and primary learners wherever you are.",
  },
];

export const TRANSPORT_NOTE =
  "A transport service is available for learners travelling to and from the centre. Contact us for routes and monthly rates.";

export const VISION =
  "To be a centre of excellence that unlocks every learner's potential and builds strong foundations for bright futures.";

export const MISSION =
  "To deliver quality, learner-centred teaching in small supportive classes, guiding each child to dream it, believe it and achieve it.";
