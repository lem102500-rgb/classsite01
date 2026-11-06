import { CalendarClock } from "lucide-react";

import { isAdmin } from "@/lib/admin-auth";
import { formatDate, getStudioItems, todayInKorea } from "@/lib/studio";
import { studioMenus, TODO_STATUSES } from "@/lib/studio-config";
import { cn } from "@/lib/utils";
import { setTodoStatus } from "../studio-actions";
import { StudioPageHeader } from "../_components/studio-page";
import { StudioDeleteButton, StudioForm } from "../_components/studio-form";

export const metadata = { title: "할 일 관리 · My Studio" };

/** 할 일 관리 — 준비 중 / 진행 중 / 완료 3칸 보드. 카드 아래 버튼으로 바로 옆 칸으로 옮김 */
export default async function TodosPage() {
  if (!(await isAdmin())) return null;
  const { items, error } = await getStudioItems("todo");
  const today = todayInKorea();

  return (
    <>
      <StudioPageHeader kind="todo" error={error} />

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {TODO_STATUSES.map((status, col) => {
          const list = items.filter((item) => (item.status ?? TODO_STATUSES[0]) === status);
          return (
            <section key={status} className="rounded-2xl bg-muted/60 p-4">
              <h2 className="mb-4 flex items-center justify-between px-1 font-semibold">
                {status}
                <span className="rounded-full bg-background px-2.5 py-0.5 text-xs text-muted-foreground">
                  {list.length}
                </span>
              </h2>
              <ul className="space-y-3">
                {list.length === 0 ? (
                  <li className="rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">비어 있음</li>
                ) : null}
                {list.map((item) => {
                  const overdue = status !== "완료" && item.date !== null && item.date < today;
                  return (
                    <li key={item.id} className="rounded-xl border bg-card">
                      <div className="p-4">
                        <p className={cn("font-medium", status === "완료" && "text-muted-foreground line-through")}>
                          {item.title}
                        </p>
                        {item.date ? (
                          <p
                            className={cn(
                              "mt-1.5 flex items-center gap-1.5 text-xs",
                              overdue ? "font-medium text-destructive" : "text-muted-foreground",
                            )}
                          >
                            <CalendarClock className="size-3.5" />
                            {formatDate(item.date)} 까지{overdue ? " (지남)" : ""}
                          </p>
                        ) : null}
                        {item.memo ? (
                          <p className="mt-2 whitespace-pre-line text-sm text-foreground/75">{item.memo}</p>
                        ) : null}

                        {/* 옆 칸으로 옮기기 */}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {col > 0 ? (
                            <form action={setTodoStatus}>
                              <input type="hidden" name="id" value={item.id} />
                              <input type="hidden" name="status" value={TODO_STATUSES[col - 1]} />
                              <button type="submit" className="rounded-full border px-3 py-1 text-xs hover:bg-muted">
                                ← {TODO_STATUSES[col - 1]}
                              </button>
                            </form>
                          ) : null}
                          {col < TODO_STATUSES.length - 1 ? (
                            <form action={setTodoStatus}>
                              <input type="hidden" name="id" value={item.id} />
                              <input type="hidden" name="status" value={TODO_STATUSES[col + 1]} />
                              <button
                                type="submit"
                                className="rounded-full bg-brand px-3 py-1 text-xs font-medium text-brand-foreground hover:bg-brand/85"
                              >
                                {TODO_STATUSES[col + 1]} →
                              </button>
                            </form>
                          ) : null}
                          <div className="ml-auto">
                            <StudioDeleteButton id={item.id} />
                          </div>
                        </div>
                      </div>
                      <details className="border-t px-4 py-2.5">
                        <summary className="cursor-pointer text-xs text-muted-foreground">수정하기</summary>
                        <div className="pt-3">
                          <StudioForm kind="todo" fields={studioMenus.todo.fields} item={item} submitLabel="수정 저장" />
                        </div>
                      </details>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
