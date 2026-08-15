import {
  LayoutDashboard,
  Waves,
  Users,
  Megaphone,
  TrendingUp,
  FileText,
} from "lucide-react";

const cards = [
  {
    title: "콘텐츠 워터폴",
    description: "유튜브 대본 → 블로그 · 카드뉴스 · 숏폼 자동 변환",
    icon: <Waves className="w-5 h-5 text-blue-400" />,
    href: "/content-waterfall",
    badge: "핵심",
  },
  {
    title: "마케팅팀",
    description: "메타광고 · 구글애드 · 이미지 소재 · UTM 관리",
    icon: <Megaphone className="w-5 h-5 text-purple-400" />,
    href: "/marketing/meta",
  },
  {
    title: "CRM팀",
    description: "전화상담 코파일럿 · 상담고객 DB",
    icon: <Users className="w-5 h-5 text-emerald-400" />,
    href: "/crm/customers",
  },
  {
    title: "기획팀",
    description: "아이디어 · 기획서 · 로드맵 관리",
    icon: <FileText className="w-5 h-5 text-amber-400" />,
    href: "/planning",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100 flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-blue-400" />
          전사 대시보드
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          오늘도 SoloStack으로 효율적으로 일하세요.
        </p>
      </div>

      {/* Status Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 text-sm text-blue-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        MVP 구축 중 · 콘텐츠 워터폴 사용 가능 · AI 연동 및 추가 기능 순차 오픈 예정
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "오늘 생성한 콘텐츠", value: "0", icon: <FileText size={16} /> },
          { label: "진행 중 캠페인", value: "0", icon: <Megaphone size={16} /> },
          { label: "상담 고객", value: "0", icon: <Users size={16} /> },
          { label: "이번 주 성장", value: "+0%", icon: <TrendingUp size={16} /> },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-card-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between text-zinc-500 text-xs mb-2">
              <span>{stat.label}</span>
              {stat.icon}
            </div>
            <div className="text-2xl font-semibold text-zinc-100">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div>
        <h2 className="text-sm font-medium text-zinc-400 mb-3">빠른 시작</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="group bg-card border border-card-border rounded-xl p-5 hover:border-blue-500/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sidebar-active flex items-center justify-center">
                    {card.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-zinc-100 group-hover:text-blue-400 transition-colors">
                        {card.title}
                      </h3>
                      {card.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                          {card.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 mt-0.5">{card.description}</p>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
