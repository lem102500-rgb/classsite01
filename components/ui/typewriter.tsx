"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/* 글자를 한 글자씩 타이핑하듯 보여주는 부품.
   - speed: 한 글자 나오는 간격(밀리초), delay: 시작 전 기다리는 시간(밀리초)
   - keepCursor: 다 쓴 뒤에도 깜빡이는 커서를 남길지
   - loop: 다 쓰면 잠시 멈췄다가 지우고 다시 쓰기를 계속 반복 (hold: 다 쓴 뒤 멈추는 시간)
   - 자리를 미리 잡아 두어 글자가 나오는 동안 아래 내용이 들썩이지 않음
   - '움직임 줄이기'를 켠 사람에게는 처음부터 전체 글자를 보여줌 */
export function Typewriter({
  text,
  speed = 70,
  delay = 0,
  keepCursor = false,
  loop = false,
  hold = 2500,
  className,
}: {
  text: string;
  speed?: number;
  delay?: number;
  keepCursor?: boolean;
  loop?: boolean;
  hold?: number;
  className?: string;
}) {
  const chars = Array.from(text); // 한글도 한 글자씩 정확히 자르기
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = chars.length;
    let n = 0;
    let typing = true; // true: 쓰는 중 / false: 지우는 중
    let timer: ReturnType<typeof setTimeout> | undefined;

    const step = () => {
      if (typing) {
        n += 1;
        setCount(n);
        if (n >= total) {
          if (!loop) return; // 반복 안 하면 여기서 끝
          typing = false;
          timer = setTimeout(step, hold); // 다 쓴 문장을 잠시 보여줌
          return;
        }
        timer = setTimeout(step, speed);
      } else {
        n -= 1;
        setCount(n);
        if (n <= 0) {
          typing = true;
          timer = setTimeout(step, 600); // 빈 상태로 잠깐 쉬었다가 다시 쓰기
          return;
        }
        timer = setTimeout(step, Math.max(20, speed / 2)); // 지울 때는 두 배 빠르게
      }
    };

    const start = setTimeout(
      () => {
        setStarted(true);
        if (reduce) {
          setCount(total);
          return;
        }
        step();
      },
      reduce ? 0 : delay,
    );
    return () => {
      clearTimeout(start);
      if (timer) clearTimeout(timer);
    };
  }, [chars.length, speed, delay, loop, hold]);

  const done = count >= chars.length;
  const showCursor = started && (!done || keepCursor || loop);

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
