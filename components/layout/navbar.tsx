"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

import { siteConfig } from "@/site.config";
import { Container } from "@/components/layout/container";

/** 상단 메뉴. 메뉴 항목은 site.config.ts 의 nav, 맨 오른쪽 관리자 메뉴는 secretButton 에서 바꿉니다.
    메뉴가 3개뿐이라 휴대폰에서도 한 줄로 그대로 보여줍니다. */
export function Navbar() {
  const linkClass = "text-foreground/80 transition-colors hover:text-foreground";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* 로고: 반짝이 아이콘 + 이름 (춤추는 효과를 다시 넣으려면 글자마다 animate-dance 를 붙이면 됨) */}
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight">
          <Sparkles className="size-5" strokeWidth={1.75} />
          {siteConfig.name}
        </Link>

        <nav className="flex items-center gap-4 text-sm sm:gap-6 sm:text-base">
          {siteConfig.nav.map((item) => (
            <a key={item.href} href={item.href} className={linkClass}>
              {item.label}
            </a>
          ))}
          {/* 관리자 페이지(비밀 공간)를 새 탭에서 열기 */}
          <a
            href={siteConfig.secretButton.href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {siteConfig.secretButton.label}
          </a>
        </nav>
      </Container>
    </header>
  );
}
