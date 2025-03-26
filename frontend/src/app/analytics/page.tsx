import { DashboardLayout } from "../components/dashboard-layout"
import { AnalyticsDashboard } from "./analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
        <AnalyticsDashboard />
      </div>
    </DashboardLayout>
  )
}

