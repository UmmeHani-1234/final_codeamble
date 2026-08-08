import EmptyState from "../../components/ui/EmptyState.jsx";
import { Clock } from "lucide-react";

export default function History() {
  return (
    <EmptyState
      icon={Clock}
      title="No history yet"
      sub="Past submissions and resolved alerts for your hospital will appear here once you've been reporting for a while."
    />
  );
}
