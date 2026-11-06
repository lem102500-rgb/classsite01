"use server";

/* 관리자 페이지의 버튼들이 실제로 하는 일 (서버에서 실행됨)
   - login / logout      : 로그인, 로그아웃
   - saveItem            : 카드 추가 또는 수정 (이미지 업로드 포함)
   - deleteItem          : 카드 삭제
   - saveHeroTexts       : 히어로(첫 화면) 글자 저장 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { siteConfig } from "@/site.config";
import { checkPassword, endAdminSession, isAdmin, startAdminSession } from "@/lib/admin-auth";
import { getAdminClient, IMAGE_BUCKET } from "@/lib/supabase-admin";
import { heroTextFields } from "@/lib/data";

export type ActionState = { ok?: boolean; message?: string };

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
// 자료 파일: Vercel 에 올린 사이트는 한 번에 약 4.5MB 까지만 받을 수 있어서 4MB 로 제한
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const ALLOWED_FILE_EXTS = ["pdf", "ppt", "pptx", "doc", "docx", "xls", "xlsx", "hwp", "txt", "zip", "png", "jpg", "jpeg"];

/* ---------- 로그인 / 로그아웃 ---------- */

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    return { message: "비밀번호가 올바르지 않습니다." };
  }
  await startAdminSession();
  redirect("/admin");
}

export async function logout() {
  await endAdminSession();
  redirect("/admin");
}

/* ---------- 카드 저장 (추가 / 수정) ---------- */

export async function saveItem(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await isAdmin())) return { message: "로그인이 필요합니다. 새로고침 후 다시 로그인하세요." };

  const supabase = getAdminClient();
  if (!supabase) return { message: "Supabase가 연결되지 않았습니다. .env.local 을 확인하세요." };

  const id = String(formData.get("id") ?? "");
  const section = String(formData.get("section") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const linkUrl = String(formData.get("link_url") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;
  const isVisible = formData.get("is_visible") === "on";
  const removeImage = formData.get("remove_image") === "on";
  const image = formData.get("image");

  if (!siteConfig.adminSections.some((s) => s.key === section)) {
    return { message: "알 수 없는 섹션입니다." };
  }
  if (!title) return { message: "제목을 입력하세요." };

  const row: Record<string, unknown> = {
    section,
    title,
    description: description || null,
    link_url: linkUrl || null,
    sort_order: sortOrder,
    is_visible: isVisible,
  };

  // 새 이미지를 올린 경우 → Supabase 저장소에 업로드
  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/")) return { message: "이미지 파일만 올릴 수 있습니다." };
    if (image.size > MAX_IMAGE_BYTES) return { message: "이미지는 5MB 이하만 올릴 수 있습니다." };

    const ext = (image.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${section}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, image, { contentType: image.type, upsert: false });
    if (uploadError) return { message: `이미지 업로드 실패: ${uploadError.message}` };

    row.image_url = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
  } else if (removeImage) {
    row.image_url = null;
  }

  // 자료 파일(PDF, PPT 등)을 올린 경우 → 같은 저장소의 files 폴더에 업로드
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    const ext = (file.name.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!ALLOWED_FILE_EXTS.includes(ext)) {
      return { message: `올릴 수 있는 자료: ${ALLOWED_FILE_EXTS.join(", ")}` };
    }
    if (file.size > MAX_FILE_BYTES) {
      return { message: "자료 파일은 4MB 이하만 올릴 수 있어요. 큰 파일은 구글 드라이브 등에 올리고 '링크'에 주소를 넣어 주세요." };
    }

    const path = `${section}/files/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false });
    if (uploadError) return { message: `자료 업로드 실패: ${uploadError.message}` };

    row.file_url = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
    row.file_name = file.name;
  } else if (formData.get("remove_file") === "on") {
    row.file_url = null;
    row.file_name = null;
  }

  const { error } = id
    ? await supabase.from("items").update(row).eq("id", id)
    : await supabase.from("items").insert(row);

  if (error) return { message: `저장 실패: ${error.message}` };

  revalidatePath("/");
  revalidatePath("/admin", "layout");
  return { ok: true, message: id ? "수정했습니다." : "추가했습니다." };
}

/* ---------- 히어로 글자 저장 ---------- */

export async function saveHeroTexts(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await isAdmin())) return { message: "로그인이 필요합니다. 새로고침 후 다시 로그인하세요." };

  const supabase = getAdminClient();
  if (!supabase) return { message: "Supabase가 연결되지 않았습니다. .env.local 을 확인하세요." };

  // 빈 칸은 저장하지 않고 지움 → site.config.ts 의 원래 글자로 돌아감
  const toSave: { key: string; value: string; updated_at: string }[] = [];
  const toClear: string[] = [];
  for (const field of heroTextFields) {
    const value = String(formData.get(field.key) ?? "").replace(/\r\n/g, "\n").trim();
    if (value) toSave.push({ key: field.key, value, updated_at: new Date().toISOString() });
    else toClear.push(field.key);
  }

  if (toSave.length > 0) {
    const { error } = await supabase.from("site_texts").upsert(toSave);
    if (error) return { message: `저장 실패: ${error.message}` };
  }
  if (toClear.length > 0) {
    const { error } = await supabase.from("site_texts").delete().in("key", toClear);
    if (error) return { message: `저장 실패: ${error.message}` };
  }

  revalidatePath("/");
  revalidatePath("/admin", "layout");
  return { ok: true, message: "저장했습니다." };
}

/* ---------- 카드 삭제 ---------- */

export async function deleteItem(formData: FormData) {
  if (!(await isAdmin())) return;
  const supabase = getAdminClient();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  const imageUrl = String(formData.get("image_url") ?? "");
  if (!id) return;

  // 첨부 자료 파일 주소는 데이터베이스에서 직접 확인 (지우기 전에)
  const { data: existing } = await supabase.from("items").select("file_url").eq("id", id).maybeSingle();
  const fileUrl = String(existing?.file_url ?? "");

  await supabase.from("items").delete().eq("id", id);

  // 연결된 이미지·자료 파일도 저장소에서 정리
  const marker = `/object/public/${IMAGE_BUCKET}/`;
  const paths = [imageUrl, fileUrl].filter((url) => url.includes(marker)).map((url) => url.split(marker)[1]);
  if (paths.length > 0) {
    await supabase.storage.from(IMAGE_BUCKET).remove(paths);
  }

  revalidatePath("/");
  revalidatePath("/admin", "layout");
}
