import { Youtube } from "lucide-react";

export default function YoutubePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-zinc-100 flex items-center gap-2">
        <Youtube className="w-6 h-6 text-red-400" />
        유튜브팀
      </h1>
      <p className="text-zinc-500 text-sm">
        유튜브 관련 작업 공간입니다. 곧 제목 생성기, 썸네일 아이디어, 스크립트 분석 기능이 추가됩니다.
      </p>
      <div className="bg-card border border-card-border rounded-xl p-6 text-center text-zinc-600 text-sm">
        준비 중 · 콘텐츠 워터폴에서 먼저 숏폼 대본을 생성해보세요
      </div>
    </div>
  );
}
