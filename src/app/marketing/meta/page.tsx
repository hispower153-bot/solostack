import { Target } from "lucide-react";

export default function MetaAdsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-zinc-100 flex items-center gap-2">
        <Target className="w-6 h-6 text-blue-400" />
        메타광고
      </h1>
      <p className="text-zinc-500 text-sm">
        페이스북·인스타 광고 소재 기획 및 카피 생성 공간입니다.
      </p>
      <div className="bg-card border border-card-border rounded-xl p-6 text-center text-zinc-600 text-sm">
        준비 중 · 이미지 소재 생성기와 함께 곧 오픈 예정입니다
      </div>
    </div>
  );
}
