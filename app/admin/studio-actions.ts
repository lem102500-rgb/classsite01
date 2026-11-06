"use server";

/* My Studio 버튼들이 실제로 하는 일 (서버에서 실행됨)
   - saveStudioItem    : 항목 추가 또는 수정
   - deleteStudioItem  : 항목 삭제
   - setTodoStatus     : 할 일 상태만 바꾸기 (준비 중 → 진행 중 → 완료)
   모든 동작은 로그인한 관리자(isAdmin)만 할 수 있습니다. */

import { revalidatePath } from "next/cache";

import { isAdmin } from "@/lib/admin-auth";
import { getAdminClient } from "@/lib/supabase-admin";
import { STUDIO_KINDS, studioMenus, TODO_STATUSES, type StudioKind } from "@/lib/studio-config";
import type { ActionState } from "./actions";

export async function saveStudioItem(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await isAdmin())) return { message: "로그인이 필요합니다. 새로고침 후 다시 로그인하세요." };

  const supabase = getAdminClient();
  if (!supabase) return { message: "Supabase가 연결되지 않았습니다. .env.local 을 확인하세요." };

  const id = String(formData.get("id") ?? "");
  const kind = String(formData.get("kind") ?? "") as StudioKind;
  if (!STUDIO_KINDS.includes(kind)) return { message: "알 수 없는 메뉴입니다." };

  // 이 메뉴에 있는 칸만 저장 (빈 칸은 비워 둠)
  const row: Record<string, string | null> = { kind };
  for (const field of studioMenus[kind].fields) {
    const value = String(formData.get(field.name) ?? "").trim();
    if (field.required && !value) return { message: `${field.label}을(를) 입력하세요.` };
    if (field.options && value && !field.options.includes(value)) {
      return { message: `${field.label} 값이 올바르지 않습니다.` };
    }
    row[field.name] = value || null;
  }
  if (kind === "todo" && !row.status) row.status = TODO_STATUSES[0];

  const { error } = id
    ? await supabase.from("studio_items").update(row).eq("id", id).eq("kind", kind)
    : await supabase.from("studio_items").insert(row);
  if (error) return { message: `저장 실패: ${error.message}` };

  revalidatePath("/admin", "layout");
  return { ok: true, message: id ? "수정했습니다." : "추가했습니다." };
}

export async function deleteStudioItem(formData: FormData) {
  if (!(await isAdmin())) return;
  const supabase = getAdminClient();
  const id = String(formData.get("id") ?? "");
  if (!supabase || !id) return;

  await supabase.from("studio_items").delete().eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function setTodoStatus(formData: FormData) {
  if (!(await isAdmin())) return;
  const supabase = getAdminClient();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!supabase || !id || !(TODO_STATUSES as readonly string[]).includes(status)) return;

  await supabase.from("studio_items").update({ status }).eq("id", id).eq("kind", "todo");
  revalidatePath("/admin", "layout");
}
