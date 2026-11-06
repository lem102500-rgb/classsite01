import Link from "next/link";
import { ArrowUpRight, BookOpen, CalendarDays, Lightbulb, ListTodo, type LucideIcon } from "lucide-react";

import { isAdmin } from "@/lib/admin-auth";
import { formatDate, getStudioItems, todayInKorea } from "@/lib/studio";
import { studioMenus, TODO_STATUSES, type StudioKind } from "@/lib/studio-config";

/* My Studio 첫 화면 — 나의 대시보드 (주소: /admin)
   네 메뉴를 카드로 보여주고, 카드마다 요약(다가오는 일정, 할 일 개수 등)을 붙임 */

export const metadata = { title: "대시보드 · My Studio" };

const ICONS: Record<StudioKind, LucideIcon> = {
  schedule: CalendarDays,
  todo: ListTodo,
  material: BookOpen,
  idea: Lightbulb,
};

export default async function StudioDashboard() {
  if (!(await isAdmin())) return null;

  const { items, error } = await getStudioItems();
  const today = todayInKorea();
  const byKind = (kind: StudioKind) => items.filter((item) => item.kind === kind);

  const upcoming = byKind("schedule").filter((item) => item.date && item.date >= today).slice(0, 3);
  const todos = byKind("todo");
  const todayLabel = new Date().toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // 카드마다 붙일 요약 내용
  const details: Record<StudioKind, React.ReactNode> = {
    schedule:
      upcoming.length === 0 ? (
        <p className="text-muted-foreground">다가오는 강의가 없어요.</p>
      ) : (
        <ul className="space-y-1.5">
          {upcoming.map((item) => (
            <li key={item.id} className="flex gap-3">
              <span className="w-24 shrink-0 font-medium">{item.date === today ? "오늘" : formatDate(item.date!)}</span>
              <span className="truncate text-foreground/75">{item.title}</span>
            </li>
          ))}
        </ul>
      ),
    todo: (
      <div className="flex gap-2">
        {TODO_STATUSES.map((status) => (
          <span key={status} className="rounded-full bg-muted px-3 py-1 text-xs">
            {status} <b className="ml-1">{todos.filter((t) => (t.status ?? TODO_STATUSES[0]) === status).length}</b>
          </span>
        ))}
      </div>
    ),
    material: <p className="text-muted-foreground">자료 {byKind("material").length}개</p>,
    idea: <p className="text-muted-foreground">노트 {byKind("idea").length}개</p>,
  };

  return (
    <>
      <header>
        <p className="text-sm text-muted-foreground">{todayLabel}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">나의 대시보드</h1>
        <p className="mt-2 text-sm text-muted-foreground">오늘의 강의와 해야 할 일을 한눈에</p>
      </header>

      {error ? (
        <p className="mt-6 rounded-xl border border-destructive/40 p-4 text-sm text-destructive">
          데이터를 불러오지 못했습니다: {error}
          <br />
          supabase/schema.sql 을 Supabase SQL Editor 에서 다시 실행했는지 확인하세요.
        </p>
      ) : null}

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {(Object.keys(studioMenus) as StudioKind[]).map((kind) => {
          const menu = studioMenus[kind];
          const Icon = ICONS[kind];
          return (
            <Link
              key={kind}
              href={menu.href}
              className="group flex flex-col gap-5 rounded-2xl border bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-start justify-between">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand/50">
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{menu.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{menu.summary}</p>
              </div>
              <div className="mt-auto border-t pt-4 text-sm">{details[kind]}</div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
