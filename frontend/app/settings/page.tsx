import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure system preferences, user roles, notification settings, and integration options for your ERP platform."
        breadcrumbs={[{ label: "Settings" }]}
      />
      <EmptyState
        title="System Preferences & Integrations"
        description="Control access permissions for different developer modules, update the Wages Laravel server port, or toggle notifications rules."
        moduleName="Settings"
        icon={Settings}
        features={[
          "User role & permission gates",
          "Notification dispatch thresholds",
          "API Gateway connection routes",
          "Dark/Light system preferences",
        ]}
      />
    </div>
  );
}
