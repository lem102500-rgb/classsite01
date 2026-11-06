import { Plus } from "lucide-react";

import { studioMenus, type StudioKind } from "@/lib/studio-config";
import { StudioForm } from "./studio-form";

/** 각 메뉴 페이지 위쪽: 제목 + 설명 + 접었다 펴는 '추가' 상자 + (오류가 있으면) 안내 */
export function StudioPageHeader({ kind, error }: { kind: StudioKind; error: string | null }) {
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

      <details className="group mt-8 rounded-2xl border bg-card">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-4 font-medium">
          <Plus className="size-4 transition-transform group-open:rotate-45" />
          {menu.addLabel}
        </summary>
        <div className="border-t px-5 py-5">
          <StudioForm kind={kind} fields={menu.fields} submitLabel={menu.addLabel} />
        </div>
      </details>
    </>
  );
}

/** 목록이 비어 있을 때 */
export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">{children}</p>;
}
