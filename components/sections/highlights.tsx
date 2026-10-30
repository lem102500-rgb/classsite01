import Image from "next/image";

import { siteConfig } from "@/site.config";
import { Container } from "@/components/layout/container";

/* 하이라이트 — 왼쪽 검정 카드(사진 + 태그) + 오른쪽 노란 숫자 카드.
   글자·숫자·사진은 site.config.ts 의 highlights 에서 바꿉니다. */
export function Highlights() {
  const { highlights } = siteConfig;
  const tagPositions = ["left-4 top-4", "right-4 top-1/2", "left-6 bottom-4"];

  return (
    <section id="highlights" className="scroll-mt-16 py-10">
      <Container className="grid gap-4 lg:grid-cols-[1fr_1.35fr]">
        {/* 검정 카드 */}
        <div className="flex flex-col rounded-[2rem] bg-primary p-6 text-primary-foreground">
          <p className="whitespace-pre-line text-lg font-semibold leading-snug">{highlights.darkTitle}</p>
          <div className="relative mt-5 min-h-56 flex-1 overflow-hidden rounded-[1.5rem] bg-primary-foreground/10">
            <Image
              src={highlights.image.src}
              alt={highlights.image.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover sepia-[.15] saturate-[.8]"
            />
            {highlights.tags.map((tag, i) => (
              <span
                key={tag}
                className={`absolute ${tagPositions[i % tagPositions.length]} rounded-full bg-background px-3.5 py-1 text-xs font-medium text-foreground`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 노란 숫자 카드 */}
        <div className="flex flex-col justify-between rounded-[2rem] bg-brand p-7 text-brand-foreground sm:p-9">
          <div>
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{highlights.title}</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-brand-foreground/75">
              {highlights.description}
            </p>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-3 border-t border-brand-foreground/15 pt-6">
            {highlights.stats.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-2xl font-bold tracking-tight sm:text-4xl">{stat.value}</dd>
                <dd className="mt-1 text-xs text-brand-foreground/70 sm:text-sm">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
