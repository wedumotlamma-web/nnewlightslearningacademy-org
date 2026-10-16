import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

import {
  ADDRESS_LINES,
  EMAIL,
  MISSION,
  PHONE,
  PHONE_TEL,
  TAGLINE,
  WHATSAPP_NUMBER,
  TRANSPORT_NOTE,
  VISION,
  classOptions,
  feePackages,
  termDates,
  type FeePackage,
} from "@/lib/site";

export type TermDate = { term: string; dates: string };
export type ClassOption = { title: string; body: string };
export type Course = { title: string; body: string };
export type GalleryImage = { path: string; caption: string; url?: string | undefined };

export type HomepageContent = {
  academyName: string;
  address: string;
  phone: string;
  phoneTel: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  tagline: string;
  vision: string;
  mission: string;
  transportNote: string;
  termDates: TermDate[];
  feePackages: FeePackage[];
  classOptions: ClassOption[];
  aboutHeading: string;
  aboutBody: string;
  coursesHeading: string;
  coursesIntro: string;
  courses: Course[];
  galleryHeading: string;
  galleryIntro: string;
  gallery: GalleryImage[];
  contactHeading: string;
  contactIntro: string;
  logoPath: string;
  heroImagePath: string;
  logoUrl?: string;
  heroImageUrl?: string;
};

export const HOMEPAGE_KEYS = {
  academyName: "homepage_academy_name",
  address: "homepage_address",
  phone: "homepage_phone",
  phoneTel: "homepage_phone_tel",
  whatsapp: "homepage_whatsapp",
  email: "homepage_email",
  openingHours: "homepage_opening_hours",
  tagline: "homepage_tagline",
  vision: "homepage_vision",
  mission: "homepage_mission",
  transportNote: "homepage_transport_note",
  termDates: "homepage_term_dates",
  feePackages: "homepage_fee_packages",
  classOptions: "homepage_class_options",
  aboutHeading: "homepage_about_heading",
  aboutBody: "homepage_about_body",
  coursesHeading: "homepage_courses_heading",
  coursesIntro: "homepage_courses_intro",
  courses: "homepage_courses",
  galleryHeading: "homepage_gallery_heading",
  galleryIntro: "homepage_gallery_intro",
  gallery: "homepage_gallery",
  contactHeading: "homepage_contact_heading",
  contactIntro: "homepage_contact_intro",
  logoPath: "homepage_logo_path",
  heroImagePath: "homepage_hero_image_path",
} as const;

export const GALLERY_BUCKET = "site-images";

export const fallbackCourses: Course[] = [
  {
    title: "After-school tuition",
    body: "Small groups of no more than six learners for Maths, English, Science and Setswana, with weekly progress feedback to parents.",
  },
  {
    title: "Cambridge IGCSE",
    body: "Cambridge IGCSE tuition and full-curriculum support for Years 9-11, taught to the Cambridge syllabus with past-paper practice and coursework support.",
  },
  {
    title: "Exam preparation",
    body: "Focused revision, past-paper drills and timed practice for end-of-year, PSLE, JCE, BGCSE and Cambridge IGCSE examinations.",
  },
  {
    title: "Full homeschooling",
    body: "A structured full-curriculum day programme with qualified facilitators, termly reports and portfolio record-keeping, with a Cambridge IGCSE pathway available.",
  },
  {
    title: "Foundation numeracy & literacy",
    body: "Targeted catch-up support for early primary learners who need to rebuild confidence in reading and number work.",
  },
  {
    title: "Holiday intensives",
    body: "School-holiday bootcamps that close gaps before the new term starts, taught in short, high-focus sessions.",
  },
  {
    title: "One-on-one tutoring",
    body: "Private sessions at the centre or online, built around a personal learning plan for your child's specific subjects.",
  },
];

export const homepageFallback: HomepageContent = {
  academyName: "New-Lights Learning Academy",
  address: ADDRESS_LINES.join("\n"),
  phone: PHONE,
  phoneTel: PHONE_TEL,
  whatsapp: WHATSAPP_NUMBER,
  email: EMAIL,
  openingHours: "Mon\u2013Fri 08:00\u201318:00 \u00b7 Sat 09:00\u201313:00",
  tagline: TAGLINE,
  vision: VISION,
  mission: MISSION,
  transportNote: TRANSPORT_NOTE,
  termDates,
  feePackages,
  classOptions,
  aboutHeading: "A calm, focused place to learn",
  aboutBody:
    "We are a community learning centre built around one belief: every child can do well when the teaching meets them where they are. Our facilitators work from the national curriculum, keep class sizes small and track each learner's progress in writing.\n\nWhether your child needs a few hours of afternoon support or a complete homeschooling home base, we build the plan around your family's routine.",
  coursesHeading: "Our programmes",
  coursesIntro: "Choose a single subject, a full timetable, or anything in between.",
  courses: fallbackCourses,
  galleryHeading: "Life at the academy",
  galleryIntro: "A look inside our classrooms, activities and learners at work.",
  gallery: [],
  contactHeading: "Book a free assessment",
  contactIntro:
    "Send us your details and we'll be in touch within one working day to arrange a convenient time.",
};

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

export function buildHomepageContent(rows: { key: string; value: string | null }[]): HomepageContent {
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const text = (key: string, fallback: string) => {
    const v = map.get(key);
    return v && v.trim() ? v : fallback;
  };
  return {
    academyName: text(HOMEPAGE_KEYS.academyName, homepageFallback.academyName),
    address: text(HOMEPAGE_KEYS.address, homepageFallback.address),
    phone: text(HOMEPAGE_KEYS.phone, homepageFallback.phone),
    phoneTel: text(HOMEPAGE_KEYS.phoneTel, homepageFallback.phoneTel),
    whatsapp: text(HOMEPAGE_KEYS.whatsapp, homepageFallback.whatsapp),
    email: text(HOMEPAGE_KEYS.email, homepageFallback.email),
    openingHours: text(HOMEPAGE_KEYS.openingHours, homepageFallback.openingHours),
    tagline: text(HOMEPAGE_KEYS.tagline, homepageFallback.tagline),
    vision: text(HOMEPAGE_KEYS.vision, homepageFallback.vision),
    mission: text(HOMEPAGE_KEYS.mission, homepageFallback.mission),
    transportNote: text(HOMEPAGE_KEYS.transportNote, homepageFallback.transportNote),
    termDates: parseJson(map.get(HOMEPAGE_KEYS.termDates), homepageFallback.termDates),
    feePackages: parseJson(map.get(HOMEPAGE_KEYS.feePackages), homepageFallback.feePackages),
    classOptions: parseJson(map.get(HOMEPAGE_KEYS.classOptions), homepageFallback.classOptions),
    aboutHeading: text(HOMEPAGE_KEYS.aboutHeading, homepageFallback.aboutHeading),
    aboutBody: text(HOMEPAGE_KEYS.aboutBody, homepageFallback.aboutBody),
    coursesHeading: text(HOMEPAGE_KEYS.coursesHeading, homepageFallback.coursesHeading),
    coursesIntro: text(HOMEPAGE_KEYS.coursesIntro, homepageFallback.coursesIntro),
    courses: parseJson(map.get(HOMEPAGE_KEYS.courses), homepageFallback.courses),
    galleryHeading: text(HOMEPAGE_KEYS.galleryHeading, homepageFallback.galleryHeading),
    galleryIntro: text(HOMEPAGE_KEYS.galleryIntro, homepageFallback.galleryIntro),
    gallery: parseJson<GalleryImage[]>(map.get(HOMEPAGE_KEYS.gallery), homepageFallback.gallery),
    contactHeading: text(HOMEPAGE_KEYS.contactHeading, homepageFallback.contactHeading),
    contactIntro: text(HOMEPAGE_KEYS.contactIntro, homepageFallback.contactIntro),
    logoPath: map.get(HOMEPAGE_KEYS.logoPath)?.trim() ?? "",
    heroImagePath: map.get(HOMEPAGE_KEYS.heroImagePath)?.trim() ?? "",
  };
}

export const getHomepageContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<HomepageContent> => {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) return homepageFallback;

    const supabasePublic = createClient<Database>(url, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { data, error } = await supabasePublic
      .from("site_settings")
      .select("key, value")
      .like("key", "homepage_%");

    if (error || !data) return homepageFallback;
    const content = buildHomepageContent(data);

    const singles = [content.logoPath, content.heroImagePath].filter(Boolean);
    if (content.gallery.length > 0 || singles.length > 0) {
      // Signed URLs are minted with the server-side admin client so the storage
      // bucket can stay closed to anonymous direct downloads.
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: signed } = await supabaseAdmin.storage
        .from(GALLERY_BUCKET)
        .createSignedUrls(
          [...content.gallery.map((image) => image.path), ...singles],
          60 * 60 * 24,
        );
      if (signed) {
        content.gallery = content.gallery.map((image, index) => ({
          ...image,
          url: signed[index]?.signedUrl ?? undefined,
        }));
        const byPath = new Map(signed.map((s) => [s.path, s.signedUrl]));
        if (content.logoPath) content.logoUrl = byPath.get(content.logoPath) ?? undefined;
        if (content.heroImagePath)
          content.heroImageUrl = byPath.get(content.heroImagePath) ?? undefined;
      }
    }

    return content;
  },
);
