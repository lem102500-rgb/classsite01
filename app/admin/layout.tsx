import { isAdmin, isAdminPasswordSet } from "@/lib/admin-auth";
import { getAdminClient } from "@/lib/supabase-admin";
import { Container } from "@/components/layout/container";
import { LoginForm } from "./_components/login-form";
import { Notice } from "./_components/notice";
import { StudioSidebar } from "./_components/studio-sidebar";

/* My Studio (주소: /admin 아래 모든 페이지) 공통 틀
   1) 비밀번호가 설정 안 됐으면 → 설정 안내
   2) 로그인 안 했으면 → 로그인 화면
   3) Supabase 연결 안 됐으면 → 연결 안내
   4) 모두 준비됐으면 → 왼쪽 메뉴 + 오른쪽 내용
   ※ 각 페이지와 저장 동작도 따로 로그인(isAdmin)을 한 번 더 확인합니다. */

export const metadata = { title: "My Studio" };

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  if (!isAdminPasswordSet()) {
    return (
      <Container>
        <Notice title="관리자 비밀번호를 먼저 설정하세요">
          <p>
            1. 프로젝트 폴더의 <code>.env.example</code> 파일을 복사해서 이름을 <code>.env.local</code> 로
            바꿉니다.
          </p>
          <p>
            2. <code>ADMIN_PASSWORD=</code> 뒤에 원하는 비밀번호를 적고 저장합니다.
          </p>
          <p>3. 개발 서버를 껐다가(Ctrl + C) 다시 켭니다(npm run dev).</p>
        </Notice>
      </Container>
    );
  }

  if (!(await isAdmin())) {
    return (
      <Container>
        <LoginForm />
      </Container>
    );
  }

  if (!getAdminClient()) {
    return (
      <Container>
        <Notice title="Supabase 연결이 필요합니다">
          <p>로그인은 됐어요! 이제 데이터를 저장할 데이터베이스를 연결할 차례입니다.</p>
          <p>
            README.md 의 <b>「Supabase 연결하기」</b> 순서대로 <code>.env.local</code> 에 주소와 키를 넣고,
            개발 서버를 다시 켜 주세요.
          </p>
        </Notice>
      </Container>
    );
  }

  return (
    <div className="w-full flex-1 md:flex">
      <StudioSidebar />
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 md:px-12 md:py-12">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
