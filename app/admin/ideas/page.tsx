import { isAdmin } from "@/lib/admin-auth";
import { getStudioItems } from "@/lib/studio";
import { IDEA_TYPES, studioMenus } from "@/lib/studio-config";
import { cn } from "@/lib/utils";
import { EmptyState, StudioPageHeader } from "../_components/studio-page";
import { StudioDeleteButton, StudioForm } from "../_components/studio-form";

export const metadata = { title: "아이디어 노트 · My Studio" };

/** 아이디어 노트 — 메모지 카드처럼 보여줌. 최근에 쓴 노트가 앞에 */
export default async function IdeasPage() {
  if (!(await isAdmin())) return null;
  const { items, error } = await getStudioItems("idea");
  const notes = [...items].sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <>
      <StudioPageHeader kind="idea" error={error} />

      <div className="mt-10">
        {notes.length === 0 ? <EmptyState>아직 노트가 없어요. 떠오른 생각을 적어 보세요.</EmptyState> : null}
        <ul className="grid gap-4 sm:grid-cols-2">
          {notes.map((item) => {
            const isIdea = (item.category ?? IDEA_TYPES[0]) === IDEA_TYPES[0];
            return (
              <li key={item.id} className={cn("flex flex-col rounded-2xl border", isIdea ? "bg-brand/35" : "bg-card")}>
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-background/80 px-2.5 py-0.5 text-xs text-muted-foreground">
                      {item.category ?? IDEA_TYPES[0]}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })}
                    </span>
                  </div>
                  <p className="mt-3 font-semibold">{item.title}</p>
                  {item.memo ? (
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/80">{item.memo}</p>
                  ) : null}
                </div>
                <div className="flex items-center justify-between border-t px-5 py-2">
                  <details className="flex-1">
                    <summary className="cursor-pointer py-1 text-sm text-muted-foreground">수정하기</summary>
                    <div className="pt-3 pb-2">
                      <StudioForm kind="idea" fields={studioMenus.idea.fields} item={item} submitLabel="수정 저장" />
                    </div>
                  </details>
                  <StudioDeleteButton id={item.id} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
