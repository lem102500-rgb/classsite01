import { Plus } from "lucide-react";

import { studioMenus, type StudioField, type StudioKind } from "@/lib/studio-config";
import { StudioForm } from "./studio-form";

/** 각 메뉴 페이지 위쪽: 제목 + 설명 + 접었다 펴는 '추가' 상자 + (오류가 있으면) 안내
    defaults 를 주면 '추가' 상자가 펼쳐진 채로, 그 값이 미리 채워짐 (달력에서 날짜를 눌렀을 때) */
export function StudioPageHeader({
  kind,
  error,
  defaults,
  children,
}: {
  kind: StudioKind;
  error: string | null;
  defaults?: Partial<Record<StudioField["name"], string>>;
  /** 제목과 '추가' 상자 사이에 넣을 내용 (예: 달력) */
  children?: React.ReactNode;
}) {
  const menu = studioMenus[kind];
  return (
    <>
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{menu.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{menu.summary}</p>
      </header>

      {error ? (
        <p className="mt-6 rounded-xl border border-destructive/40 p-4 text-sm text-destructive">
          데이터를 불러오지 못했습니다: {error}
          <br />
          supabase/schema.sql 을 Supabase SQL Editor 에서 다시 실행했는지 확인하세요.
        </p>
      ) : null}

      {children ? <div className="mt-8">{children}</div> : null}

      <details id="add" open={Boolean(defaults)} className="group mt-6 scroll-mt-6 rounded-2xl border bg-card">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-4 font-medium">
          <Plus className="size-4 transition-transform group-open:rotate-45" />
          {menu.addLabel}
          {defaults?.date ? <span className="text-sm font-normal text-muted-foreground">· {defaults.date}</span> : null}
        </summary>
        <div className="border-t px-5 py-5">
          {/* key: 다른 날짜를 누르면 입력 칸을 새로 그려서 날짜가 바뀌게 함 */}
          <StudioForm
            key={defaults?.date ?? "new"}
            kind={kind}
            fields={menu.fields}
            defaults={defaults}
            autoFocus={Boolean(defaults)}
            submitLabel={menu.addLabel}
          />
        </div>
      </details>
    </>
  );
}

/** 목록이 비어 있을 때 */
export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">{children}</p>;
}
