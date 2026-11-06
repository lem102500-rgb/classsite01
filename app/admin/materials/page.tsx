import { ExternalLink, FileText, Link2, Presentation, type LucideIcon } from "lucide-react";

import { isAdmin } from "@/lib/admin-auth";
import { getStudioItems } from "@/lib/studio";
import { MATERIAL_TYPES, studioMenus } from "@/lib/studio-config";
import { EmptyState, StudioPageHeader } from "../_components/studio-page";
import { StudioDeleteButton, StudioForm } from "../_components/studio-form";

export const metadata = { title: "수업 자료실 · My Studio" };

const ICONS: Record<string, LucideIcon> = { 교안: FileText, PPT: Presentation, "실습 링크": Link2 };

/** 수업 자료실 — 교안 / PPT / 실습 링크 종류별로 묶어서 보여줌 */
export default async function MaterialsPage() {
  if (!(await isAdmin())) return null;
  const { items, error } = await getStudioItems("material");

  return (
    <>
      <StudioPageHeader kind="material" error={error} />

      <div className="mt-10 space-y-10">
        {items.length === 0 ? <EmptyState>아직 등록된 자료가 없어요. 위에서 추가해 보세요.</EmptyState> : null}
        {MATERIAL_TYPES.map((type) => {
          const list = items.filter((item) => (item.category ?? MATERIAL_TYPES[0]) === type);
          if (list.length === 0) return null;
          const Icon = ICONS[type];
          return (
            <section key={type}>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Icon className="size-5" /> {type}
                <span className="text-sm font-normal text-muted-foreground">{list.length}</span>
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {list.map((item) => (
                  <li key={item.id} className="rounded-2xl border bg-card">
                    <div className="flex items-start gap-3 p-5">
                      <div className="min-w-0 flex-1">
                        {item.link_url ? (
                          <a
                            href={item.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-semibold hover:underline"
                          >
                            {item.title}
                            <ExternalLink className="size-3.5 text-muted-foreground" />
                          </a>
                        ) : (
                          <p className="font-semibold">{item.title}</p>
                        )}
                        {item.memo ? (
                          <p className="mt-1.5 whitespace-pre-line text-sm text-muted-foreground">{item.memo}</p>
                        ) : null}
                      </div>
                      <StudioDeleteButton id={item.id} />
                    </div>
                    <details className="border-t px-5 py-3">
                      <summary className="cursor-pointer text-sm text-muted-foreground">수정하기</summary>
                      <div className="pt-4">
                        <StudioForm kind="material" fields={studioMenus.material.fields} item={item} submitLabel="수정 저장" />
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
