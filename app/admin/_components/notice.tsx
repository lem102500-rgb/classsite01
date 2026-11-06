/** 관리자 화면의 안내 상자 (비밀번호 설정, Supabase 연결, 표 만들기 안내 등) */
export function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto mt-16 max-w-xl rounded-xl border bg-muted/50 p-8">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}
