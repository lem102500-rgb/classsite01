/* My Studio(관리자 전용 공간)의 메뉴와 입력 칸 설정.
   - 메뉴 이름, 설명, 입력 칸, 선택지를 바꾸고 싶으면 이 파일만 고치면 됩니다.
   - 저장되는 표: supabase/schema.sql 의 studio_items */

export type StudioKind = "schedule" | "todo" | "material" | "idea";

/** 데이터베이스 한 줄의 모양 */
export type StudioItem = {
  id: string;
  kind: StudioKind;
  title: string;
  category: string | null;
  status: string | null;
  date: string | null; // "2026-11-06"
  time: string | null;
  place: string | null;
  link_url: string | null;
  memo: string | null;
  created_at: string;
};

/** 입력 칸 하나 */
export type StudioField = {
  name: "title" | "category" | "status" | "date" | "time" | "place" | "link_url" | "memo";
  label: string;
  type: "text" | "date" | "url" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  options?: readonly string[];
};

export const TODO_STATUSES = ["준비 중", "진행 중", "완료"] as const;
export const MATERIAL_TYPES = ["교안", "PPT", "실습 링크"] as const;
export const IDEA_TYPES = ["수업 아이디어", "메모"] as const;

export const studioMenus: Record<
  StudioKind,
  { title: string; summary: string; href: string; addLabel: string; fields: StudioField[] }
> = {
  schedule: {
    title: "강의 일정",
    summary: "월간 일정 · 출강 정보",
    href: "/admin/schedule",
    addLabel: "일정 추가",
    fields: [
      { name: "title", label: "강의명", type: "text", required: true, placeholder: "예) 바이브 코딩 입문 3회차" },
      { name: "date", label: "날짜", type: "date", required: true },
      { name: "time", label: "시간", type: "text", placeholder: "예) 14:00~17:00" },
      { name: "place", label: "출강 기관 · 장소", type: "text", placeholder: "예) 서울시민대학 3층 강의실" },
      { name: "memo", label: "메모", type: "textarea", placeholder: "준비물, 담당자 연락처 등" },
    ],
  },
  todo: {
    title: "할 일 관리",
    summary: "준비 중 · 진행 중 · 완료",
    href: "/admin/todos",
    addLabel: "할 일 추가",
    fields: [
      { name: "title", label: "할 일", type: "text", required: true, placeholder: "예) 3회차 실습 자료 만들기" },
      { name: "status", label: "상태", type: "select", options: TODO_STATUSES },
      { name: "date", label: "마감일", type: "date" },
      { name: "memo", label: "메모", type: "textarea" },
    ],
  },
  material: {
    title: "수업 자료실",
    summary: "교안 · PPT · 실습 링크",
    href: "/admin/materials",
    addLabel: "자료 추가",
    fields: [
      { name: "title", label: "자료 이름", type: "text", required: true, placeholder: "예) 1회차 교안" },
      { name: "category", label: "종류", type: "select", options: MATERIAL_TYPES },
      { name: "link_url", label: "링크", type: "url", placeholder: "https://" },
      { name: "memo", label: "메모", type: "textarea" },
    ],
  },
  idea: {
    title: "아이디어 노트",
    summary: "수업 아이디어 · 메모",
    href: "/admin/ideas",
    addLabel: "노트 추가",
    fields: [
      { name: "title", label: "제목", type: "text", required: true },
      { name: "category", label: "종류", type: "select", options: IDEA_TYPES },
      { name: "memo", label: "내용", type: "textarea" },
    ],
  },
};

export const STUDIO_KINDS = Object.keys(studioMenus) as StudioKind[];
