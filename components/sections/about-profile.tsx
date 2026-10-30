import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/site.config";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

/* 프로필 소개 — 노란 큰 카드 안에 글 + 사진 2장.
   글자·사진은 site.config.ts 의 about 에서 바꿉니다. (예전 소개 섹션은 about.tsx 에 남아 있음) */
export function AboutProfile() {
  const { about } = siteConfig;
  const [wide, tall] = about.images;

  return (
    <section id="about" className="scroll-mt-16 py-10">
      <Container>
        <div className="grid gap-4 rounded-[2rem] bg-brand p-4 text-brand-foreground sm:p-6 lg:grid-cols-[1.15fr_1fr_0.7fr]">
          {/* 글 */}
          <div className="flex flex-col justify-center p-2 sm:p-4">
            <p className="inline-flex w-fit rounded-full bg-background px-4 py-1.5 text-xs font-medium text-foreground">
              {about.eyebrow}
            </p>
            <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {about.title}
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-relaxed text-brand-foreground/75">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Button asChild className="mt-7 w-fit pr-2">
              <a href={about.button.href}>
                {about.button.label}
                <span className="ml-1 inline-flex size-7 items-center justify-center rounded-full bg-background text-foreground">
                  <ArrowUpRight />
                </span>
              </a>
            </Button>
          </div>

          {/* 사진 2장 (모바일에서는 나란히) */}
          <div className="grid grid-cols-[1.4fr_1fr] gap-4 lg:contents">
            <div className="relative min-h-60 overflow-hidden rounded-[1.5rem] bg-background/40 lg:min-h-96">
              <Image src={wide.src} alt={wide.alt} fill sizes="(min-width: 1024px) 33vw, 60vw" className="object-cover sepia-[.15] saturate-[.8]" />
            </div>
            <div className="relative min-h-60 overflow-hidden rounded-[1.5rem] bg-background/40 lg:min-h-96">
              <Image src={tall.src} alt={tall.alt} fill sizes="(min-width: 1024px) 22vw, 40vw" className="object-cover sepia-[.15] saturate-[.8]" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
