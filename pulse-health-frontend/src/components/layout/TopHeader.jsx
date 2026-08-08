import { Menu, Search, Bell } from "lucide-react";

export default function TopHeader({ title, avatarLabel = "P", onMenu }) {
  return (
    <header className="h-16 flex items-center justify-between px-5 sm:px-7 border-b border-line sticky top-0 bg-app/90 backdrop-blur z-20">
      <div className="flex items-center gap-3">
        <button className="icon-btn lg:hidden" onClick={onMenu}>
          <Menu size={18} />
        </button>
        <h1 className="font-display text-[19px] m-0">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 rounded-[10px] px-3 py-1.5 text-[12.5px] text-muted">
          <Search size={14} />
          <span>Search…</span>
        </div>
        <button className="icon-btn"><Bell size={16} /></button>
        <span className="w-8 h-8 rounded-full bg-indigo text-white flex items-center justify-center text-[12.5px] font-bold">
          {avatarLabel}
        </span>
      </div>
    </header>
  );
}
