import "server-only";

import { getAdminClient } from "@/lib/supabase-admin";
import type { StudioItem, StudioKind } from "@/lib/studio-config";

/**
 * My Studio 항목 목록을 가져옵니다. (관리자 전용 — 비밀 키로만 읽음)
 * - 날짜가 있는 것은 날짜 순, 같은 날이면 먼저 만든 순
 * - 표가 아직 없거나 연결이 안 됐으면 error 에 이유를 담아 돌려줌
 */
export async function getStudioItems(kind?: StudioKind) {
  const supabase = getAdminClient();
  if (!supabase) return { items: [] as StudioItem[], error: "Supabase가 연결되지 않았습니다." };

  let query = supabase
    .from("studio_items")
    .select("*")
    .order("date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });
  if (kind) query = query.eq("kind", kind);

  const { data, error } = await query;
  return { items: (data ?? []) as StudioItem[], error: error?.message ?? null };
}

/** 오늘 날짜 (한국 시간 기준, "2026-11-06" 모양) */
export function todayInKorea() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
}

/** "2026-11-06" → "11월 6일 (금)" */
export function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

/** "2026-11-06" → "2026년 11월" */
export function formatMonth(date: string) {
  const [y, m] = date.split("-");
  return `${y}년 ${Number(m)}월`;
}
