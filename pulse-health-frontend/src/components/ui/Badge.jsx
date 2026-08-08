const RISK_MAP = {
  High: "badge-danger",
  Medium: "badge-warning",
  Low: "badge-success",
  Normal: "badge-muted",
};

const STATUS_MAP = {
  Reporting: "badge-success",
  Delayed: "badge-warning",
  "Needs review": "badge-danger",
  Monitoring: "badge-warning",
  Normal: "badge-muted",
  Complete: "badge-success",
};

export function RiskBadge({ level }) {
  return <span className={RISK_MAP[level] || "badge-muted"}>{level}</span>;
}

export function StatusBadge({ status }) {
  return <span className={STATUS_MAP[status] || "badge-muted"}>{status}</span>;
}
