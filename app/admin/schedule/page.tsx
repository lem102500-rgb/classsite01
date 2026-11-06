import Link from "next/link";
import { CalendarPlus, ChevronLeft, Clock, MapPin } from "lucide-react";

import { isAdmin } from "@/lib/admin-auth";
import { formatDate, getStudioItems, todayInKorea } from "@/lib/studio";
import { studioMenus, type StudioItem } from "@/lib/studio-config";
import { cn } from "@/lib/utils";
import { StudioPageHeader } from "../_components/studio-page";
import { StudioDeleteButton, StudioForm } from "../_components/studio-form";
import { MonthCalendar, YearCalendar } from "../_components/month-calendar";

export const metadata = { title: "강의 일정 · My Studio" };

const BASE = "/admin/schedule";

/** 강의 일정 — 기본: 왼쪽 달력 + 오른쪽 이 달 일정 목록. 날짜를 고르면 오른쪽에 그날 일정이 자세히 나옴
    주소 뒤 ?month=2026-12 : 보고 싶은 달 / &day=2026-12-03 : 고른 날짜 / &date=… : 그 날짜로 '일정 추가' 열기
    ?view=year : 1월~12월 한눈에 보기 */
export default async function SchedulePage(props: PageProps<"/admin/schedule">) {
  if (!(await isAdmin())) return null;
  const searchParams = await props.searchParams;
  const { items, error } = await getStudioItems("schedule");
  const today = todayInKorea();
  const param = (key: string) => (typeof searchParams[key] === "string" ? (searchParams[key] as string) : "");
  const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);

  const month = /^\d{4}-\d{2}$/.test(param("month")) ? param("month") : today.slice(0, 7);
  // 고른 날짜: 없으면 오른쪽에 이 달 전체 목록이 나옴
  const day = isDate(param("day")) ? param("day") : undefined;
  const pickedDate = isDate(param("date")) ? param("date") : undefined;

  const isYearView = param("view") === "year";
  const yearParam = Number(param("year"));
  const year = Number.isInteger(yearParam) && yearParam > 1900 && yearParam < 3000 ? yearParam : Number(today.slice(0, 4));

  const tabClass = (active: boolean) =>
    cn("rounded-full px-4 py-1.5 text-sm", active ? "bg-background font-medium shadow-sm" : "text-muted-foreground hover:text-foreground");

  return (
    <StudioPageHeader kind="schedule" error={error} defaults={pickedDate ? { date: pickedDate } : undefined}>
      {/* 월간 / 연간 보기 바꾸기 */}
      <div className="mb-4 inline-flex rounded-full bg-muted p-1">
        <Link href={`${BASE}?month=${isYearView ? `${year}-${today.slice(5, 7)}` : month}`} className={tabClass(!isYearView)} scroll={false}>
          월간
        </Link>
        <Link href={`${BASE}?view=year&year=${isYearView ? year : month.slice(0, 4)}`} className={tabClass(isYearView)} scroll={false}>
          연간 (1~12월)
        </Link>
      </div>

      {isYearView ? (
        <YearCalendar year={year} today={today} items={items} basePath={BASE} />
      ) : (
        // 기본 화면: 왼쪽 달력 + 오른쪽 목록 (휴대폰·좁은 화면에서는 위아래로)
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <MonthCalendar month={month} today={today} selected={day} items={items} basePath={BASE} />
          {day ? (
            <DayPanel day={day} month={month} today={today} items={items.filter((item) => item.date === day)} />
          ) : (
            <MonthPanel month={month} today={today} items={items.filter((item) => item.date?.startsWith(month))} />
          )}
        </div>
      )}
    </StudioPageHeader>
  );
}

/** 오른쪽 (기본): 이 달의 일정 전체를 날짜 순으로. 항목을 누르면 그 날짜를 골라 자세히 봄 */
function MonthPanel({ month, today, items }: { month: string; today: string; items: StudioItem[] }) {
  const sorted = [...items].sort((a, b) => `${a.date}${a.time ?? ""}`.localeCompare(`${b.date}${b.time ?? ""}`));
  const [, m] = month.split("-").map(Number);

  return (
    <aside className="flex flex-col rounded-2xl border bg-card lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)]" aria-label={`${m}월 일정 목록`}>
      <div className="flex items-center justify-between gap-3 border-b p-5">
        <h2 className="text-xl font-bold tracking-tight">{m}월 일정</h2>
        <span className="rounded-full bg-brand/60 px-2.5 py-0.5 text-xs font-medium">{sorted.length}건</span>
      </div>

      {sorted.length === 0 ? (
        <p className="p-8 text-center text-sm text-muted-foreground">
          이 달은 일정이 없어요.
          <br />
          왼쪽 달력에서 날짜를 눌러 추가해 보세요.
        </p>
      ) : (
        // 목록이 길면 이 안에서만 스크롤
        <ul className="min-h-0 flex-1 divide-y overflow-y-auto">
          {sorted.map((item) => {
            const past = item.date! < today;
            return (
              <li key={item.id}>
                <Link
                  href={`${BASE}?month=${month}&day=${item.date}`}
                  scroll={false}
                  className={cn("flex gap-3 px-5 py-3 hover:bg-muted/60", past && "opacity-55")}
                >
                  <span
                    className={cn(
                      "w-[5.5rem] shrink-0 text-xs leading-5 font-semibold whitespace-nowrap",
                      item.date === today && "text-primary",
                    )}
                  >
                    {item.date === today ? "오늘" : formatDate(item.date!)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{item.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {[item.time, item.place].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}

/** 오른쪽 (날짜를 골랐을 때): 그 날짜의 일정 목록 (시간 순) + 그 날짜로 일정 추가 */
function DayPanel({ day, month, today, items }: { day: string; month: string; today: string; items: StudioItem[] }) {
  const sorted = [...items].sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
  const past = day < today;

  return (
    <aside className="rounded-2xl border bg-card p-5 lg:sticky lg:top-6" aria-label={`${formatDate(day)} 일정`}>
      {/* 이 달 전체 목록으로 돌아가기 */}
      <Link
        href={`${BASE}?month=${month}`}
        scroll={false}
        className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-3.5" /> {Number(month.slice(5))}월 전체 일정
      </Link>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">{day === today ? "오늘" : past ? "지난 날" : "선택한 날"}</p>
          <h2 className="mt-0.5 text-xl font-bold tracking-tight">{formatDate(day)}</h2>
        </div>
        <span className="rounded-full bg-brand/60 px-2.5 py-0.5 text-xs font-medium">{sorted.length}건</span>
      </div>

      <Link
        href={`${BASE}?month=${month}&day=${day}&date=${day}#add`}
        scroll={false}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-dashed py-2.5 text-sm text-muted-foreground hover:border-solid hover:bg-muted hover:text-foreground"
      >
        <CalendarPlus className="size-4" /> 이 날짜에 일정 추가
      </Link>

      {sorted.length === 0 ? (
        <p className="mt-6 text-center text-sm text-muted-foreground">이 날은 일정이 없어요.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {sorted.map((item) => (
            <li key={item.id} id={`item-${item.id}`} className={cn("rounded-xl border bg-background", past && "opacity-60")}>
              <div className="flex gap-3 p-4">
                <div className="w-1 shrink-0 rounded-full bg-brand" />
                <div className="min-w-0 flex-1">
                  {item.time ? (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Clock className="size-3.5" /> {item.time}
                    </p>
                  ) : null}
                  <p className="mt-0.5 font-semibold">{item.title}</p>
                  {item.place ? (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-3.5" /> {item.place}
                    </p>
                  ) : null}
                  {item.memo ? <p className="mt-2 whitespace-pre-line text-sm text-foreground/75">{item.memo}</p> : null}
                </div>
              </div>
              <div className="flex items-center justify-between border-t px-4 py-1.5">
                <details className="flex-1">
                  <summary className="cursor-pointer py-1 text-sm text-muted-foreground">수정하기</summary>
                  <div className="pt-3 pb-2">
                    <StudioForm kind="schedule" fields={studioMenus.schedule.fields} item={item} submitLabel="수정 저장" />
                  </div>
                </details>
                <StudioDeleteButton id={item.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
