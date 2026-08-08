import { Layers } from "lucide-react";

export default function EmptyState({ title, sub, icon: Icon = Layers }) {
  return (
    <div className="card text-center py-14 px-6">
      <div className="icon-chip icon-chip-lg mx-auto">
        <Icon size={20} />
      </div>
      <h3 className="font-display text-[18px] mt-3 mb-1">{title}</h3>
      <p className="text-muted text-[13.5px] max-w-[320px] mx-auto">{sub}</p>
    </div>
  );
}
