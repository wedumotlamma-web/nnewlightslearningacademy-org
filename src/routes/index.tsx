import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  Bus,
  Calculator,
  ClipboardCheck,
  Globe,
  GraduationCap,
  Home,
  LogIn,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

import sealLogo from "@/assets/logo-seal.png";
import horizontalLogo from "@/assets/logo-horizontal.png";
import heroImage from "@/assets/hero-tutoring.jpg";
import homeschoolImage from "@/assets/homeschool.jpg";
import classroomImage from "@/assets/classroom.jpg";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { subjectGroups } from "@/lib/site";
import {
  getHomepageContent,
  homepageFallback,
  type HomepageContent,
} from "@/lib/homepage.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "New-Lights Learning Academy | Tuition & Homeschooling Centre" },
      {
        name: "description",
        content:
          "New-Lights Learning Academy offers small-group tuition, Cambridge IGCSE support, exam preparation and full homeschooling for primary and secondary learners. Book a free assessment.",
      },
      { property: "og:title", content: "New-Lights Learning Academy | Tuition & Homeschooling" },
      {
        property: "og:description",
        content:
          "Small-group tuition, Cambridge IGCSE, exam prep and registered homeschooling support. Book your child's free assessment today.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getHomepageContent(),
  errorComponent: () => <HomePage content={homepageFallback} />,
  component: HomePageRoute,
});

function HomePageRoute() {
  return <HomePage content={Route.useLoaderData()} />;
}

const navLinks = [
  { href: "#programmes", label: "Programmes" },
  { href: "#gallery", label: "Gallery" },
  { href: "#homeschooling", label: "Homeschooling" },
  { href: "#fees", label: "Fees" },
  { href: "#why-us", label: "Why us" },

  { href: "#contact", label: "Contact" },
];

const courseIcons = [BookOpen, Globe, ClipboardCheck, Home, Calculator, GraduationCap, Users];


const reasons = [
  {
    title: "Diagnostic first",
    body: "Every learner starts with a free assessment so teaching begins exactly where the gaps are.",
  },
  {
    title: "Small classes",
    body: "Capped group sizes mean each learner is seen, questioned and supported in every session.",
  },
  {
    title: "Qualified facilitators",
    body: "Subject specialists who teach the national curriculum and keep detailed learner records.",
  },
  {
    title: "Parents kept close",
    body: "Regular written feedback, termly reports and an open-door policy for parent meetings.",
  },
];

const steps = [
  { step: "01", title: "Enquire", body: "Send us a message or WhatsApp us with your child's grade and subjects." },
  { step: "02", title: "Free assessment", body: "We assess current levels and discuss goals with you in person." },
  { step: "03", title: "Learning plan", body: "You receive a written plan with subjects, schedule and fees." },
  { step: "04", title: "Start learning", body: "Your child joins the programme and you get regular progress updates." },
];

function SignInMenu({ iconOnly = false }: { iconOnly?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {iconOnly ? (
          <Button size="icon" variant="outline" aria-label="Sign in options">
            <LogIn className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="sm" variant="secondary">
            <LogIn className="mr-2 h-4 w-4" />
            Sign in
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Sign in as</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to="/portal" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Student portal
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/auth" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Staff login
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/admin-login" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Admin login
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/auth" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Create an account
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function HomePage({ content }: { content: HomepageContent }) {
  const { vision: VISION, mission: MISSION, transportNote: TRANSPORT_NOTE, termDates, feePackages, classOptions } = content;
  const PHONE = content.phone;
  const PHONE_TEL = content.phoneTel;
  const WHATSAPP_NUMBER = content.whatsapp;
  const WHATSAPP = `https://wa.me/${content.whatsapp.replace(/[^0-9]/g, "").replace(/^0+/, "").replace(/^(?!267)/, "267")}`;
  const EMAIL = content.email;
  const addressLines = content.address.split("\n").filter((l) => l.trim());
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="#top" className="flex items-center gap-2">
            <img
              src={content.logoUrl ?? horizontalLogo}
              alt={content.academyName}
              width={680}
              height={480}
              className="h-11 w-auto object-contain sm:h-14"
            />
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/register"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Register
            </Link>
            <Link
              to="/portal"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Student portal
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <SignInMenu />
            </div>
            <div className="sm:hidden">
              <SignInMenu iconOnly />
            </div>
            <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
              <Link to="/register">Register online</Link>
            </Button>
            <Button asChild size="sm">
              <a href="#contact">Free assessment</a>
            </Button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="bg-gradient-navy">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-2 md:items-center md:py-20">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-gold/40 px-3 py-1 text-xs tracking-widest text-gold uppercase">
                Tuition &amp; Homeschooling Centre
              </p>
              <h1 className="font-display text-3xl leading-tight font-bold text-navy-foreground sm:text-4xl md:text-5xl">
                Bringing new light to every learner's potential
              </h1>
              <p className="mt-5 max-w-xl text-base text-navy-foreground/80">
                New-Lights Learning Academy supports primary and secondary learners with
                small-group tuition, exam preparation and a full homeschooling programme
                guided by qualified facilitators.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href="#contact">Book a free assessment</a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-navy-foreground/15 pt-6">
                {[
                  { value: "6", label: "Max learners per group" },
                  { value: "Gr 1–12", label: "Grades supported" },
                  { value: "Free", label: "Initial assessment" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt className="font-display text-xl font-bold text-gold">{stat.value}</dt>
                    <dd className="mt-1 text-xs text-navy-foreground/70">{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="relative">
              <img
                src={content.heroImageUrl ?? heroImage}
                alt="A tutor guiding two secondary school learners through their work at New-Lights Learning Academy"
                width={1600}
                height={1104}
                className="rounded-lg border border-gold/25 shadow-elegant"
              />
            </div>
          </div>
        </section>

        {/* About */}
        <section className="mx-auto max-w-6xl px-5 py-16" aria-labelledby="about-heading">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <img
              src={classroomImage}
              alt="Learners working in a small tuition class at the centre"
              width={1200}
              height={900}
              loading="lazy"
              className="rounded-lg border border-border shadow-card"
            />
            <div>
              <h2 id="about-heading" className="rule-gold font-display text-2xl font-bold sm:text-3xl">
                {content.aboutHeading}
              </h2>
              {content.aboutBody
                .split(/\n\s*\n/)
                .filter((paragraph) => paragraph.trim())
                .map((paragraph, index) => (
                  <p key={index} className={index === 0 ? "mt-6 text-muted-foreground" : "mt-4 text-muted-foreground"}>
                    {paragraph.trim()}
                  </p>
                ))}
            </div>
          </div>
        </section>

        {/* Programmes */}
        <section id="programmes" className="bg-secondary/60 py-16" aria-labelledby="programmes-heading">
          <div className="mx-auto max-w-6xl px-5">
            <h2 id="programmes-heading" className="rule-gold font-display text-2xl font-bold sm:text-3xl">
              {content.coursesHeading}
            </h2>
            <p className="mt-6 max-w-2xl text-muted-foreground">
              {content.coursesIntro}
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {content.courses.map(({ title, body }, index) => {
                const Icon = courseIcons[index % courseIcons.length]!;
                return (
                <Card key={title} className="h-full border-border/70 shadow-card">
                  <CardContent className="p-6">
                    <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-accent">
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </span>
                    <h3 className="font-display text-lg font-bold">{title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{body}</p>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Gallery */}
        {content.gallery.length > 0 && (
          <section id="gallery" className="mx-auto max-w-6xl px-5 py-16" aria-labelledby="gallery-heading">
            <h2 id="gallery-heading" className="rule-gold font-display text-2xl font-bold sm:text-3xl">
              {content.galleryHeading}
            </h2>
            <p className="mt-6 max-w-2xl text-muted-foreground">{content.galleryIntro}</p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {content.gallery
                .filter((image) => image.url)
                .map((image) => (
                  <figure key={image.path} className="overflow-hidden rounded-lg border border-border shadow-card">
                    <img
                      src={image.url}
                      alt={image.caption || `${content.academyName} photo`}
                      loading="lazy"
                      className="h-56 w-full object-cover"
                    />
                    {image.caption ? (
                      <figcaption className="bg-card px-4 py-3 text-sm text-muted-foreground">
                        {image.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
            </div>
          </section>
        )}

        {/* Homeschooling */}
        <section id="homeschooling" className="mx-auto max-w-6xl px-5 py-16" aria-labelledby="homeschool-heading">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 id="homeschool-heading" className="rule-gold font-display text-2xl font-bold sm:text-3xl">
                Homeschooling, fully supported
              </h2>
              <p className="mt-6 text-muted-foreground">
                Our homeschooling programme gives families structure without losing
                flexibility. Learners follow a timetabled day at the centre, or a blended
                schedule of centre days and guided work at home.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Curriculum planning and weekly lesson schedules",
                  "Cambridge IGCSE pathway as an alternative to the national curriculum",
                  "Qualified facilitators for core subjects",
                  "Portfolio and record-keeping for assessments",
                  "Termly written reports and parent meetings",
                  "Social activities, outings and group projects",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <img
              src={homeschoolImage}
              alt="A parent and child studying together as part of the supported homeschooling programme"
              width={1200}
              height={900}
              loading="lazy"
              className="rounded-lg border border-border shadow-card"
            />
          </div>
        </section>

        {/* Why us */}
        <section id="why-us" className="bg-gradient-navy py-16" aria-labelledby="why-heading">
          <div className="mx-auto max-w-6xl px-5">
            <h2 id="why-heading" className="rule-gold font-display text-2xl font-bold text-navy-foreground sm:text-3xl">
              Why families choose New-Lights
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {reasons.map((reason) => (
                <div
                  key={reason.title}
                  className="rounded-lg border border-navy-foreground/15 bg-navy-foreground/5 p-6"
                >
                  <h3 className="font-display text-base font-bold text-gold">{reason.title}</h3>
                  <p className="mt-2 text-sm text-navy-foreground/75">{reason.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision & mission */}
        <section className="mx-auto max-w-6xl px-5 py-16" aria-labelledby="vision-heading">
          <h2 id="vision-heading" className="rule-gold font-display text-2xl font-bold sm:text-3xl">
            Our vision &amp; mission
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-bold">Vision</h3>
                <p className="mt-2 text-sm text-muted-foreground">{VISION}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-bold">Mission</h3>
                <p className="mt-2 text-sm text-muted-foreground">{MISSION}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Class options, term dates & fees */}
        <section id="fees" className="bg-secondary/60 py-16" aria-labelledby="fees-heading">
          <div className="mx-auto max-w-6xl px-5">
            <h2 id="fees-heading" className="rule-gold font-display text-2xl font-bold sm:text-3xl">
              Classes, term dates &amp; fees
            </h2>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {classOptions.map((option) => (
                <Card key={option.title}>
                  <CardContent className="p-6">
                    <h3 className="font-display text-base font-bold">{option.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{option.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h3 className="mt-12 font-display text-xl font-bold">Term dates</h3>
            <ul className="mt-4 grid gap-4 sm:grid-cols-3">
              {termDates.map((term) => (
                <li key={term.term} className="border-t-2 border-gold pt-3">
                  <p className="font-display text-base font-bold">{term.term}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{term.dates}</p>
                </li>
              ))}
            </ul>

            <h3 className="mt-12 font-display text-xl font-bold">Fees &amp; packages</h3>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {feePackages.map((pkg) => (
                <Card key={pkg.title}>
                  <CardContent className="p-6">
                    <h4 className="font-display text-base font-bold">{pkg.title}</h4>
                    <ul className="mt-3 space-y-2 text-sm">
                      {pkg.items.map((item) => (
                        <li key={item.name} className="flex justify-between gap-3">
                          <span className="text-muted-foreground">{item.name}</span>
                          <span className="font-semibold">{item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h3 className="mt-12 font-display text-xl font-bold">Subjects offered</h3>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {subjectGroups.map((group) => (
                <div key={group.group}>
                  <p className="font-display text-base font-bold">{group.group}</p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {group.options.map((option) => (
                      <li key={option}>{option}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-start gap-3 rounded-lg border border-gold/40 bg-background p-6">
              <Bus className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
              <div>
                <h3 className="font-display text-base font-bold">Transport service</h3>
                <p className="mt-1 text-sm text-muted-foreground">{TRANSPORT_NOTE}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="mx-auto max-w-6xl px-5 py-16" aria-labelledby="process-heading">

          <h2 id="process-heading" className="rule-gold font-display text-2xl font-bold sm:text-3xl">
            How to get started
          </h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => (
              <li key={item.step} className="border-t-2 border-gold pt-4">
                <span className="font-display text-sm font-bold text-muted-foreground">{item.step}</span>
                <h3 className="mt-1 font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Contact */}
        <section id="contact" className="bg-secondary/60 py-16" aria-labelledby="contact-heading">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1fr_1.25fr]">
            <div>
              <h2 id="contact-heading" className="rule-gold font-display text-2xl font-bold sm:text-3xl">
                {content.contactHeading}
              </h2>
              <p className="mt-6 text-muted-foreground">{content.contactIntro}</p>
              <ul className="mt-8 space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
                  <a className="hover:underline" href={`tel:${PHONE_TEL}`}>
                    Tel: {PHONE}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" />
                  <a
                    className="hover:underline"
                    href={WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cell/WhatsApp: {WHATSAPP_NUMBER}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                  <a className="hover:underline" href={`mailto:${EMAIL}`}>
                    {EMAIL}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="text-muted-foreground">
                    {addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                    <span className="block">{content.openingHours}</span>
                  </span>
                </li>
              </ul>
            </div>
            <Card className="border-border/70 shadow-card">
              <CardContent className="p-6 sm:p-8">
                <EnquiryForm />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-navy py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 text-sm text-navy-foreground/70 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img
              src={content.logoUrl ?? sealLogo}
              alt={`${content.academyName} crest`}
              width={48}
              height={48}
              loading="lazy"
              className="h-12 w-12 object-contain"
            />
            <div>
              <p className="font-display font-bold text-navy-foreground">{content.academyName}</p>
              <p className="text-xs text-gold">{content.tagline}</p>
            </div>
          </div>
          <p>© {new Date().getFullYear()} {content.academyName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
