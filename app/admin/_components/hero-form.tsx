"use client";

import { useActionState } from "react";

import { saveHeroTexts, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/50";

type Field = { key: string; label: string; fallback: string; multiline: boolean };

/** 히어로(첫 화면) 글자 수정 칸. 칸을 비우고 저장하면 site.config.ts 의 원래 글자로 돌아감. */
export function HeroForm({ fields, values }: { fields: readonly Field[]; values: Record<string, string> }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveHeroTexts, {});

  return (
    <form action={action} className="grid gap-4">
      {fields.map((field) => (
        <label key={field.key} className="grid gap-1.5 text-sm">
          <span className="font-medium">{field.label}</span>
          {field.multiline ? (
            <textarea
              name={field.key}
              rows={3}
              defaultValue={values[field.key] ?? ""}
              placeholder={field.fallback}
              className={`${inputClass} py-2`}
            />
          ) : (
            <input
              name={field.key}
              defaultValue={values[field.key] ?? ""}
              placeholder={field.fallback}
              className={`${inputClass} h-10`}
            />
          )}
        </label>
      ))}

      <p className="text-xs text-muted-foreground">칸을 비우고 저장하면 처음 글자로 돌아갑니다.</p>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "저장 중..." : "저장"}
        </Button>
        {state.message ? (
          <p className={state.ok ? "text-sm text-muted-foreground" : "text-sm text-destructive"}>
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
