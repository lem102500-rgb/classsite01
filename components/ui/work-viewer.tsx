"use client";

import { useRef, useState } from "react";
import { Download, ExternalLink, Eye, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* 작업물 '바로보기' — 버튼을 누르면 페이지 위에 창이 떠서 첨부를 바로 보여줌
   - 사진: 크게 보기
   - 자료 파일: PDF 는 바로, PPT·워드·엑셀은 마이크로소프트 온라인 뷰어로, 그 밖의 파일은 내려받기
   - 링크(URL): 창 안에서 사이트 열기 (사이트가 막아 두었으면 '새 탭에서 열기' 사용)
   첨부가 여러 개면 창 위쪽 탭으로 바꿔 봄 */

type Tab = { key: "file" | "link" | "image"; label: string };

const OFFICE = ["ppt", "pptx", "doc", "docx", "xls", "xlsx"];
const IMAGE = ["png", "jpg", "jpeg", "gif", "webp", "svg"];

function extension(name: string) {
  return name.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
}

export function WorkViewer({
  title,
  imageUrl,
  fileUrl,
  fileName,
  linkUrl,
  className,
}: {
  title: string;
  imageUrl: string | null;
  fileUrl: string | null;
  fileName: string | null;
  linkUrl: string | null;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const tabs: Tab[] = [
    ...(fileUrl ? [{ key: "file" as const, label: "자료" }] : []),
    ...(linkUrl ? [{ key: "link" as const, label: "링크" }] : []),
    ...(imageUrl ? [{ key: "image" as const, label: "사진" }] : []),
  ];
  const [tab, setTab] = useState<Tab["key"] | null>(tabs[0]?.key ?? null);
  if (tabs.length === 0) return null;

  const current = tab ?? tabs[0].key;
  const openUrl = current === "file" ? fileUrl : current === "link" ? linkUrl : imageUrl;

  let body: React.ReactNode = null;
  if (current === "image" && imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element -- 원본 크기 그대로 보여주기 위해 일반 img 사용
    body = <img src={imageUrl} alt={title} className="mx-auto max-h-full max-w-full object-contain" />;
  } else if (current === "link" && linkUrl) {
    body = <iframe src={linkUrl} title={title} className="size-full rounded-lg bg-white" />;
  } else if (current === "file" && fileUrl) {
    const ext = extension(fileName ?? fileUrl);
    if (ext === "pdf") {
      body = <iframe src={fileUrl} title={title} className="size-full rounded-lg bg-white" />;
    } else if (OFFICE.includes(ext)) {
      const src = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
      body = <iframe src={src} title={title} className="size-full rounded-lg bg-white" />;
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
    <>
      <Button type="button" size="sm" variant="brand" className={className} onClick={() => dialogRef.current?.showModal()}>
        <Eye />
        바로보기
      </Button>

      <dialog
        ref={dialogRef}
        aria-label={`${title} 바로보기`}
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
          {current === "link" ? (
            <p className="border-t px-5 py-2 text-xs text-muted-foreground">
              화면이 비어 보이면 그 사이트가 다른 곳에 띄우는 것을 막아 둔 경우예요. 「새 탭에서 열기」를 눌러 주세요.
            </p>
          ) : null}
        </div>
      </dialog>
    </>
  );
}
