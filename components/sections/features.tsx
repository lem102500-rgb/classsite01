import Image from "next/image";
import { ArrowUpRight, FileText, Sparkles } from "lucide-react";

import { siteConfig } from "@/site.config";
import { getItems } from "@/lib/data";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { Carousel } from "@/components/ui/carousel";
import { WorkViewer } from "@/components/ui/work-viewer";

/* 작업물(항목) 섹션 — 베이지 배경 띠 + 좌우로 넘기는 카드 슬라이드.
   - 제목/설명: site.config.ts 의 features
   - 카드 목록: My Studio → 사이트 관리에서 관리 (사진, 링크, 자료 파일을 붙일 수 있음)
   - 카드의 '바로보기' 버튼으로 첨부를 페이지 위 창에서 바로 봄 */
export async function Features() {
  const { features } = siteConfig;
  const items = await getItems("features");

  return (
    <section id="features" className="scroll-mt-16 overflow-hidden bg-muted py-20 sm:py-28">
      <Container>
        <SectionHeader eyebrow={features.eyebrow} title={features.title} description={features.description} />

        {items.length === 0 ? (
          <p className="mt-12 text-muted-foreground">아직 등록된 작업물이 없습니다.</p>
        ) : (
          // 카드를 좌우로 넘기는 슬라이드 (카드를 추가하면 오른쪽 끝에 붙음)
          <Carousel label={features.title} className="mt-12">
            {items.map((item) => (
              <article
                key={item.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="relative aspect-[4/3] bg-brand/35">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    // 사진이 없을 때: 연두빛 바탕 + 아이콘 (사이트 색과 맞춤)
                    <div className="flex h-full items-center justify-center text-foreground/45">
                      {item.file_url ? <FileText className="size-9" strokeWidth={1.5} /> : <Sparkles className="size-9" strokeWidth={1.5} />}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  {item.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  ) : null}
                  {item.file_name ? (
                    <p className="mt-3 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                      <FileText className="size-3.5 shrink-0" /> {item.file_name}
                    </p>
                  ) : null}

                  {/* 아래쪽 버튼: 바로보기 / 링크 열기 */}
                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                    <WorkViewer
                      title={item.title}
                      imageUrl={item.image_url}
                      fileUrl={item.file_url ?? null}
                      fileName={item.file_name ?? null}
                      linkUrl={item.link_url}
                    />
                    {item.link_url ? (
                      <a
                        href={item.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 items-center gap-1 rounded-full px-3 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        사이트 열기 <ArrowUpRight className="size-3.5" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </Carousel>
        )}
      </Container>
    </section>
  );
}
