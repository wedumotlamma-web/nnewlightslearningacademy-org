import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ImagePlus, Loader2, Plus, Save, Trash2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  GALLERY_BUCKET,
  HOMEPAGE_KEYS,
  buildHomepageContent,
  homepageFallback,
  type HomepageContent,
} from "@/lib/homepage.functions";

export const Route = createFileRoute("/admin/homepage")({
  head: () => ({
    meta: [
      { title: "Homepage Content — New-Lights Learning Academy" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: HomepageEditor,
});

function HomepageEditor() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<HomepageContent>(homepageFallback);

  const contentQuery = useQuery({
    queryKey: ["homepage-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .like("key", "homepage_%");
      if (error) throw error;
      return buildHomepageContent(data ?? []);
    },
  });

  useEffect(() => {
    if (contentQuery.data) setDraft(contentQuery.data);
  }, [contentQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async (values: HomepageContent) => {
      const rows = [
        { key: HOMEPAGE_KEYS.academyName, value: values.academyName },
        { key: HOMEPAGE_KEYS.address, value: values.address },
        { key: HOMEPAGE_KEYS.phone, value: values.phone },
        { key: HOMEPAGE_KEYS.phoneTel, value: values.phoneTel },
        { key: HOMEPAGE_KEYS.whatsapp, value: values.whatsapp },
        { key: HOMEPAGE_KEYS.email, value: values.email },
        { key: HOMEPAGE_KEYS.openingHours, value: values.openingHours },
        { key: HOMEPAGE_KEYS.tagline, value: values.tagline },
        { key: HOMEPAGE_KEYS.vision, value: values.vision },
        { key: HOMEPAGE_KEYS.mission, value: values.mission },
        { key: HOMEPAGE_KEYS.transportNote, value: values.transportNote },
        { key: HOMEPAGE_KEYS.termDates, value: JSON.stringify(values.termDates) },
        { key: HOMEPAGE_KEYS.feePackages, value: JSON.stringify(values.feePackages) },
        { key: HOMEPAGE_KEYS.classOptions, value: JSON.stringify(values.classOptions) },
        { key: HOMEPAGE_KEYS.aboutHeading, value: values.aboutHeading },
        { key: HOMEPAGE_KEYS.aboutBody, value: values.aboutBody },
        { key: HOMEPAGE_KEYS.coursesHeading, value: values.coursesHeading },
        { key: HOMEPAGE_KEYS.coursesIntro, value: values.coursesIntro },
        { key: HOMEPAGE_KEYS.courses, value: JSON.stringify(values.courses) },
        { key: HOMEPAGE_KEYS.galleryHeading, value: values.galleryHeading },
        { key: HOMEPAGE_KEYS.galleryIntro, value: values.galleryIntro },
        {
          key: HOMEPAGE_KEYS.gallery,
          value: JSON.stringify(values.gallery.map(({ path, caption }) => ({ path, caption }))),
        },
        { key: HOMEPAGE_KEYS.contactHeading, value: values.contactHeading },
        { key: HOMEPAGE_KEYS.contactIntro, value: values.contactIntro },
        { key: HOMEPAGE_KEYS.logoPath, value: values.logoPath },
        { key: HOMEPAGE_KEYS.heroImagePath, value: values.heroImagePath },
        { key: HOMEPAGE_KEYS.classroomImagePath, value: values.classroomImagePath },
        { key: HOMEPAGE_KEYS.homeschoolImagePath, value: values.homeschoolImagePath },
      ];
      const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homepage-content"] });
      toast.success("Homepage updated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const paths = [
      ...draft.gallery.map((g) => g.path),
      draft.logoPath,
      draft.heroImagePath,
      draft.classroomImagePath,
      draft.homeschoolImagePath,
    ].filter(Boolean)
      .filter((path) => !previews[path]);
    if (paths.length === 0) return;
    let cancelled = false;
    void (async () => {
      const { data } = await supabase.storage.from(GALLERY_BUCKET).createSignedUrls(paths, 3600);
      if (cancelled || !data) return;
      setPreviews((prev) => {
        const next = { ...prev };
        data.forEach((entry, i) => {
          const path = paths[i];
          if (path && entry.signedUrl) next[path] = entry.signedUrl;
        });
        return next;
      });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.gallery, draft.logoPath, draft.heroImagePath, draft.classroomImagePath, draft.homeschoolImagePath]);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const added: { path: string; caption: string }[] = [];
      for (const file of Array.from(files)) {
        const path = `gallery/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-")}`;
        const { error } = await supabase.storage.from(GALLERY_BUCKET).upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (error) throw error;
        added.push({ path, caption: "" });
      }
      setDraft((prev) => ({ ...prev, gallery: [...prev.gallery, ...added] }));
      toast.success("Photo uploaded — remember to save");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  type SingleField = "logoPath" | "heroImagePath" | "classroomImagePath" | "homeschoolImagePath";
  const [uploadingSingle, setUploadingSingle] = useState<null | SingleField>(null);

  async function uploadSingle(field: SingleField, files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be 10 MB or smaller");
      return;
    }
    setUploadingSingle(field);
    try {
      const folder =
        field === "logoPath"
          ? "logo"
          : field === "heroImagePath"
            ? "hero"
            : field === "classroomImagePath"
              ? "classroom"
              : "homeschool";
      const path = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-")}`;
      const { error } = await supabase.storage
        .from(GALLERY_BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const old = draft[field];
      if (old) await supabase.storage.from(GALLERY_BUCKET).remove([old]);
      setDraft((prev) => ({ ...prev, [field]: path }));
      toast.success("Image uploaded — remember to save");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploadingSingle(null);
    }
  }

  async function removeSingle(field: SingleField) {
    const old = draft[field];
    if (old) await supabase.storage.from(GALLERY_BUCKET).remove([old]);
    setDraft((prev) => ({ ...prev, [field]: "" }));
    toast.success("Image removed — remember to save");
  }

  async function removeImage(path: string) {
    await supabase.storage.from(GALLERY_BUCKET).remove([path]);
    setDraft((prev) => ({ ...prev, gallery: prev.gallery.filter((g) => g.path !== path) }));
  }

  function updatePackage(index: number, next: HomepageContent["feePackages"][number]) {
    setDraft({
      ...draft,
      feePackages: draft.feePackages.map((p, i) => (i === index ? next : p)),
    });
  }

  return (
    <main className="min-h-screen bg-secondary px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <Button variant="ghost" size="sm" className="mb-6" onClick={() => navigate({ to: "/admin" })}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to admin
        </Button>

        <h1 className="font-display text-3xl font-bold">Homepage content</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Edit the fees, packages, class options, term dates and wording shown on the website.
        </p>

        {contentQuery.isLoading ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Contact details */}
            <Card>
              <CardHeader>
                <CardTitle>Academy &amp; contact details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="academy-name">Academy name</Label>
                  <Input
                    id="academy-name"
                    value={draft.academyName}
                    onChange={(e) => setDraft({ ...draft, academyName: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Address (one line per row)</Label>
                  <Textarea
                    id="address"
                    rows={3}
                    value={draft.address}
                    onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telephone (displayed)</Label>
                  <Input
                    id="phone"
                    value={draft.phone}
                    onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone-tel">Telephone (dialling format)</Label>
                  <Input
                    id="phone-tel"
                    value={draft.phoneTel}
                    onChange={(e) => setDraft({ ...draft, phoneTel: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">Cell / WhatsApp number</Label>
                  <Input
                    id="whatsapp"
                    value={draft.whatsapp}
                    onChange={(e) => setDraft({ ...draft, whatsapp: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={draft.email}
                    onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="opening-hours">Opening hours</Label>
                  <Input
                    id="opening-hours"
                    value={draft.openingHours}
                    onChange={(e) => setDraft({ ...draft, openingHours: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={draft.tagline}
                    onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="about-heading">Heading</Label>
                  <Input
                    id="about-heading"
                    value={draft.aboutHeading}
                    onChange={(e) => setDraft({ ...draft, aboutHeading: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="about-body">Text (leave a blank line between paragraphs)</Label>
                  <Textarea
                    id="about-body"
                    rows={8}
                    value={draft.aboutBody}
                    onChange={(e) => setDraft({ ...draft, aboutBody: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Courses / programmes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="courses-heading">Section heading</Label>
                    <Input
                      id="courses-heading"
                      value={draft.coursesHeading}
                      onChange={(e) => setDraft({ ...draft, coursesHeading: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="courses-intro">Intro line</Label>
                    <Input
                      id="courses-intro"
                      value={draft.coursesIntro}
                      onChange={(e) => setDraft({ ...draft, coursesIntro: e.target.value })}
                    />
                  </div>
                </div>
                {draft.courses.map((course, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label htmlFor={`course-${i}`}>Course title</Label>
                        <Input
                          id={`course-${i}`}
                          value={course.title}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              courses: draft.courses.map((c, ix) =>
                                ix === i ? { ...c, title: e.target.value } : c,
                              ),
                            })
                          }
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        aria-label="Remove course"
                        onClick={() =>
                          setDraft({ ...draft, courses: draft.courses.filter((_, ix) => ix !== i) })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-3">
                      <Label htmlFor={`course-body-${i}`}>Description</Label>
                      <Textarea
                        id={`course-body-${i}`}
                        value={course.body}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            courses: draft.courses.map((c, ix) =>
                              ix === i ? { ...c, body: e.target.value } : c,
                            ),
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    setDraft({ ...draft, courses: [...draft.courses, { title: "", body: "" }] })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add course
                </Button>
              </CardContent>
            </Card>

            {/* Site images */}
            <Card>
              <CardHeader>
                <CardTitle>Site images</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                {([
                  { field: "logoPath", label: "Website logo", hint: "PNG with a transparent background works best." },
                  { field: "heroImagePath", label: "Main homepage photo", hint: "A wide landscape photo works best." },
                  { field: "classroomImagePath", label: "About section photo", hint: "Shown next to the About text." },
                  { field: "homeschoolImagePath", label: "Homeschooling photo", hint: "Shown in the homeschooling section." },
                ] as const).map(({ field, label, hint }) => (
                  <div key={field} className="space-y-3">
                    <Label htmlFor={`${field}-upload`}>{label}</Label>
                    <div className="flex h-36 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                      {draft[field] && previews[draft[field]] ? (
                        <img src={previews[draft[field]]} alt={label} className="h-full w-full object-contain" />
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {draft[field] ? "Loading…" : "No image uploaded yet"}
                        </span>
                      )}
                    </div>
                    <input
                      id={`${field}-upload`}
                      type="file"
                      accept="image/*"
                      disabled={uploadingSingle !== null}
                      onChange={(e) => {
                        void uploadSingle(field, e.target.files);
                        e.target.value = "";
                      }}
                      className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-border file:bg-secondary file:px-3 file:py-2 file:text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      {uploadingSingle === field ? "Uploading…" : `${hint} Up to 10 MB.`}
                    </p>
                    {draft[field] && (
                      <Button variant="outline" size="sm" onClick={() => void removeSingle(field)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Remove image
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Photo gallery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="gallery-heading">Section heading</Label>
                    <Input
                      id="gallery-heading"
                      value={draft.galleryHeading}
                      onChange={(e) => setDraft({ ...draft, galleryHeading: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gallery-intro">Intro line</Label>
                    <Input
                      id="gallery-intro"
                      value={draft.galleryIntro}
                      onChange={(e) => setDraft({ ...draft, galleryIntro: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {draft.gallery.map((image, i) => (
                    <div key={image.path} className="rounded-lg border p-3">
                      {previews[image.path] ? (
                        <img
                          src={previews[image.path]}
                          alt={image.caption || "Gallery photo"}
                          className="h-32 w-full rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-32 w-full items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                          Loading…
                        </div>
                      )}
                      <Input
                        className="mt-3"
                        placeholder="Caption"
                        value={image.caption}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            gallery: draft.gallery.map((g, ix) =>
                              ix === i ? { ...g, caption: e.target.value } : g,
                            ),
                          })
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => void removeImage(image.path)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Remove
                      </Button>
                    </div>
                  ))}
                </div>

                <div>
                  <Label htmlFor="gallery-upload" className="sr-only">
                    Upload photos
                  </Label>
                  <input
                    id="gallery-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploading}
                    onChange={(e) => {
                      void handleUpload(e.target.files);
                      e.target.value = "";
                    }}
                    className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-border file:bg-secondary file:px-3 file:py-2 file:text-sm"
                  />
                  <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <ImagePlus className="h-3.5 w-3.5" />
                    {uploading ? "Uploading…" : "JPG or PNG, up to 10 MB each."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact form section */}
            <Card>
              <CardHeader>
                <CardTitle>Contact form section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contact-heading">Heading</Label>
                  <Input
                    id="contact-heading"
                    value={draft.contactHeading}
                    onChange={(e) => setDraft({ ...draft, contactHeading: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contact-intro">Intro text above the form</Label>
                  <Textarea
                    id="contact-intro"
                    rows={3}
                    value={draft.contactIntro}
                    onChange={(e) => setDraft({ ...draft, contactIntro: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Fees & packages */}
            <Card>
              <CardHeader>
                <CardTitle>Fees &amp; packages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {draft.feePackages.map((pkg, pi) => (
                  <div key={pi} className="rounded-lg border p-4">
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label htmlFor={`pkg-${pi}`}>Package title</Label>
                        <Input
                          id={`pkg-${pi}`}
                          value={pkg.title}
                          onChange={(e) => updatePackage(pi, { ...pkg, title: e.target.value })}
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        aria-label="Remove package"
                        onClick={() =>
                          setDraft({
                            ...draft,
                            feePackages: draft.feePackages.filter((_, i) => i !== pi),
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {pkg.items.map((item, ii) => (
                        <div key={ii} className="flex items-end gap-2">
                          <div className="flex-1">
                            <Label htmlFor={`pkg-${pi}-item-${ii}`}>Item</Label>
                            <Input
                              id={`pkg-${pi}-item-${ii}`}
                              value={item.name}
                              onChange={(e) =>
                                updatePackage(pi, {
                                  ...pkg,
                                  items: pkg.items.map((it, i) =>
                                    i === ii ? { ...it, name: e.target.value } : it,
                                  ),
                                })
                              }
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor={`pkg-${pi}-price-${ii}`}>Price</Label>
                            <Input
                              id={`pkg-${pi}-price-${ii}`}
                              value={item.price}
                              onChange={(e) =>
                                updatePackage(pi, {
                                  ...pkg,
                                  items: pkg.items.map((it, i) =>
                                    i === ii ? { ...it, price: e.target.value } : it,
                                  ),
                                })
                              }
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="Remove item"
                            onClick={() =>
                              updatePackage(pi, {
                                ...pkg,
                                items: pkg.items.filter((_, i) => i !== ii),
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updatePackage(pi, {
                            ...pkg,
                            items: [...pkg.items, { name: "", price: "" }],
                          })
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add item
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      feePackages: [...draft.feePackages, { title: "New package", items: [] }],
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add package
                </Button>
              </CardContent>
            </Card>

            {/* Class options */}
            <Card>
              <CardHeader>
                <CardTitle>Class options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {draft.classOptions.map((option, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label htmlFor={`class-${i}`}>Title</Label>
                        <Input
                          id={`class-${i}`}
                          value={option.title}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              classOptions: draft.classOptions.map((o, ix) =>
                                ix === i ? { ...o, title: e.target.value } : o,
                              ),
                            })
                          }
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        aria-label="Remove class option"
                        onClick={() =>
                          setDraft({
                            ...draft,
                            classOptions: draft.classOptions.filter((_, ix) => ix !== i),
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-3">
                      <Label htmlFor={`class-body-${i}`}>Description</Label>
                      <Textarea
                        id={`class-body-${i}`}
                        value={option.body}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            classOptions: draft.classOptions.map((o, ix) =>
                              ix === i ? { ...o, body: e.target.value } : o,
                            ),
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      classOptions: [...draft.classOptions, { title: "", body: "" }],
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add class option
                </Button>
              </CardContent>
            </Card>

            {/* Term dates */}
            <Card>
              <CardHeader>
                <CardTitle>Term dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {draft.termDates.map((term, i) => (
                  <div key={i} className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor={`term-${i}`}>Term</Label>
                      <Input
                        id={`term-${i}`}
                        value={term.term}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            termDates: draft.termDates.map((t, ix) =>
                              ix === i ? { ...t, term: e.target.value } : t,
                            ),
                          })
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`term-dates-${i}`}>Dates</Label>
                      <Input
                        id={`term-dates-${i}`}
                        value={term.dates}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            termDates: draft.termDates.map((t, ix) =>
                              ix === i ? { ...t, dates: e.target.value } : t,
                            ),
                          })
                        }
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Remove term"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          termDates: draft.termDates.filter((_, ix) => ix !== i),
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    setDraft({ ...draft, termDates: [...draft.termDates, { term: "", dates: "" }] })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add term
                </Button>
              </CardContent>
            </Card>

            {/* Wording */}
            <Card>
              <CardHeader>
                <CardTitle>Vision, mission &amp; transport</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="vision">Vision</Label>
                  <Textarea
                    id="vision"
                    value={draft.vision}
                    onChange={(e) => setDraft({ ...draft, vision: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="mission">Mission</Label>
                  <Textarea
                    id="mission"
                    value={draft.mission}
                    onChange={(e) => setDraft({ ...draft, mission: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="transport">Transport note</Label>
                  <Textarea
                    id="transport"
                    value={draft.transportNote}
                    onChange={(e) => setDraft({ ...draft, transportNote: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="sticky bottom-4 flex justify-end">
              <Button
                size="lg"
                onClick={() => saveMutation.mutate(draft)}
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
