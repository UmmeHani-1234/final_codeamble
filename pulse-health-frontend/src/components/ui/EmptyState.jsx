import { Layers } from "lucide-react";

const TONES = {
  success: "bg-success-tint text-success",
  info: "bg-cyan-tint text-cyan",
  neutral: "bg-slate-100 text-slate-500",
  brand: "bg-brand-tint text-brand",
};
const SURFACES = { success: "surface-status", info: "surface-environment", neutral: "bg-white border-slate-200", brand: "surface-action" };

export default function EmptyState({ title, sub, icon: Icon = Layers, tone = "brand" }) {
  return (
    <div className={"rounded-3xl border p-8 shadow-sm " + (SURFACES[tone] || SURFACES.brand)}>
      <div className={"mx-auto flex h-16 w-16 items-center justify-center rounded-3xl " + (TONES[tone] || TONES.brand)}>
        <Icon size={22} />
      </div>
      <h3 className="font-semibold text-[18px] text-indigo mt-6 mb-2 text-center">{title}</h3>
      <p className="text-[13.5px] text-slate-500 max-w-[360px] mx-auto text-center leading-6">{sub}</p>
    </div>
  );
}
