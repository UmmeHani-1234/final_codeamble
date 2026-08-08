export const SECTION_CLASSES = {
  overview: { eyebrow: "text-brand/70", title: "text-brand" },
  alerts: { eyebrow: "text-danger/70", title: "text-danger" },
  regional: { eyebrow: "text-indigo/70", title: "text-indigo" },
  surveillance: { eyebrow: "text-cyan/70", title: "text-cyan" },
  submitData: { eyebrow: "text-slate-600", title: "text-slate-800" },
  registeredUsers: { eyebrow: "text-indigo/70", title: "text-indigo" },
  notifications: { eyebrow: "text-warning/70", title: "text-warning" },
  riskHistory: { eyebrow: "text-danger/70", title: "text-danger" },
  hospitalMessaging: { eyebrow: "text-cyan/70", title: "text-cyan" },
};

const VALUE_CLASS = {
  risk: "text-danger",
  positive: "text-success",
  neutral: "text-indigo",
  time: "text-slate-900",
};

export function valueTone(label) {
  const normalized = String(label).toLowerCase();

  if (/active|alert|high risk|high|risk/i.test(normalized)) {
    return VALUE_CLASS.risk;
  }

  if (/submitted|complete|good|yes|score|health|operational|ready|available/i.test(normalized)) {
    return VALUE_CLASS.positive;
  }

  if (/total|registered|users|organizations|team|count|focus/i.test(normalized)) {
    return VALUE_CLASS.neutral;
  }

  if (/last|latest|time|activity|upload|submission|date|window/i.test(normalized)) {
    return VALUE_CLASS.time;
  }

  return VALUE_CLASS.time;
}
