import { Layers } from "lucide-react";

export default function EmptyState({ title, sub, icon: Icon = Layers }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
        <Icon size={22} />
      </div>
      <h3 className="font-semibold text-lg text-slate-900 mt-6 mb-2 text-center">{title}</h3>
      <p className="text-sm text-slate-500 max-w-[360px] mx-auto text-center">{sub}</p>
    </div>
  );
}
