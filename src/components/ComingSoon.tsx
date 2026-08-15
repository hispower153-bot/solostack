import { Construction } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
  tip?: string;
}

export default function ComingSoon({ title, description, tip }: ComingSoonProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        )}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-10 flex flex-col items-center justify-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-sidebar-active flex items-center justify-center">
          <Construction className="w-5 h-5 text-zinc-400" />
        </div>
        <p className="text-zinc-400 text-sm">준비 중입니다</p>
        {tip && (
          <p className="text-xs text-zinc-600 max-w-sm">{tip}</p>
        )}
      </div>
    </div>
  );
}
