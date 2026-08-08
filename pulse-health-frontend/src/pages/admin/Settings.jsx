import EmptyState from "../../components/ui/EmptyState.jsx";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <EmptyState
      icon={SettingsIcon}
      title="Platform settings"
      sub="Manage organizations, admin users, and network-wide preferences."
    />
  );
}
