"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, ExternalLink, FileText, Globe, Maximize2, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* 작업물 카드 — 카드 위쪽에 첨부를 '미리보기'로 바로 보여주고, 카드를 누르면 크게 봄
   카드 위쪽 미리보기 순서: 대표 사진 → 자료 파일(PDF 화면 / 그 밖은 파일 아이콘) → 링크(사이트 화면) → 기본 그림
   크게 보기 창: 첨부가 여러 개면 위쪽 탭(자료 / 링크 / 사진)으로 바꿔 봄 */

export type WorkCardProps = {
  title: string;
  description: string | null;
  imageUrl: string | null;
  fileUrl: string | null;
  fileName: string | null;
  linkUrl: string | null;
  /** 링크 사이트를 미리보기 창에 띄울 수 있는지 (서버에서 미리 확인한 값) */
  linkEmbeddable: boolean;
};

type TabKey = "file" | "link" | "image";

const OFFICE = ["ppt", "pptx", "doc", "docx", "xls", "xlsx"];
const IMAGE = ["png", "jpg", "jpeg", "gif", "webp", "svg"];

function extension(name: string) {
  return name.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
}
function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** 사진을 깨지지 않게 보여줌
    - 원본 파일을 그대로 사용 (다시 압축하지 않음)
    - 사진이 칸보다 작으면 억지로 늘리지 않고, 흐린 배경 위에 원래 크기 비율대로 통째로 보여줌 */
function SharpImage({ src, alt }: { src: string; alt: string }) {
  const [small, setSmall] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // 칸을 채우려면 몇 배로 늘려야 하는지 (화면 배율 포함) — 1.3배 넘게 늘려야 하면 '작은 사진'
  const check = useCallback(() => {
    const img = imgRef.current;
    const box = img?.parentElement?.getBoundingClientRect();
    if (!img || !box || !img.naturalWidth || !box.width) return;
    const need = Math.max(box.width / img.naturalWidth, box.height / img.naturalHeight) * window.devicePixelRatio;
    setSmall(need > 1.3);
  }, []);

  // 사진이 이미 불러와져 있는 경우(새로고침 등)에도 한 번 확인
  useEffect(() => {
    const timer = setTimeout(() => {
      if (imgRef.current?.complete) check();
    }, 0);
    return () => clearTimeout(timer);
  }, [check, src]);

  return (
    <div className="relative size-full overflow-hidden">
      {small ? (
        // 흐린 배경 (같은 사진을 크게 번지게)
        // eslint-disable-next-line @next/next/no-img-element -- 장식용 배경
        <img src={src} alt="" aria-hidden className="absolute inset-0 size-full scale-110 object-cover opacity-60 blur-2xl" />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element -- 원본 화질 그대로 보여주기 위해 일반 img 사용 */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={check}
        className={cn("absolute inset-0 size-full", small ? "object-contain" : "object-cover")}
      />
    </div>
  );
}

/** 사이트 화면 사진 (스크린샷) — 다른 곳에 띄우는 것을 막아 둔 사이트도 미리보기가 나옴
    WordPress 의 무료 스크린샷 서비스(mShots) 사용. 처음 한 번은 만드는 데 시간이 걸려서 몇 번 다시 불러옴 */
function SiteShot({ url, alt }: { url: string; alt: string }) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const src = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1280&h=960${attempt ? `&r=${attempt}` : ""}`;

  if (failed) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-2 text-foreground/60">
        <Globe className="size-10" strokeWidth={1.5} />
        <span className="text-sm">{hostname(url)}</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 바깥 스크린샷 서비스 이미지
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="absolute inset-0 size-full bg-white object-cover object-top"
      onError={() => setFailed(true)}
      onLoad={(e) => {
        // 아직 만드는 중이면 작은 '준비 중' 그림이 옴 → 4초 뒤 다시 (최대 5번)
        if (e.currentTarget.naturalWidth < 1000 && attempt < 5) setTimeout(() => setAttempt((a) => a + 1), 4000);
      }}
    />
  );
}

/** 카드 위쪽의 작은 미리보기 (누를 수 없음 — 카드 전체가 버튼) */
function Thumbnail({ title, imageUrl, fileUrl, fileName, linkUrl }: WorkCardProps) {
  const frame = "pointer-events-none size-full border-0 bg-white";

  if (imageUrl) return <SharpImage src={imageUrl} alt={title} />;
  if (fileUrl) {
    const ext = extension(fileName ?? fileUrl);
    if (ext === "pdf") {
      return <iframe src={`${fileUrl}#toolbar=0&navpanes=0&view=FitH`} title={title} loading="lazy" tabIndex={-1} className={frame} />;
    }
    if (IMAGE.includes(ext)) return <SharpImage src={fileUrl} alt={title} />;
    return (
      <div className="flex size-full flex-col items-center justify-center gap-2 px-6 text-center text-foreground/60">
        <FileText className="size-10" strokeWidth={1.5} />
        <span className="max-w-full truncate text-sm">{fileName ?? "자료 파일"}</span>
      </div>
    );
  }
  if (linkUrl) return <SiteShot url={linkUrl} alt={`${title} 사이트 화면`} />;
  return (
    <div className="flex size-full items-center justify-center text-foreground/45">
      <Sparkles className="size-9" strokeWidth={1.5} />
    </div>
  );
}

export function WorkCard(props: WorkCardProps) {
  const { title, description, imageUrl, fileUrl, fileName, linkUrl, linkEmbeddable } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);

  const tabs: { key: TabKey; label: string }[] = [
    ...(fileUrl ? [{ key: "file" as const, label: "자료" }] : []),
    ...(linkUrl ? [{ key: "link" as const, label: "링크" }] : []),
    ...(imageUrl ? [{ key: "image" as const, label: "사진" }] : []),
  ];
  const [tab, setTab] = useState<TabKey | null>(tabs[0]?.key ?? null);
  const current = tab ?? tabs[0]?.key ?? null;
  const openUrl = current === "file" ? fileUrl : current === "link" ? linkUrl : imageUrl;
  const badge = fileUrl ? extension(fileName ?? fileUrl).toUpperCase() : linkUrl ? "웹사이트" : null;

  // 크게 보기 창 안의 내용
  let body: React.ReactNode = null;
  if (current === "image" && imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element -- 원본 비율 그대로 크게 보여주기 위해 일반 img 사용
    body = <img src={imageUrl} alt={title} className="mx-auto max-h-full max-w-full object-contain" />;
  } else if (current === "link" && linkUrl) {
    body = linkEmbeddable ? (
      <iframe src={linkUrl} title={title} className="size-full rounded-lg border-0 bg-white" />
    ) : (
      // 막아 둔 사이트: 사이트 화면 사진 + 아래에 '새 탭에서 열기'
      <div className="relative size-full overflow-hidden rounded-lg">
        <SiteShot url={linkUrl} alt={`${title} 사이트 화면`} />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-3 bg-card/95 px-4 py-3 text-center text-sm text-muted-foreground">
          <span>{hostname(linkUrl)} 은(는) 미리보기 창 안에서 직접 열 수 없어 화면 사진으로 보여드려요.</span>
          <Button asChild size="sm">
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink /> 새 탭에서 열기
            </a>
          </Button>
        </div>
      </div>
    );
  } else if (current === "file" && fileUrl) {
    const ext = extension(fileName ?? fileUrl);
    if (ext === "pdf") {
      body = <iframe src={fileUrl} title={title} className="size-full rounded-lg border-0 bg-white" />;
    } else if (OFFICE.includes(ext)) {
      const src = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
      body = <iframe src={src} title={title} className="size-full rounded-lg border-0 bg-white" />;
    } else if (IMAGE.includes(ext)) {
      // eslint-disable-next-line @next/next/no-img-element -- 업로드한 그림 파일을 그대로 보여줌
      body = <img src={fileUrl} alt={title} className="mx-auto max-h-full max-w-full object-contain" />;
    } else {
      body = (
        <div className="flex size-full flex-col items-center justify-center gap-4 text-center text-sm text-muted-foreground">
          <p>이 파일은 미리보기를 지원하지 않아요.</p>
          <Button asChild>
            <a href={fileUrl} download={fileName ?? undefined}>
              <Download /> {fileName ?? "파일"} 내려받기
            </a>
          </Button>
        </div>
      );
    }
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-xl hover:shadow-primary/5">
      {/* 카드 전체를 누르면 크게 보기 (첨부가 있을 때만) */}
      {current ? (
        <button
          type="button"
          aria-label={`${title} 크게 보기`}
          className="absolute inset-0 z-10 cursor-zoom-in rounded-2xl focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          onClick={() => dialogRef.current?.showModal()}
        />
      ) : null}

      <div className="relative aspect-[4/3] bg-brand/35">
        <Thumbnail {...props} />
        {badge ? (
          <span className="absolute top-3 left-3 rounded-full bg-card/95 px-2.5 py-0.5 text-xs font-medium text-card-foreground shadow-sm">
            {badge}
          </span>
        ) : null}
        {current ? (
          <span className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-full bg-card/95 text-card-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            <Maximize2 className="size-4" />
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
      </div>

      {current ? (
        <dialog
          ref={dialogRef}
          aria-label={`${title} 크게 보기`}
          className="m-auto h-[85vh] w-[min(64rem,94vw)] max-w-none rounded-2xl bg-card p-0 text-card-foreground shadow-2xl backdrop:bg-foreground/50 backdrop:backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) dialogRef.current?.close(); // 바깥(어두운 곳)을 누르면 닫힘
          }}
        >
          <div className="flex h-full flex-col">
            <header className="flex flex-wrap items-center gap-3 border-b px-5 py-3">
              <h3 className="min-w-0 flex-1 truncate font-semibold">{title}</h3>
              {tabs.length > 1 ? (
                <div className="flex gap-1 rounded-full bg-muted p-1">
                  {tabs.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setTab(t.key)}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs",
                        current === t.key ? "bg-background font-medium shadow-sm" : "text-muted-foreground",
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              ) : null}
              {openUrl ? (
                <Button asChild size="sm" variant="ghost">
                  <a href={openUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink /> 새 탭에서 열기
                  </a>
                </Button>
              ) : null}
              <Button type="button" size="icon" variant="ghost" aria-label="닫기" onClick={() => dialogRef.current?.close()}>
                <X />
              </Button>
            </header>
            <div className="min-h-0 flex-1 bg-muted/40 p-3 sm:p-5">{body}</div>
          </div>
        </dialog>
      ) : null}
    </article>
  );
}
