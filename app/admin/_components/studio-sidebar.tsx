"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  LayoutDashboard,
  Lightbulb,
  ListTodo,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";

import { logout } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

/* My Studio 왼쪽 메뉴 (Claude 앱처럼).
   - 컴퓨터: 왼쪽에 항상 보임 / 휴대폰: 위쪽 ☰ 버튼으로 열고 닫음
   - 메뉴 이름을 바꾸려면 아래 MAIN_MENU 의 label 을 고치면 됨 */

type MenuItem = { label: string; href: string; icon: LucideIcon };

const MAIN_MENU: MenuItem[] = [
  { label: "대시보드", href: "/admin", icon: LayoutDashboard },
  { label: "강의 일정", href: "/admin/schedule", icon: CalendarDays },
  { label: "할 일 관리", href: "/admin/todos", icon: ListTodo },
  { label: "수업 자료실", href: "/admin/materials", icon: BookOpen },
  { label: "아이디어 노트", href: "/admin/ideas", icon: Lightbulb },
];
const SITE_MENU: MenuItem[] = [{ label: "사이트 관리", href: "/admin/site", icon: Settings }];

export function StudioSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const link = (item: MenuItem) => {
    const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setOpen(false)}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
          active ? "bg-background font-medium text-foreground shadow-sm" : "text-foreground/70 hover:bg-background/60 hover:text-foreground",
        )}
      >
        <Icon className="size-4 shrink-0" />
        {item.label}
      </Link>
    );
  };

  const panel = (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 px-2 pt-1">
        <Sparkles className="size-5" strokeWidth={1.75} />
        <span className="text-lg font-bold tracking-tight">My Studio</span>
      </Link>

      <nav className="flex flex-col gap-1">{MAIN_MENU.map(link)}</nav>
      <div className="border-t" />
      <nav className="flex flex-col gap-1">{SITE_MENU.map(link)}</nav>

      <div className="mt-auto flex flex-col gap-1 border-t pt-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground/70 hover:bg-background/60 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          사이트로 돌아가기
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-foreground/70 hover:bg-background/60 hover:text-foreground"
          >
            <LogOut className="size-4" />
            로그아웃
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* 휴대폰: 위쪽 막대 */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/90 px-4 backdrop-blur md:hidden">
        <span className="flex items-center gap-2 font-bold">
          <Sparkles className="size-4" /> My Studio
        </span>
        <button
          type="button"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-full hover:bg-muted"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* 휴대폰: 펼친 메뉴 (뒤 배경을 누르면 닫힘) */}
      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" aria-label="메뉴 닫기" className="absolute inset-0 bg-foreground/20" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r bg-muted">{panel}</aside>
        </div>
      ) : null}

      {/* 컴퓨터: 항상 보이는 왼쪽 메뉴 */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-muted/70 md:block">{panel}</aside>
    </>
  );
}
