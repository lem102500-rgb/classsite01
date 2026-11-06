-- ============================================================================
--  Supabase 초기 설정 SQL  (한 번만 실행)
--  사용법: Supabase 대시보드 → 왼쪽 메뉴 SQL Editor → New query
--          → 이 파일 내용을 전부 복사해 붙여넣기 → 오른쪽 아래 Run
--  여러 번 실행해도 문제 없도록 만들어져 있습니다.
-- ============================================================================

-- 1) 카드(항목)를 저장하는 표 만들기
create table if not exists public.items (
  id          uuid primary key default gen_random_uuid(),
  section     text not null default 'features',   -- 어느 섹션의 카드인지
  title       text not null,                       -- 제목
  description text,                                -- 설명
  image_url   text,                                -- 이미지 주소
  link_url    text,                                -- 클릭 시 이동할 링크
  sort_order  integer not null default 0,          -- 순서 (작을수록 앞)
  is_visible  boolean not null default true,       -- 사이트에 보이기
  created_at  timestamptz not null default now()
);

create index if not exists items_section_order_idx on public.items (section, sort_order);

-- 1-1) 작업물 카드에 자료 파일(PDF, PPT 등) 첨부 칸 추가
alter table public.items add column if not exists file_url  text;  -- 첨부 파일 주소
alter table public.items add column if not exists file_name text;  -- 원래 파일 이름
-- 새 칸을 Supabase 가 바로 알아보도록 새로고침
notify pgrst, 'reload schema';

-- 2) 보안 규칙(RLS) 켜기
--    - 방문자: '보이기'로 설정된 카드만 읽을 수 있음
--    - 추가/수정/삭제: 규칙을 만들지 않음 → 서버의 비밀 키(SECRET KEY)로만 가능
alter table public.items enable row level security;

drop policy if exists "Anyone can read visible items" on public.items;
create policy "Anyone can read visible items"
  on public.items for select
  to anon, authenticated
  using (is_visible = true);

-- 3) 이미지 저장 공간(버킷) 만들기 — 공개 버킷이라 이미지 주소로 누구나 볼 수 있음
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- 4) 예시 카드 3개 (표가 비어 있을 때만 넣음)
insert into public.items (section, title, description, sort_order)
select * from (values
  ('features', '첫 번째 기능', '관리자 페이지에서 이 카드를 수정해 보세요.', 1),
  ('features', '두 번째 기능', '이미지와 링크를 넣을 수도 있어요.', 2),
  ('features', '세 번째 기능', '필요 없으면 삭제하면 됩니다.', 3)
) as v(section, title, description, sort_order)
where not exists (select 1 from public.items);

-- 5) 사이트 문구(히어로 글자 등)를 저장하는 표
--    key 예: 'hero.title'  /  비어 있으면 site.config.ts 의 글자가 대신 보임
create table if not exists public.site_texts (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_texts enable row level security;

drop policy if exists "Anyone can read site texts" on public.site_texts;
create policy "Anyone can read site texts"
  on public.site_texts for select
  to anon, authenticated
  using (true);

-- 6) My Studio(관리자 전용) — 강의 일정, 할 일, 수업 자료, 아이디어 노트를 한 표에 저장
--    kind: 'schedule'(강의 일정) / 'todo'(할 일) / 'material'(수업 자료) / 'idea'(아이디어 노트)
create table if not exists public.studio_items (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null,          -- 어느 메뉴의 항목인지
  title      text not null,          -- 제목 (강의명, 할 일, 자료 이름 ...)
  category   text,                   -- 종류 (교안/PPT/실습 링크, 수업 아이디어/메모)
  status     text,                   -- 할 일 상태 (준비 중/진행 중/완료)
  date       date,                   -- 날짜 (강의 날짜, 마감일)
  time       text,                   -- 시간 (예: 14:00~17:00)
  place      text,                   -- 출강 기관 / 장소
  link_url   text,                   -- 자료 링크
  memo       text,                   -- 메모 / 내용
  created_at timestamptz not null default now()
);

create index if not exists studio_items_kind_idx on public.studio_items (kind, date);

-- 보안 규칙: 읽기 규칙을 만들지 않음 → 방문자는 못 보고, 서버의 비밀 키(관리자)로만 읽고 쓸 수 있음
alter table public.studio_items enable row level security;
