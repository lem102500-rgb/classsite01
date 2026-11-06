import "server-only";

/**
 * 이 주소의 사이트를 다른 페이지 안(미리보기 창)에 띄울 수 있는지 확인합니다.
 * - 많은 큰 사이트(구글, 네이버 등)는 보안 때문에 다른 곳에 띄우는 것을 막아 둡니다.
 * - 막혀 있으면 미리보기 대신 사이트 주소 카드를 보여주기 위해 사용
 * - 결과는 1시간 동안 기억해서 매번 확인하지 않음
 */
export async function canEmbed(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(3000),
      next: { revalidate: 3600 },
    });
    const xfo = res.headers.get("x-frame-options")?.toLowerCase() ?? "";
    if (xfo.includes("deny") || xfo.includes("sameorigin")) return false;

    const csp = res.headers.get("content-security-policy")?.toLowerCase() ?? "";
    const ancestors = csp.split(";").find((part) => part.trim().startsWith("frame-ancestors"));
    if (ancestors && !ancestors.includes("*")) return false;

    return res.ok;
  } catch {
    return false; // 응답이 없거나 너무 느리면 미리보기 안 함
  }
}
