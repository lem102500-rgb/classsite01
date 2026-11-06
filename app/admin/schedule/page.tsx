import { Clock, MapPin } from "lucide-react";

import { isAdmin } from "@/lib/admin-auth";
import { formatDate, formatMonth, getStudioItems, todayInKorea } from "@/lib/studio";
import { studioMenus, type StudioItem } from "@/lib/studio-config";
import { cn } from "@/lib/utils";
import { EmptyState, StudioPageHeader } from "../_components/studio-page";
import { StudioDeleteButton, StudioForm } from "../_components/studio-form";

export const metadata = { title: "강의 일정 · My Studio" };

/** 강의 일정 — 월별로 묶어서 날짜 순으로 보여줌. 지난 일정은 흐리게 */
export default async function SchedulePage() {
  if (!(await isAdmin())) return null;
  const { items, error } = await getStudioItems("schedule");
  const today = todayInKorea();

  // "2026년 11월" → [일정들]
  const months = new Map<string, StudioItem[]>();
  for (const item of items) {
    const key = item.date ? formatMonth(item.date) : "날짜 미정";
    months.set(key, [...(months.get(key) ?? []), item]);
  }

  return (
    <>
      <StudioPageHeader kind="schedule" error={error} />

      <div className="mt-10 space-y-10">
        {items.length === 0 ? <EmptyState>아직 등록된 강의 일정이 없어요. 위에서 추가해 보세요.</EmptyState> : null}
        {[...months].map(([month, list]) => (
          <section key={month}>
            <h2 className="mb-4 text-lg font-semibold">{month}</h2>
            <ul className="space-y-3">
              {list.map((item) => {
                const past = item.date !== null && item.date < today;
                const isToday = item.date === today;
                return (
                  <li key={item.id} className={cn("rounded-2xl border bg-card", past && "opacity-55")}>
                    <div className="flex flex-wrap items-start gap-4 p-5">
                      <div
                        className={cn(
                          "w-24 shrink-0 rounded-xl px-3 py-2 text-center text-sm font-semibold",
                          isToday ? "bg-brand text-brand-foreground" : "bg-muted",
                        )}
                      >
                        {isToday ? "오늘" : item.date ? formatDate(item.date) : "미정"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{item.title}</p>
                        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          {item.time ? (
                            <span className="flex items-center gap-1.5">
                              <Clock className="size-3.5" /> {item.time}
                            </span>
                          ) : null}
                          {item.place ? (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="size-3.5" /> {item.place}
                            </span>
                          ) : null}
                        </div>
                        {item.memo ? (
                          <p className="mt-2 whitespace-pre-line text-sm text-foreground/75">{item.memo}</p>
                        ) : null}
                      </div>
                      <StudioDeleteButton id={item.id} />
                    </div>
                    <details className="border-t px-5 py-3">
                      <summary className="cursor-pointer text-sm text-muted-foreground">수정하기</summary>
                      <div className="pt-4">
                        <StudioForm kind="schedule" fields={studioMenus.schedule.fields} item={item} submitLabel="수정 저장" />
                      </div>
                    </details>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
