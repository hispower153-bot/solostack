"use client";

import { usePathname } from "next/navigation";

const pathLabels: Record<string, string> = {
  "/": "전사 대시보드",
  "/planning": "기획팀",
  "/content-waterfall": "콘텐츠 워터폴",
  "/youtube": "유튜브팀",
  "/instagram": "인스타그램팀",
  "/blog": "블로그팀",
  "/dev": "개발팀",
  "/marketing/meta": "마케팅팀 › 메타광고",
  "/marketing/google": "마케팅팀 › 구글애드",
  "/marketing/image-gen": "마케팅팀 › 이미지 소재 생성기",
  "/marketing/utm": "마케팅팀 › UTM 관리",
  "/crm/call-copilot": "CRM팀 › 전화상담 코파일럿",
  "/crm/customers": "CRM팀 › 상담고객 DB",
  "/ppt": "PPT팀",
  "/sales": "세일즈팀",
};

export default function TopBar() {
  const pathname = usePathname();
  const label = pathLabels[pathname] || "SoloStack";

  return (
    <header className="h-14 border-b border-sidebar-border bg-[#0f1117]/90 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-zinc-500">SoloStack</span>
        <span className="text-zinc-600">›</span>
        <span className="text-zinc-200 font-medium">{label}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-xs text-zinc-500 hidden sm:block">
          1인기업가를 위한 올인원 작업 허브
        </div>
        <div className="w-8 h-8 rounded-full bg-sidebar-active flex items-center justify-center text-xs font-medium text-zinc-300">
          ME
        </div>
      </div>
    </header>
  );
}
