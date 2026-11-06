import { isAdmin } from "@/lib/admin-auth";
import { getStudioItems } from "@/lib/studio";
import { IDEA_TYPES, studioMenus } from "@/lib/studio-config";
import { cn } from "@/lib/utils";
import { EmptyState, StudioPageHeader } from "../_components/studio-page";
import { StudioDeleteButton, StudioForm } from "../_components/studio-form";

export const metadata = { title: "아이디어 노트 · My Studio" };

/* 아이디어 노트 — 벽에 붙인 포스트잇처럼 보여줌. 최근에 쓴 노트가 앞에
   - 포스트잇 색: 노랑 → 분홍 → 하늘 → 연두 순서로 돌아가며 칠함 (옆 노트와 색이 겹치지 않게)
   - 살짝씩 기울어져 있고, 마우스를 올리면 똑바로 서며 떠오름
   - 색 값은 app/globals.css 의 --note-yellow 등에서 바꿈 */

const NOTE_COLORS = ["bg-note-yellow", "bg-note-pink", "bg-note-blue", "bg-note-green"];
const TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-0", "-rotate-[1.5deg]"];


export default async function IdeasPage() {
  if (!(await isAdmin())) return null;
  const { items, error } = await getStudioItems("idea");
  const notes = [...items].sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <>
      <StudioPageHeader kind="idea" error={error} />

      <div className="mt-10">
        {notes.length === 0 ? <EmptyState>아직 노트가 없어요. 떠오른 생각을 포스트잇에 적어 보세요.</EmptyState> : null}

        {/* 포스트잇 벽 */}
        <ul className="grid grid-cols-1 gap-x-6 gap-y-10 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((item, i) => (
            <li
              key={item.id}
              className={cn(
                "group relative flex min-h-60 flex-col text-note-foreground shadow-[0_10px_20px_-12px_rgb(0_0_0/0.35)] transition duration-200",
                "hover:z-10 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_18px_30px_-14px_rgb(0_0_0/0.4)]",
                NOTE_COLORS[i % NOTE_COLORS.length],
                TILTS[i % TILTS.length],
              )}
            >
              {/* 위쪽 반투명 테이프 */}
              <span
                aria-hidden
                className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-2 bg-background/60 shadow-sm backdrop-blur-[1px]"
              />

              <div className="flex-1 px-5 pt-6 pb-3">
                <div className="flex items-center justify-between gap-2 text-xs opacity-60">
                  <span>{item.category ?? IDEA_TYPES[0]}</span>
                  <span>{new Date(item.created_at).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })}</span>
                </div>
                <p className="mt-2 font-hand text-[1.7rem] leading-tight">{item.title}</p>
                {item.memo ? (
                  <p className="mt-2 font-hand text-xl leading-snug whitespace-pre-line opacity-85">{item.memo}</p>
                ) : null}
              </div>

              {/* 아래쪽: 마우스를 올리면 보이는 수정 / 삭제 */}
              <div className="flex items-center justify-between border-t border-note-foreground/10 px-3 py-1 opacity-60 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                <details className="flex-1">
                  <summary className="cursor-pointer px-2 py-1 text-sm">수정하기</summary>
                  <div className="rounded-lg bg-background/80 p-3 text-foreground">
                    <StudioForm kind="idea" fields={studioMenus.idea.fields} item={item} submitLabel="수정 저장" />
                  </div>
                </details>
                <StudioDeleteButton id={item.id} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
