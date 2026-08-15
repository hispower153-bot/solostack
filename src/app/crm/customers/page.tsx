import { Database } from "lucide-react";

export default function CustomersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-zinc-100 flex items-center gap-2">
        <Database className="w-6 h-6 text-emerald-400" />
        상담고객 DB
      </h1>
      <p className="text-zinc-500 text-sm">
        상담 고객 정보를 관리하는 공간입니다. 간단한 CRM 기능이 들어갈 예정입니다.
      </p>
      <div className="bg-card border border-card-border rounded-xl p-6 text-center text-zinc-600 text-sm">
        준비 중
      </div>
    </div>
  );
}
