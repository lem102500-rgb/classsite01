import { sampleItems, siteConfig } from "@/site.config";
import { getPublicClient } from "@/lib/supabase";
import type { Item } from "@/lib/types";

/**
 * 특정 섹션의 카드 목록을 가져옵니다.
 * - Supabase가 연결 안 됐으면: site.config.ts 의 예시 카드를 보여줌
 * - 연결됐으면: 데이터베이스에서 '보이기'로 설정된 카드만 순서대로 가져옴
 */
export async function getItems(section: string): Promise<Item[]> {
  const supabase = getPublicClient();
  const samples = sampleItems.filter((item) => item.section === section);
  if (!supabase) return samples;

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("section", section)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[getItems] Supabase 읽기 실패:", error.message);
    return samples;
  }
  return (data ?? []) as Item[];
}

/** 관리자 페이지에서 고칠 수 있는 히어로 글자 목록 (key 는 site_texts 표의 key) */
export const heroTextFields = [
  { key: "hero.eyebrow", label: "작은 글씨 (제목 위, 쉼표로 나누면 여러 개)", fallback: siteConfig.hero.eyebrow, multiline: false },
  { key: "hero.title", label: "제목 (엔터로 줄바꿈)", fallback: siteConfig.hero.title, multiline: true },
  { key: "hero.description", label: "설명", fallback: siteConfig.hero.description, multiline: true },
  { key: "hero.primaryCta", label: "첫 번째 버튼 글자", fallback: siteConfig.hero.primaryCta.label, multiline: false },
  { key: "hero.secondaryCta", label: "두 번째 버튼 글자", fallback: siteConfig.hero.secondaryCta.label, multiline: false },
] as const;

export type HeroTexts = Record<(typeof heroTextFields)[number]["key"], string>;

/**
 * 히어로 글자를 가져옵니다.
 * - 데이터베이스에 저장된 글자가 있으면 그것을, 없으면 site.config.ts 의 글자를 씀
 */
export async function getHeroTexts(): Promise<HeroTexts> {
  const texts = Object.fromEntries(heroTextFields.map((f) => [f.key, f.fallback])) as HeroTexts;
  const supabase = getPublicClient();
  if (!supabase) return texts;

  const { data, error } = await supabase
    .from("site_texts")
    .select("key, value")
    .in("key", Object.keys(texts));

  if (error) {
    console.error("[getHeroTexts] Supabase 읽기 실패:", error.message);
    return texts;
  }
  for (const row of data ?? []) {
    if (row.key in texts && row.value) texts[row.key as keyof HeroTexts] = row.value;
  }
  return texts;
}
