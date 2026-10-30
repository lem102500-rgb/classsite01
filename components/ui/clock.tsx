"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/** 숫자 시계. 방문자 컴퓨터의 현재 시각을 1초마다 새로 그립니다. */
export function Clock({ className }: { className?: string }) {
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

  // 화면이 처음 그려질 때는 시각을 비워 둠 (서버와 방문자 시각이 달라 깜빡이는 것 방지)
  const pad = (n: number) => String(n).padStart(2, "0");
  const time = now
    ? `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    : "--:--:--";
  const date = now
    ? now.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" })
    : " ";

  return (
    <div className={cn("inline-flex flex-col", className)}>
      <time
        dateTime={now?.toISOString()}
        className="font-mono text-4xl font-semibold tabular-nums tracking-tight sm:text-5xl"
      >
        {time}
      </time>
      <span className="mt-1 text-sm text-muted-foreground">{date}</span>
    </div>
  );
}
