import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/site.config";
import { getHeroTexts } from "@/lib/data";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Typewriter } from "@/components/ui/typewriter";

// 타이핑 속도(한 글자 간격, 밀리초)와 시작 전 기다림
const TITLE_SPEED = 85;
const TITLE_DELAY = 300;

/* 프로필 첫 화면 — 왼쪽 큰 제목 + 오른쪽 배경에 녹아든 일러스트(알약 태그).
   - 글자: 관리자 페이지 '히어로 글자' 탭 (비어 있으면 site.config.ts 의 hero)
   - 사진·태그: site.config.ts 의 hero.image, hero.tags
   - 예전 첫 화면(시계·날씨 포함)은 hero.tsx 에 그대로 남아 있음 */
export async function ProfileHero() {
  const { hero } = siteConfig;
  const texts = await getHeroTexts();

  // 사진 위에 흩어 놓을 태그 위치 (왼쪽 위 / 오른쪽 가운데 / 왼쪽 아래)
  const tagPositions = ["left-5 top-[18%]", "right-5 top-[42%]", "left-8 bottom-[16%]"];

  return (
    <section id="top" className="pt-6 pb-16 sm:pt-10">
      <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        {/* 왼쪽: 글자 */}
        <div className="min-w-0">
          <p className="inline-flex rounded-full bg-muted px-4 py-1.5 text-xs font-medium">
            {texts["hero.eyebrow"]}
          </p>
          <h1 className="mt-6 whitespace-pre-line text-4xl font-bold leading-[1.18] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            {/* 제목을 한 글자씩 타이핑 → 끝나면 부제가 이어서 타이핑됨 */}
            <Typewriter text={texts["hero.title"]} speed={TITLE_SPEED} delay={TITLE_DELAY} />
          </h1>
          {/* 한 줄 부제: 왼쪽 연두 선으로 수채화 붓 자국 느낌 */}
          <p className="mt-7 max-w-md border-l-4 border-brand pl-4 text-lg leading-relaxed text-foreground/70 sm:text-xl">
            <Typewriter
              text={texts["hero.description"]}
              speed={55}
              delay={TITLE_DELAY + Array.from(texts["hero.title"]).length * TITLE_SPEED + 350}
              keepCursor
            />
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild variant="brand" size="lg" className="pr-2">
              <a href={hero.primaryCta.href}>
                {texts["hero.primaryCta"]}
                <span className="ml-2 inline-flex size-8 items-center justify-center rounded-full bg-background">
                  <ArrowUpRight />
                </span>
              </a>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a href={hero.secondaryCta.href}>{texts["hero.secondaryCta"]}</a>
            </Button>
          </div>
        </div>

        {/* 오른쪽: 배경을 투명하게 만든 일러스트 — 네모난 틀 없이 사람만 페이지 위에 올라감
            뒤쪽에 연두 물감 번짐을 깔아 수채화 느낌을 이어줌 */}
        <div className="relative mx-auto w-full max-w-md lg:mr-0">
          <div aria-hidden className="absolute left-[18%] top-[6%] size-[72%] rounded-full bg-brand/55 blur-3xl" />
          <div aria-hidden className="absolute bottom-[4%] left-[4%] h-[14%] w-[88%] rounded-full bg-primary/5 blur-xl" />
          <div className="relative">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              width={hero.image.width}
              height={hero.image.height}
              priority
              sizes="(min-width: 1024px) 448px, 90vw"
              className="h-auto w-full"
            />
            {hero.tags.map((tag, i) => (
              <span
                key={tag}
                className={`absolute ${tagPositions[i % tagPositions.length]} rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-lg`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
