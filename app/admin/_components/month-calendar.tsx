import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { StudioItem } from "@/lib/studio-config";
import { cn } from "@/lib/utils";

/* 강의 일정 달력 (한 달 보기)
   - month: "2026-11" 모양. 위쪽 ‹ › 로 이전/다음 달 이동, "오늘"로 이번 달 복귀
   - 일정이 있는 날: 컴퓨터에서는 강의명이, 휴대폰에서는 작은 점이 보임
   - 날짜 칸을 누르면 그 날짜를 골라서, 오른쪽 패널에 그날 일정이 나옴 (schedule/page.tsx 의 DayPanel) */

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** "2026-11" 에 달 수를 더한 값 (예: -1 → "2026-10") */
export function shiftMonth(month: string, diff: number) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + diff, 1));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
}

/** 한 달의 달력 칸 목록 (앞쪽 빈칸 + 1일~말일 + 뒤쪽 빈칸, 7의 배수) */
function monthCells(month: string) {
  const [y, m] = month.split("-").map(Number);
  const firstWeekday = new Date(Date.UTC(y, m - 1, 1)).getUTCDay(); // 0 = 일요일
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells: (string | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => `${month}-${pad(i + 1)}`),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/* 1년 달력 — 1월~12월 작은 달력을 한 화면에 (컴퓨터 4칸 / 태블릿 3칸 / 휴대폰 2칸)
   - 강의가 있는 날은 연두색 동그라미, 오늘은 검은 동그라미
   - 날짜를 누르면 그 달의 월간 달력으로 가서 그 날짜의 일정을 보여줌
   - 달 이름을 누르면 그 달의 월간 달력으로 이동 */
export function YearCalendar({
  year,
  today,
  items,
  basePath,
}: {
  year: number;
  today: string;
  items: StudioItem[];
  basePath: string;
}) {
  const byDate = new Map<string, StudioItem[]>();
  for (const item of items) {
    if (item.date?.startsWith(`${year}-`)) byDate.set(item.date, [...(byDate.get(item.date) ?? []), item]);
  }
  const yearTotal = [...byDate.values()].reduce((sum, list) => sum + list.length, 0);
  const navClass = "inline-flex size-9 items-center justify-center rounded-full border hover:bg-muted";

  return (
    <section className="rounded-2xl border bg-card p-4 sm:p-6" aria-label={`${year}년 달력`}>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-bold tracking-tight">{year}</h2>
        <span className="rounded-full bg-brand/60 px-2.5 py-0.5 text-xs font-medium">올해 강의 {yearTotal}건</span>
        <div className="ml-auto flex items-center gap-2">
          <Link href={`${basePath}?view=year&year=${year - 1}`} className={navClass} aria-label="이전 해" scroll={false}>
            <ChevronLeft className="size-4" />
          </Link>
          <Link href={`${basePath}?view=year`} className="rounded-full border px-3 py-1.5 text-xs hover:bg-muted" scroll={false}>
            올해
          </Link>
          <Link href={`${basePath}?view=year&year=${year + 1}`} className={navClass} aria-label="다음 해" scroll={false}>
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 12 }, (_, i) => {
          const month = `${year}-${pad(i + 1)}`;
          const count = [...byDate.entries()].filter(([date]) => date.startsWith(month)).reduce((s, [, l]) => s + l.length, 0);
          const isThisMonth = today.startsWith(month);
          return (
            <div key={month} className={cn("overflow-hidden rounded-xl border", isThisMonth && "ring-2 ring-primary/70")}>
              {/* 달 이름 줄 */}
              <Link
                href={`${basePath}?month=${month}`}
                className="flex items-center justify-between bg-brand/40 px-3 py-1.5 text-sm font-semibold hover:bg-brand/70"
              >
                {i + 1}월
                {count > 0 ? (
                  <span className="rounded-full bg-background px-1.5 text-[11px] font-medium">{count}</span>
                ) : null}
              </Link>

              <div className="p-1.5 sm:p-2">
                <div className="grid grid-cols-7 text-center text-[10px] text-muted-foreground">
                  {WEEKDAYS.map((day, d) => (
                    <span key={day} className={cn(d === 0 && "text-destructive/80", d === 6 && "text-primary/70")}>
                      {day}
                    </span>
                  ))}
                </div>
                <div className="mt-0.5 grid grid-cols-7 text-center text-[11px] sm:text-xs">
                  {monthCells(month).map((date, c) => {
                    if (!date) return <span key={`e-${c}`} />;
                    const list = byDate.get(date) ?? [];
                    const has = list.length > 0;
                    const isToday = date === today;
                    const weekday = c % 7;
                    return (
                      <Link
                        key={date}
                        href={`${basePath}?month=${month}&day=${date}`}
                        title={has ? list.map((it) => [it.time, it.title].filter(Boolean).join(" ")).join("\n") : undefined}
                        className={cn(
                          "mx-auto my-px inline-flex size-6 items-center justify-center rounded-full hover:bg-muted sm:size-7",
                          has && "bg-brand font-semibold text-brand-foreground hover:bg-brand/80",
                          isToday && "bg-primary font-bold text-primary-foreground hover:bg-primary/90",
                          !has && !isToday && weekday === 0 && "text-destructive/80",
                          !has && !isToday && weekday === 6 && "text-primary/70",
                        )}
                      >
                        {Number(date.slice(-2))}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-brand" /> 강의 있는 날
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-primary" /> 오늘
        </span>
        <span>날짜에 마우스를 올리면 강의명이 보여요.</span>
      </p>
    </section>
  );
}

export function MonthCalendar({
  month,
  today,
  selected,
  items,
  basePath,
}: {
  month: string;
  today: string;
  /** 지금 고른 날짜 (칸이 강조됨) */
  selected?: string;
  items: StudioItem[];
  basePath: string;
}) {
  const [y, m] = month.split("-").map(Number);

  // 날짜별 일정 묶기
  const byDate = new Map<string, StudioItem[]>();
  for (const item of items) {
    if (item.date?.startsWith(month)) byDate.set(item.date, [...(byDate.get(item.date) ?? []), item]);
  }

  // 달력 칸: 앞쪽 빈칸 + 1일~말일 + 뒤쪽 빈칸 (7의 배수로 맞춤)
  const cells = monthCells(month);

  const total = [...byDate.values()].reduce((sum, list) => sum + list.length, 0);
  const navClass = "inline-flex size-9 items-center justify-center rounded-full border hover:bg-muted";

  return (
    <section className="rounded-2xl border bg-card p-4 sm:p-6" aria-label={`${y}년 ${m}월 달력`}>
      {/* 위쪽: 달 이름 + 이동 버튼 */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-bold tracking-tight">
          {y}년 {m}월
        </h2>
        <span className="rounded-full bg-brand/60 px-2.5 py-0.5 text-xs font-medium">강의 {total}건</span>
        <div className="ml-auto flex items-center gap-2">
          <Link href={`${basePath}?month=${shiftMonth(month, -1)}`} className={navClass} aria-label="이전 달" scroll={false}>
            <ChevronLeft className="size-4" />
          </Link>
          <Link href={basePath} className="rounded-full border px-3 py-1.5 text-xs hover:bg-muted" scroll={false}>
            오늘
          </Link>
          <Link href={`${basePath}?month=${shiftMonth(month, 1)}`} className={navClass} aria-label="다음 달" scroll={false}>
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* 요일 줄 */}
      <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
        {WEEKDAYS.map((day, i) => (
          <div key={day} className={cn("pb-2", i === 0 && "text-destructive/80", i === 6 && "text-primary/70")}>
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 칸 */}
      <div className="grid grid-cols-7 overflow-hidden rounded-xl border-t border-l">
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} className="min-h-14 border-r border-b bg-muted/30 sm:min-h-24" />;
          const day = Number(date.slice(-2));
          const list = byDate.get(date) ?? [];
          const isToday = date === today;
          const weekday = i % 7;
          return (
            <div
              key={date}
              className={cn(
                "group relative min-h-14 border-r border-b p-1 sm:min-h-24 sm:p-1.5",
                date === selected && "bg-brand/20 ring-2 ring-primary/40 ring-inset",
              )}
            >
              {/* 칸 전체: 누르면 이 날짜를 골라서 오른쪽에 그날 일정을 보여줌 */}
              <Link
                href={`${basePath}?month=${month}&day=${date}`}
                className="absolute inset-0 hover:bg-brand/15"
                aria-label={`${m}월 ${day}일 일정 보기${list.length ? ` (${list.length}건)` : ""}`}
                aria-current={date === selected ? "date" : undefined}
                scroll={false}
              />
              <div className="relative flex items-center justify-between">
                <span
                  className={cn(
                    "inline-flex size-6 items-center justify-center rounded-full text-xs",
                    isToday && "bg-primary font-bold text-primary-foreground",
                    !isToday && weekday === 0 && "text-destructive/80",
                    !isToday && weekday === 6 && "text-primary/70",
                  )}
                >
                  {day}
                </span>
              </div>

              {/* 일정: 컴퓨터 = 강의명 / 휴대폰 = 점 */}
              {list.length > 0 ? (
                <>
                  {/* 강의명 표시 (누르면 칸과 똑같이 그 날짜를 고름) */}
                  <ul className="pointer-events-none relative mt-1 hidden space-y-1 sm:block">
                    {list.slice(0, 3).map((item) => (
                      <li
                        key={item.id}
                        title={[item.time, item.title, item.place].filter(Boolean).join(" · ")}
                        className="truncate rounded-md bg-brand px-1.5 py-0.5 text-[11px] leading-tight font-medium text-brand-foreground"
                      >
                        {item.time ? <span className="mr-1 opacity-70">{item.time.split(/[~-]/)[0]}</span> : null}
                        {item.title}
                      </li>
                    ))}
                    {list.length > 3 ? <li className="px-1 text-[11px] text-muted-foreground">+{list.length - 3}건 더</li> : null}
                  </ul>
                  <div className="pointer-events-none relative mt-1 flex justify-center gap-0.5 sm:hidden">
                    {list.slice(0, 3).map((item) => (
                      <span key={item.id} className="size-1.5 rounded-full bg-primary/70" />
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
