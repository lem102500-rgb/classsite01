/* ==========================================================================
   ★ 사이트 내용 설정 파일
   --------------------------------------------------------------------------
   사이트에 보이는 글자(이름, 소개, 메뉴, 연락처 등)는 대부분 여기에 있습니다.
   따옴표 " " 안의 글자만 바꾸고 저장하면 화면에 바로 반영됩니다.
   (따옴표, 쉼표, 중괄호 { } 는 지우지 않도록 조심!)
   ========================================================================== */

import type { Item } from "@/lib/types";

export const siteConfig = {
  /* 브라우저 탭 제목과 검색 결과에 보이는 정보 */
  name: "EUNMI.",
  title: "Eunmi — 바이브 코딩을 가르치는 사람",
  description: "아이디어를 말로 설명하면 화면이 되는 바이브 코딩, 그 수업을 하는 이은미의 프로필입니다.",

  /* 상단 메뉴 (href 의 #이름 은 아래 섹션의 id 와 같아야 해당 위치로 이동) */
  nav: [
    { label: "About", href: "#about" },
    { label: "Playground", href: "#features" },
  ],
  /* 상단 메뉴 맨 오른쪽 — 관리자 페이지(비밀 공간)를 새 탭에서 열기 */
  secretButton: { label: "My Studio", href: "/admin" },

  /* 첫 화면(히어로) */
  hero: {
    eyebrow: "코딩 클래스, AI 클래스, 디지털 클래스", // 쉼표로 나누면 알약 이름이 여러 개
    title: "호기심 하나로 시작해\n나만의 작품을 완성해요.",
    description: "상상이 눈앞의 결과물이 되는 시간.",
    primaryCta: { label: "수업 알아보기", href: "#about" },
    secondaryCta: { label: "문의하기", href: "#contact" },
    /* 오른쪽 일러스트와 그 위 알약 모양 태그 (그림은 public 폴더에 넣고 "/파일이름.png" 로 바꾸면 됨) */
    image: {
      // 종이 배경을 투명하게 만든 그림 (원본: "/hero-portrait.png", 예전 그림: "/hero-illustration.png" 470×536)
      src: "/hero-portrait-cutout.png",
      alt: "노트북 앞에서 웃으며 설명하는 강사 일러스트",
      width: 453,
      height: 485,
    },
    tags: [] as string[], // 사진 위 태그 — 다시 넣으려면 예) ["Teacher", "Vibe Coder"]
  },

  /* 히어로 아래 '함께한 곳' 이름 줄 */
  partners: {
    title: "함께 배우고, 함께 만든 곳들",
    names: ["Vibe Class", "코딩 놀이터", "Open Lab", "Studio Lem", "Daily Web"],
  },

  /* 하이라이트 섹션 (진한 카드 + 연두 숫자 카드) */
  highlights: {
    darkTitle: "모르는 건 편하게 묻고,\n만든 건 자랑스럽게.",
    image: {
      src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1000&q=80&auto=format&fit=crop",
      alt: "강의실에서 화면을 보며 수업을 듣는 사람들",
    },
    tags: ["Workshop", "Live Coding", "Q&A"],
    title: "숫자로 보는 나의 수업",
    description: "한 사람 한 사람이 자기 화면을 완성할 때까지 함께합니다. 작은 완성이 모여 지금의 수업이 됐어요.",
    stats: [
      { value: "320+", label: "함께한 수강생" },
      { value: "48", label: "진행한 수업" },
      { value: "1,200+", label: "완성된 웹페이지" },
    ],
  },

  /* 첫 화면 날씨 (도시 이름과 위치를 바꾸면 다른 도시 날씨가 나옴)
     위도·경도는 지도 사이트에서 도시를 검색하면 알 수 있어요. 예) 부산 35.1796, 129.0756 */
  weather: { city: "서울", latitude: 37.5665, longitude: 126.978 },

  /* 소개 섹션 */
  about: {
    eyebrow: "About me",
    title: "설명하고, 만들고, 고치고 — 저는 이렇게 가르쳐요.",
    paragraphs: [
      "어려운 문법 대신 '무엇을 만들고 싶은지' 말하는 법부터 시작해요. AI와 대화하며 화면이 바뀌는 걸 직접 보는 게 첫 수업이에요.",
      "막히는 곳에서 함께 멈추고, 함께 고칩니다. 수업이 끝나면 모두 자기 이름이 걸린 웹사이트를 갖게 돼요.",
    ],
    button: { label: "수강생 작업물 보기", href: "#features" },
    images: [
      {
        src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80&auto=format&fit=crop",
        alt: "노트북을 펴 놓고 웃으며 이야기하는 수강생들",
      },
      {
        src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=700&q=80&auto=format&fit=crop",
        alt: "코드가 띄워진 노트북과 노란 컵",
      },
    ],
  },

  /* 작업물(항목) 섹션의 제목 — 카드 목록 자체는 관리자 페이지(/admin)에서 관리 */
  features: {
    eyebrow: "Works",
    title: "수강생 작업물",
    description: "수업에서 완성한 웹사이트들이에요. 관리자 페이지에서 카드를 추가·수정·삭제할 수 있어요.",
  },

  /* 연락처 섹션 */
  contact: {
    eyebrow: "Contact",
    title: "함께 이야기해요",
    description: "궁금한 점이 있다면 언제든 연락 주세요.",
    email: "hello@example.com",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "GitHub", href: "https://github.com" },
    ],
  },

  /* 맨 아래(푸터) */
  footer: {
    copyright: "© 2026 Eunmi. All rights reserved.",
  },

  /* 관리자 페이지에서 관리할 섹션 목록.
     key  = 데이터베이스에 저장되는 이름(영문 소문자),
     label = 관리자 화면에 보이는 이름.
     예) 포트폴리오라면 { key: "works", label: "작업물" } 을 추가 */
  adminSections: [{ key: "features", label: "기능" }],
};

/* Supabase를 아직 연결하지 않았을 때 대신 보여줄 예시 카드.
   Supabase를 연결하면 이 내용 대신 관리자 페이지에서 등록한 카드가 보입니다. */
export const sampleItems: Item[] = [
  {
    id: "sample-1",
    section: "features",
    title: "첫 번째 기능",
    description: "카드 하나에 제목, 설명, 이미지, 링크를 넣을 수 있어요.",
    image_url: null,
    link_url: null,
    sort_order: 1,
    is_visible: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "sample-2",
    section: "features",
    title: "두 번째 기능",
    description: "관리자 페이지에서 순서를 바꾸거나 숨길 수도 있어요.",
    image_url: null,
    link_url: null,
    sort_order: 2,
    is_visible: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "sample-3",
    section: "features",
    title: "세 번째 기능",
    description: "포트폴리오라면 작업물, 가게라면 메뉴처럼 자유롭게 쓰세요.",
    image_url: null,
    link_url: null,
    sort_order: 3,
    is_visible: true,
    created_at: "2026-01-01T00:00:00Z",
  },
];
