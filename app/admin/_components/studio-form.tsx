"use client";

import { useActionState, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";

import type { ActionState } from "@/app/admin/actions";
import { deleteStudioItem, saveStudioItem } from "@/app/admin/studio-actions";
import { Button } from "@/components/ui/button";
import type { StudioField, StudioItem, StudioKind } from "@/lib/studio-config";

const inputClass =
  "w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/50";

/** My Studio 입력 칸 묶음. item 을 넘기면 '수정', 안 넘기면 '새로 추가'. 칸 목록은 lib/studio-config.ts 에서 옴 */
export function StudioForm({
  kind,
  fields,
  item,
  submitLabel,
}: {
  kind: StudioKind;
  fields: StudioField[];
  item?: StudioItem;
  submitLabel: string;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveStudioItem, {});
  const formRef = useRef<HTMLFormElement>(null);

  // 새로 추가에 성공하면 입력 칸 비우기
  useEffect(() => {
    if (state.ok && !item) formRef.current?.reset();
  }, [state, item]);

  return (
    <form ref={formRef} action={action} className="grid gap-4">
      <input type="hidden" name="kind" value={kind} />
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const value = item?.[field.name] ?? "";
          const wide = field.type === "textarea" || field.name === "title";
          return (
            <label key={field.name} className={`grid gap-1.5 text-sm ${wide ? "sm:col-span-2" : ""}`}>
              <span className="font-medium">
                {field.label}
                {field.required ? " *" : ""}
              </span>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  rows={field.name === "memo" && kind === "idea" ? 5 : 3}
                  defaultValue={value}
                  placeholder={field.placeholder}
                  className={`${inputClass} py-2`}
                />
              ) : field.type === "select" ? (
                <select name={field.name} defaultValue={value || field.options?.[0]} className={`${inputClass} h-10`}>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  defaultValue={value}
                  placeholder={field.placeholder}
                  className={`${inputClass} h-10`}
                />
              )}
            </label>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "저장 중..." : submitLabel}
        </Button>
        {state.message ? (
          <p className={state.ok ? "text-sm text-muted-foreground" : "text-sm text-destructive"}>{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}

/** 삭제 버튼 — 실수 방지를 위해 한 번 더 물어봄 */
export function StudioDeleteButton({ id }: { id: string }) {
  return (
    <form
      action={deleteStudioItem}
      onSubmit={(e) => {
        if (!window.confirm("정말 삭제할까요? 되돌릴 수 없습니다.")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="ghost" size="sm" className="text-destructive" aria-label="삭제">
        <Trash2 />
        삭제
      </Button>
    </form>
  );
}
