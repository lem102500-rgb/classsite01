import Link from "next/link";
import Image from "next/image";
import { EyeOff } from "lucide-react";

import { siteConfig } from "@/site.config";
import { isAdmin } from "@/lib/admin-auth";
import { getAdminClient } from "@/lib/supabase-admin";
import type { Item } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ItemForm } from "../_components/item-form";
import { DeleteButton } from "../_components/delete-button";
import { HeroForm } from "../_components/hero-form";
import { heroTextFields } from "@/lib/data";

/* 사이트 관리 (주소: /admin/site) — 공개 사이트에 보이는 내용 관리
   - 히어로 글자 탭: 첫 화면 글자
   - 섹션 탭(site.config.ts 의 adminSections): 작업물 카드 추가·수정·삭제
   로그인 확인과 안내 화면은 app/admin/layout.tsx 에서 먼저 처리됨 */

export const metadata = { title: "사이트 관리 · My Studio" };

export default async function SiteAdminPage(props: PageProps<"/admin/site">) {
  const searchParams = await props.searchParams;

  if (!(await isAdmin())) return null;
  const supabase = getAdminClient();
  if (!supabase) return null;

  const sections = siteConfig.adminSections;
  const requested = typeof searchParams.section === "string" ? searchParams.section : undefined;
  const current = sections.find((s) => s.key === requested) ?? sections[0];
  const isHeroTab = requested === "hero";

  // 히어로 글자 탭: 저장된 글자만 불러옴 (없는 칸은 비어 있고, 사이트에는 원래 글자가 보임)
  const heroResult = isHeroTab
    ? await supabase.from("site_texts").select("key, value").in("key", heroTextFields.map((f) => f.key))
    : null;
  const heroValues = Object.fromEntries((heroResult?.data ?? []).map((row) => [row.key, row.value]));

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("section", current.key)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  const items = (data ?? []) as Item[];

  return (
    <>
      <header>
        <h1 className="text-3xl font-bold tracking-tight">사이트 관리</h1>
        <p className="mt-2 text-sm text-muted-foreground">공개 사이트의 첫 화면 글자와 작업물 카드를 관리해요.</p>
      </header>

      {/* 섹션 탭 (site.config.ts 의 adminSections) */}
      <nav className="mt-8 flex flex-wrap gap-2">
        <Button asChild size="sm" variant={isHeroTab ? "default" : "outline"}>
          <Link href="/admin/site?section=hero">히어로 글자</Link>
        </Button>
        {sections.map((s) => (
          <Button
            key={s.key}
            asChild
            size="sm"
            variant={!isHeroTab && s.key === current.key ? "default" : "outline"}
          >
            <Link href={`/admin/site?section=${s.key}`}>{s.label}</Link>
          </Button>
        ))}
      </nav>

      {isHeroTab ? (
        <>
          {heroResult?.error ? (
            <p className="mt-6 rounded-lg border border-destructive/40 p-4 text-sm text-destructive">
              데이터를 불러오지 못했습니다: {heroResult.error.message}
              <br />
              supabase/schema.sql 을 Supabase SQL Editor 에서 다시 실행했는지 확인하세요.
            </p>
          ) : null}
          <section className="mt-8 max-w-2xl rounded-xl border p-6">
            <h2 className="mb-5 text-lg font-semibold">히어로(첫 화면) 글자 수정</h2>
            <HeroForm fields={heroTextFields} values={heroValues} />
          </section>
        </>
      ) : (
        <>
          {error ? (
            <p className="mt-6 rounded-lg border border-destructive/40 p-4 text-sm text-destructive">
              데이터를 불러오지 못했습니다: {error.message}
              <br />
              supabase/schema.sql 을 Supabase SQL Editor 에서 실행했는지 확인하세요.
            </p>
          ) : null}

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            {/* 새 항목 추가 */}
            <section className="h-fit rounded-xl border p-6">
              <h2 className="mb-5 text-lg font-semibold">{current.label} 추가</h2>
              <ItemForm section={current.key} />
            </section>

            {/* 등록된 항목 목록 */}
            <section>
              <h2 className="mb-5 text-lg font-semibold">
                등록된 {current.label} <span className="text-muted-foreground">({items.length})</span>
              </h2>
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground">아직 없습니다. 왼쪽에서 추가해 보세요.</p>
              ) : (
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.id} className="rounded-xl border">
                      <div className="flex items-center gap-4 p-4">
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {item.image_url ? (
                            <Image src={item.image_url} alt="" fill sizes="56px" className="object-cover" />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-2 font-medium">
                            <span className="truncate">{item.title}</span>
                            {!item.is_visible ? (
                              <EyeOff className="size-4 shrink-0 text-muted-foreground" aria-label="숨김" />
                            ) : null}
                          </p>
                          <p className="text-xs text-muted-foreground">순서 {item.sort_order}</p>
                        </div>
                        <DeleteButton id={item.id} imageUrl={item.image_url} />
                      </div>
                      <details className="border-t px-4 py-3">
                        <summary className="cursor-pointer text-sm text-muted-foreground">수정하기</summary>
                        <div className="pt-4">
                          <ItemForm section={current.key} item={item} />
                        </div>
                      </details>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </>
  );
}
