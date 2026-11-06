import { siteConfig } from "@/site.config";
import { getItems } from "@/lib/data";
import { canEmbed } from "@/lib/embed";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { Carousel } from "@/components/ui/carousel";
import { WorkCard } from "@/components/ui/work-viewer";

/* 작업물(항목) 섹션 — 종이색 배경 + 좌우로 넘기는 카드 슬라이드.
   - 제목/설명: site.config.ts 의 features
   - 카드 목록: My Studio → 사이트 관리에서 관리 (사진, 링크, 자료 파일을 붙일 수 있음)
   - 카드 위쪽에 첨부가 미리보기로 보이고, 카드를 누르면 크게 봄 */
export async function Features() {
  const { features } = siteConfig;
  const items = await getItems("features");

  // 링크가 있는 카드: 그 사이트를 미리보기로 띄울 수 있는지 미리 확인 (동시에 확인)
  const embeddable = await Promise.all(items.map((item) => (item.link_url ? canEmbed(item.link_url) : false)));

  return (
    <section id="features" className="scroll-mt-16 overflow-hidden bg-background py-20 sm:py-28">
      <Container>
        <SectionHeader eyebrow={features.eyebrow} title={features.title} description={features.description} />

        {items.length === 0 ? (
          <p className="mt-12 text-muted-foreground">아직 등록된 작업물이 없습니다.</p>
        ) : (
          // 카드를 좌우로 넘기는 슬라이드 (카드를 추가하면 오른쪽 끝에 붙음)
          <Carousel label={features.title} className="mt-12">
            {items.map((item, i) => (
              <WorkCard
                key={item.id}
                title={item.title}
                description={item.description}
                imageUrl={item.image_url}
                fileUrl={item.file_url ?? null}
                fileName={item.file_name ?? null}
                linkUrl={item.link_url}
                linkEmbeddable={embeddable[i]}
              />
            ))}
          </Carousel>
        )}
      </Container>
    </section>
  );
}
