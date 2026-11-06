"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";


/* 좌우로 넘기는 카드 줄 (슬라이드).
   - 화살표 버튼으로 한 칸씩 이동, 휴대폰에서는 손가락으로 밀어서 넘김
   - 카드 너비: 휴대폰 1장 / 태블릿 2장 / 컴퓨터 3장이 한 화면에 보임
   - 끝에 닿으면 그쪽 화살표는 흐려짐 */
export function Carousel({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const first = setTimeout(update, 0);
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(first);
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  // 카드 한 장 너비만큼 이동
  const move = (dir: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
  };

  const buttonClass =
    "inline-flex size-11 items-center justify-center rounded-full border border-current/25 transition-opacity hover:bg-current/10 disabled:pointer-events-none disabled:opacity-30";

  return (
    <div className={className} role="region" aria-roledescription="슬라이드" aria-label={label}>
      <ul
        ref={trackRef}
        className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto scroll-smooth px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <li className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]">
            {child}
          </li>
        ))}
      </ul>

      {/* 카드가 한 화면에 다 들어가면 두 화살표 모두 흐리게 보임 */}
      <div className="mt-8 flex justify-end gap-3">
        <button type="button" className={buttonClass} onClick={() => move(-1)} disabled={!canPrev} aria-label="이전 작업물">
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" className={buttonClass} onClick={() => move(1)} disabled={!canNext} aria-label="다음 작업물">
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
