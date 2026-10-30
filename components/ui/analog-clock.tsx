"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/** 바늘 시계. 방문자 컴퓨터의 현재 시각을 1초마다 새로 그립니다. */
export function AnalogClock({ className }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0); // 화면이 뜨자마자 한 번
    const timer = setInterval(tick, 1000); // 그 뒤로 1초마다
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, []);

  // 바늘 각도 (12시 방향이 0도, 시계 방향으로 증가)
  const s = now?.getSeconds() ?? 0;
  const m = now?.getMinutes() ?? 0;
  const h = now?.getHours() ?? 0;
  const secondAngle = s * 6;
  const minuteAngle = m * 6 + s * 0.1;
  const hourAngle = (h % 12) * 30 + m * 0.5;

  const date = now
    ? now.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" })
    : " ";

  return (
    <figure className={cn("flex flex-col items-center", className)}>
      <svg
        viewBox="0 0 100 100"
        className="w-full"
        role="img"
        aria-label={now ? `현재 시각 ${h}시 ${m}분` : "시계"}
      >
        {/* 시계판 */}
        <circle cx="50" cy="50" r="48" className="fill-card stroke-border" strokeWidth="1.5" />

        {/* 눈금: 정시는 굵게, 나머지는 가늘게 */}
        {Array.from({ length: 60 }, (_, i) => {
          const isHour = i % 5 === 0;
          return (
            <line
              key={i}
              x1="50"
              y1="6"
              x2="50"
              y2={isHour ? 12 : 8.5}
              transform={`rotate(${i * 6} 50 50)`}
              className={isHour ? "stroke-foreground" : "stroke-muted-foreground/50"}
              strokeWidth={isHour ? 1.6 : 0.6}
              strokeLinecap="round"
            />
          );
        })}

        {/* 바늘 (시각을 알기 전에는 숨김) */}
        {now ? (
          <>
            <line
              x1="50" y1="50" x2="50" y2="27"
              transform={`rotate(${hourAngle} 50 50)`}
              className="stroke-foreground"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <line
              x1="50" y1="50" x2="50" y2="16"
              transform={`rotate(${minuteAngle} 50 50)`}
              className="stroke-foreground"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="50" y1="58" x2="50" y2="13"
              transform={`rotate(${secondAngle} 50 50)`}
              className="stroke-destructive"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          </>
        ) : null}
        <circle cx="50" cy="50" r="2" className="fill-destructive" />
      </svg>
      <figcaption className="mt-3 text-sm text-muted-foreground">{date}</figcaption>
    </figure>
  );
}
