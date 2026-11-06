import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProfileHero } from "@/components/sections/profile-hero";
import { Partners } from "@/components/sections/partners";
import { AboutProfile } from "@/components/sections/about-profile";
import { Features } from "@/components/sections/features";
import { Contact } from "@/components/sections/contact";

/* 메인 페이지 = 따뜻한 종이색 + 수채화 강사 일러스트 디자인 (섹션 블록을 위에서 아래로 쌓음)
   - 섹션 순서 바꾸기: 아래 줄의 순서를 바꾸면 됩니다. / 섹션 빼기: 해당 줄을 지우면 됩니다.
   다른 디자인 (파일은 모두 남아 있음):
   - Blush(노을 하늘):  <div className="theme-blush …"> <Navbar overlay /> <BlushHero /> <BlushCards /> <Features /> <BlushFooter />
                        (components/sections/blush-home.tsx)
   - 브라운 타일(벤토): <div className="theme-retro …"> <Navbar /> <BentoHome /> <Footer />
                        (components/sections/bento-home.tsx) */

// 관리자 페이지에서 내용을 바꾸면 최대 60초 안에 반영 (저장 즉시 반영도 되어 있음)
export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <ProfileHero />
        <Partners />
        <AboutProfile />
        <Features />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
