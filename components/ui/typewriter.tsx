"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/* 글자를 한 글자씩 타이핑하듯 보여주는 부품.
   - speed: 한 글자 나오는 간격(밀리초), delay: 시작 전 기다리는 시간(밀리초)
   - keepCursor: 다 쓴 뒤에도 깜빡이는 커서를 남길지
   - 자리를 미리 잡아 두어 글자가 나오는 동안 아래 내용이 들썩이지 않음
   - '움직임 줄이기'를 켠 사람에게는 처음부터 전체 글자를 보여줌 */
export function Typewriter({
  text,
  speed = 70,
  delay = 0,
  keepCursor = false,
  className,
}: {
  text: string;
  speed?: number;
  delay?: number;
  keepCursor?: boolean;
  className?: string;
}) {
  const chars = Array.from(text); // 한글도 한 글자씩 정확히 자르기
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(
      () => {
        setStarted(true);
        if (reduce) {
          setCount(chars.length);
          return;
        }
        timer = setInterval(() => {
          setCount((n) => {
            if (n + 1 >= chars.length && timer) clearInterval(timer);
            return Math.min(n + 1, chars.length);
          });
        }, speed);
      },
      reduce ? 0 : delay,
    );
    return () => {
      clearTimeout(start);
      if (timer) clearInterval(timer);
    };
  }, [chars.length, speed, delay]);

  const done = count >= chars.length;
  const showCursor = started && (!done || keepCursor);

  return (
    <span className={cn("relative", className)}>
      {/* 화면 읽기 프로그램과 검색엔진용: 전체 글자 */}
      <span className="sr-only">{text}</span>
      <span aria-hidden className="grid">
        {/* 자리 잡기용 (보이지 않음) */}
        <span className="invisible col-start-1 row-start-1">{text}</span>
        {/* 실제로 타이핑되는 글자 + 커서 */}
        <span className="col-start-1 row-start-1">
          {chars.slice(0, count).join("")}
          {showCursor ? (
            <span className="ml-1 inline-block h-[0.9em] w-[0.08em] min-w-[2px] translate-y-[0.1em] bg-current motion-safe:animate-blink" />
          ) : null}
        </span>
      </span>
    </span>
  );
}
