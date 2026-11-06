import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { siteConfig } from "@/site.config";
import { getHeroTexts } from "@/lib/data";
import { Container } from "@/components/layout/container";
import { Typewriter } from "@/components/ui/typewriter";
import { cn } from "@/lib/utils";

/* Blush 메인 페이지 조각들
   - BlushHero   : 노을 하늘 + 구름 + 가운데 제목 + 입력창 + 강사 일러스트 (그림: site.config.ts 의 blush.image)
   - BlushCards  : 크림 종이 위 테이프 붙은 폴라로이드 카드 4장 + 낙서 스티커
   - BlushFooter : 분홍·보라·초록 3칸 푸터
   글자·사진: site.config.ts 의 hero(첫 화면 글자는 My Studio → 사이트 관리), blush */

/** 뭉게구름 (흰 동그라미 여러 개를 겹쳐서 그림) */
function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 140" aria-hidden className={cn("pointer-events-none absolute", className)}>
      <g className="fill-white">
        <ellipse cx="160" cy="105" rx="150" ry="35" opacity="0.95" />
        <circle cx="95" cy="80" r="45" opacity="0.95" />
        <circle cx="160" cy="62" r="58" />
        <circle cx="230" cy="82" r="42" opacity="0.95" />
        <circle cx="45" cy="100" r="28" opacity="0.9" />
        <circle cx="280" cy="100" r="26" opacity="0.9" />
      </g>
    </svg>
  );
}


export async function BlushHero() {
  const { hero, blush, contact } = siteConfig;
  const texts = await getHeroTexts();
  const classes = texts["hero.eyebrow"]
    .split(/[,·]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[92svh] flex-col items-center overflow-hidden bg-linear-to-b from-sky-top via-sky-mid to-sky-bottom px-5 pt-32 pb-0 text-center text-white"
    >
      {/* 별 */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {[
          "top-[14%] left-[12%]",
          "top-[22%] left-[30%]",
          "top-[10%] right-[18%]",
          "top-[28%] right-[9%]",
          "top-[36%] left-[6%]",
          "top-[8%] left-[55%]",
        ].map((pos) => (
          <span key={pos} className={cn("absolute size-1 rounded-full bg-white/70", pos)} />
        ))}
      </div>

      {/* 구름 (양쪽 아래) */}
      <Cloud className="-bottom-6 -left-24 -z-10 w-[26rem] opacity-90 motion-safe:animate-float sm:w-[34rem]" />
      <Cloud className="right-[-7rem] bottom-16 -z-10 w-[22rem] opacity-80 [animation-delay:1.5s] motion-safe:animate-float sm:w-[30rem]" />

      {/* 수업 이름 알약 */}
      <ul className="flex flex-wrap justify-center gap-2">
        {classes.map((name) => (
          <li key={name} className="rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur-sm">
            {name}
          </li>
        ))}
      </ul>

      <h1 className="mt-6 text-[2.6rem] leading-[1.1] font-extrabold tracking-tight whitespace-pre-line drop-shadow-sm sm:text-6xl lg:text-7xl">
        {texts["hero.title"]}
      </h1>
      <p className="mt-5 min-h-7 text-base text-white/85 sm:text-lg">
        <Typewriter text={texts["hero.description"]} speed={80} delay={500} loop />
      </p>

      {/* 입력창: 적고 → 를 누르면 그 내용이 제목인 이메일 쓰기 창이 열림 */}
      <form
        action={`mailto:${contact.email}`}
        method="get"
        className="mt-8 flex w-full max-w-md items-center gap-2 rounded-full bg-white/15 p-1.5 pl-5 ring-1 ring-white/30 backdrop-blur-md"
      >
        <label htmlFor="blush-ask" className="sr-only">
          문의 내용
        </label>
        <input
          id="blush-ask"
          name="subject"
          placeholder={blush.inputPlaceholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/70 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="보내기"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-primary transition-transform hover:scale-105"
        >
          <ArrowRight className="size-4" />
        </button>
      </form>
      <div className="mt-4 flex gap-4 text-sm text-white/85">
        <a href={hero.primaryCta.href} className="underline-offset-4 hover:underline">
          {texts["hero.primaryCta"]}
        </a>
        <span aria-hidden>·</span>
        <a href={hero.secondaryCta.href} className="underline-offset-4 hover:underline">
          {texts["hero.secondaryCta"]}
        </a>
      </div>

      {/* 강사 일러스트 (배경이 투명한 그림) — 뒤에 분홍 노을빛을 깔고, 아래 크림 종이 쪽에 맞닿게 */}
      <div className="relative mt-auto w-[17rem] sm:w-[22rem]">
        {/* 뒤쪽 크림빛 후광: 그림의 밝은 부분(흰 셔츠 등)이 하늘색에 물들지 않고 하얗게 보이게 */}
        <div aria-hidden className="absolute inset-x-[8%] top-[6%] bottom-0 rounded-[45%] bg-card/85 blur-2xl" />
        <Image
          src={blush.image.src}
          alt={blush.image.alt}
          width={blush.image.width}
          height={blush.image.height}
          priority
          sizes="(min-width: 640px) 352px, 272px"
          className="relative h-auto w-full"
        />
      </div>
    </section>
  );
}

/** 작은 낙서 스티커들 */
function Doodle({ kind, className }: { kind: "star" | "heart" | "spark" | "swirl"; className?: string }) {
  const common = { fill: "none", strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={cn("pointer-events-none absolute size-8", className)}>
      {kind === "star" ? <path d="M20 5 L24 16 L35 17 L26 24 L29 35 L20 29 L11 35 L14 24 L5 17 L16 16 Z" stroke="var(--brand)" {...common} /> : null}
      {kind === "heart" ? <path d="M20 33 C6 23 6 11 14 9 C18 8 20 12 20 14 C20 12 22 8 26 9 C34 11 34 23 20 33 Z" stroke="var(--foot-purple)" {...common} /> : null}
      {kind === "spark" ? <path d="M20 4 V14 M20 26 V36 M4 20 H14 M26 20 H36" stroke="var(--foot-pink)" {...common} /> : null}
      {kind === "swirl" ? <path d="M8 22 C8 10 30 10 30 20 C30 28 16 28 18 20" stroke="var(--foot-green)" {...common} /> : null}
    </svg>
  );
}

export function BlushCards() {
  const { blush, about } = siteConfig;
  const tilts = ["-rotate-2", "rotate-1", "rotate-2", "-rotate-1"];
  const tapes = ["bg-foot-pink/45", "bg-foot-purple/40", "bg-foot-green/40", "bg-brand/50"];
  const doodles = ["star", "heart", "spark", "swirl"] as const;

  return (
    <section id="about" className="scroll-mt-16 bg-background py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">{about.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{about.title}</h2>
        </div>

        <ul className="mx-auto mt-14 grid max-w-4xl gap-x-10 gap-y-14 sm:grid-cols-2">
          {blush.cards.map((card, i) => (
            <li
              key={card.title}
              className={cn(
                "relative bg-card p-3 shadow-[0_14px_28px_-16px_rgb(45_42_58/0.45)] transition-transform duration-300 hover:rotate-0",
                tilts[i % tilts.length],
              )}
            >
              {/* 테이프 */}
              <span aria-hidden className={cn("absolute -top-3 left-8 h-6 w-20 -rotate-3", tapes[i % tapes.length])} />
              <Doodle kind={doodles[i % doodles.length]} className="-top-4 -right-3 rotate-12" />

              <div className="flex gap-4">
                <div className="relative aspect-square w-[45%] shrink-0 overflow-hidden bg-muted">
                  <Image src={card.image.src} alt={card.image.alt} fill sizes="(min-width: 640px) 200px, 40vw" className="object-cover" />
                </div>
                <div className="flex flex-col justify-center py-2 pr-2">
                  <p className="font-hand text-3xl leading-none">{card.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function BlushFooter() {
  const { nav, secretButton, contact, footer, name } = siteConfig;
  const head = "text-sm font-bold";
  const item = "text-sm text-white/90 hover:text-white hover:underline underline-offset-4";

  return (
    <footer id="contact" className="scroll-mt-16 text-white">
      <div className="grid sm:grid-cols-3">
        <div className="bg-foot-pink px-8 py-12 sm:px-10 sm:py-16">
          <p className={head}>메뉴</p>
          <ul className="mt-4 space-y-2">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className={item}>
                  {n.label}
                </a>
              </li>
            ))}
            <li>
              <Link href={secretButton.href} className={item}>
                {secretButton.label}
              </Link>
            </li>
          </ul>
        </div>
        <div className="bg-foot-purple px-8 py-12 sm:px-10 sm:py-16">
          <p className={head}>수업</p>
          <ul className="mt-4 space-y-2 text-sm text-white/90">
            {siteConfig.blush.cards.map((c) => (
              <li key={c.title}>{c.title}</li>
            ))}
          </ul>
        </div>
        <div className="bg-foot-green px-8 py-12 sm:px-10 sm:py-16">
          <p className={head}>연락처</p>
          <ul className="mt-4 space-y-2">
            <li>
              <a href={`mailto:${contact.email}`} className={item}>
                {contact.email}
              </a>
            </li>
            {contact.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noreferrer" className={item}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-primary px-8 py-4 text-center text-xs text-primary-foreground/70">
        {footer.copyright.replace("Eunmi", name.replace(/\.$/, ""))}
      </div>
    </footer>
  );
}
