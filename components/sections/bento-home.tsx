import Image from "next/image";
import { ArrowUpRight, Bot, Code2, Mail, MonitorSmartphone, Search, Sparkles, type LucideIcon } from "lucide-react";

import { siteConfig } from "@/site.config";
import { getHeroTexts, getItems } from "@/lib/data";
import { canEmbed } from "@/lib/embed";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { Typewriter } from "@/components/ui/typewriter";
import { WorkCard } from "@/components/ui/work-viewer";
import { cn } from "@/lib/utils";

/* 메인 페이지 — 크기가 다른 둥근 타일을 퍼즐처럼 맞춘 '벤토 그리드' (브라운·크림 레트로)
   타일 순서 (컴퓨터 12칸 기준):
   ① 주소창 띠(12)  ② 큰 소개 타일(8, 두 줄 높이) + ③ 프로필 카드(4) + ④ 사진(4)
   ⑤ WHO'S 소개 글(7) + ⑥ 검색창 + 사진 묶음(5)  ⑦ 작업물 슬라이드(12)  ⑧ 연락처(12)
   - 글자: site.config.ts (첫 화면 글자는 My Studio → 사이트 관리 → 히어로 글자)
   - 휴대폰에서는 타일이 한 줄에 하나씩 위에서 아래로 쌓임 */

const tile = "rounded-[var(--radius)] bg-card text-card-foreground";
const CLASS_ICONS: LucideIcon[] = [Code2, Bot, MonitorSmartphone];

export async function BentoHome() {
  const { hero, about, partners, highlights, features, contact, name } = siteConfig;
  const texts = await getHeroTexts();
  const works = await getItems("features");
  const embeddable = await Promise.all(works.map((w) => (w.link_url ? canEmbed(w.link_url) : false)));
  const classes = texts["hero.eyebrow"]
    .split(/[,·]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <Container className="pt-4 pb-16">
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12">
        {/* ① 주소창 띠 */}
        <a
          href={`mailto:${contact.email}`}
          className={cn(tile, "flex items-center gap-3 rounded-full px-6 py-3 text-sm font-medium lg:col-span-12")}
        >
          <Mail className="size-4 shrink-0 opacity-60" />
          <span className="truncate">https://{name.replace(/\.$/, "").toLowerCase()}.studio · {contact.email}</span>
          <ArrowUpRight className="ml-auto size-4 shrink-0 opacity-60" />
        </a>

        {/* ② 큰 소개 타일: 일러스트 + 큰 세리프 제목 + 부제(타이핑) + 버튼 */}
        <section id="top" className={cn(tile, "flex flex-col p-3 sm:p-4 lg:col-span-8 lg:row-span-2")}>
          <div className="relative aspect-[16/9] overflow-hidden rounded-[calc(var(--radius)-0.5rem)] bg-muted">
            <div aria-hidden className="absolute top-[10%] right-[12%] size-1/2 rounded-full bg-brand/40 blur-3xl" />
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 760px, 100vw"
              className="object-contain object-bottom"
            />
          </div>
          <div className="flex flex-1 flex-col gap-5 px-2 pt-6 pb-3 sm:flex-row sm:items-end sm:gap-8">
            <h1 className="flex-1 font-serif text-[1.9rem] leading-[1.2] font-bold whitespace-pre-line sm:text-4xl xl:text-[2.35rem]">
              {texts["hero.title"]}
            </h1>
            <div className="shrink-0 sm:w-52">
              <p className="min-h-12 text-sm leading-relaxed opacity-80">
                <Typewriter text={texts["hero.description"]} speed={80} delay={500} loop />
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <a href={hero.primaryCta.href}>{texts["hero.primaryCta"]}</a>
                </Button>
                <Button asChild size="sm" variant="outline" className="bg-transparent">
                  <a href={hero.secondaryCta.href}>{texts["hero.secondaryCta"]}</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ③ 프로필 카드 (진한 타일 안의 크림 카드) */}
        <section className="rounded-[var(--radius)] bg-primary p-3 sm:p-4 lg:col-span-4">
          <div className="flex h-full flex-col rounded-[calc(var(--radius)-0.5rem)] bg-card p-5 text-card-foreground">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Sparkles className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-serif text-2xl font-bold">{name}</p>
                <p className="truncate text-xs opacity-70">{hero.profileLine}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button asChild size="sm" variant="secondary" className="bg-muted">
                <a href={hero.primaryCta.href}>{texts["hero.primaryCta"]}</a>
              </Button>
              <Button asChild size="sm" variant="secondary" className="bg-muted">
                <a href={hero.secondaryCta.href}>{texts["hero.secondaryCta"]}</a>
              </Button>
            </div>
            {/* 수업 이름 동그라미들 (히어로 글자의 작은 글씨를 쉼표로 나눈 것) */}
            <ul className="mt-5 flex flex-wrap justify-around gap-3">
              {classes.map((label, i) => {
                const Icon = CLASS_ICONS[i % CLASS_ICONS.length];
                return (
                  <li key={label} className="flex flex-col items-center gap-1.5 text-center text-xs">
                    <span className="inline-flex size-14 items-center justify-center rounded-full border-2 border-primary/15 bg-brand/30">
                      <Icon className="size-6" strokeWidth={1.75} />
                    </span>
                    {label}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ④ 사진 타일 */}
        <figure className={cn(tile, "relative min-h-64 overflow-hidden p-3 lg:col-span-4")}>
          <div className="relative size-full min-h-60 overflow-hidden rounded-[calc(var(--radius)-0.5rem)]">
            <Image
              src={about.images[0].src}
              alt={about.images[0].alt}
              fill
              sizes="(min-width: 1024px) 380px, 100vw"
              className="object-cover sepia-[.25] saturate-[.8]"
            />
          </div>
        </figure>

        {/* ⑤ WHO'S 소개 글 */}
        <section id="about" className={cn(tile, "scroll-mt-20 p-6 sm:p-8 lg:col-span-7")}>
          <h2 className="font-serif text-4xl font-bold tracking-tight uppercase sm:text-5xl">
            Who&apos;s {name.replace(/\.$/, "")}?
          </h2>
          <p className="mt-4 font-serif text-lg font-bold">{about.title}</p>
          <div className="mt-3 space-y-2 text-sm leading-relaxed opacity-80">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="mt-5 text-xs font-semibold tracking-wide opacity-60">{partners.title}</p>
          <p className="mt-1 text-sm leading-relaxed font-bold">{partners.names.join(", ")}.</p>
        </section>

        {/* ⑥ 검색창 + 사진 묶음 */}
        <section className="flex flex-col gap-3 rounded-[var(--radius)] bg-primary p-3 sm:p-4 lg:col-span-5">
          <a
            href="#features"
            className="flex items-center justify-between gap-3 rounded-full bg-card px-5 py-2.5 text-sm text-card-foreground"
          >
            <span className="truncate opacity-70">{classes.join(" · ") || "작업물 보기"}</span>
            <Search className="size-4 shrink-0" />
          </a>
          <div className="grid flex-1 grid-cols-2 gap-3">
            {[about.images[1], highlights.image].map((img) => (
              <div key={img.src} className="relative min-h-44 overflow-hidden rounded-[calc(var(--radius)-0.5rem)]">
                <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 260px, 50vw" className="object-cover sepia-[.25] saturate-[.8]" />
              </div>
            ))}
          </div>
        </section>

        {/* ⑦ 작업물 슬라이드 */}
        <section id="features" className={cn(tile, "scroll-mt-20 overflow-hidden p-6 sm:p-8 lg:col-span-12")}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-60">{features.eyebrow}</p>
              <h2 className="mt-1 font-serif text-4xl font-bold">{features.title}</h2>
            </div>
            <p className="max-w-sm text-sm opacity-75">{features.description}</p>
          </div>
          {works.length === 0 ? (
            <p className="mt-8 text-sm opacity-70">아직 등록된 작업물이 없습니다.</p>
          ) : (
            <Carousel label={features.title} className="mt-8">
              {works.map((w, i) => (
                <WorkCard
                  key={w.id}
                  title={w.title}
                  description={w.description}
                  imageUrl={w.image_url}
                  fileUrl={w.file_url ?? null}
                  fileName={w.file_name ?? null}
                  linkUrl={w.link_url}
                  linkEmbeddable={embeddable[i]}
                />
              ))}
            </Carousel>
          )}
        </section>

        {/* ⑧ 연락처 */}
        <section
          id="contact"
          className="flex scroll-mt-20 flex-col items-start gap-6 rounded-[var(--radius)] bg-primary p-6 text-primary-foreground sm:p-8 lg:col-span-12 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h2 className="font-serif text-4xl font-bold uppercase">Let&apos;s talk</h2>
            <p className="mt-2 text-sm opacity-75">{contact.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <a href={`mailto:${contact.email}`}>
                <Mail /> {contact.email}
              </a>
            </Button>
            {contact.links.map((link) => (
              <Button key={link.href} asChild variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </Button>
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
}
