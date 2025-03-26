import { DashboardLayout } from "../components/dashboard-layout"
import { UserManager } from "./user-manager"

export default function UsersPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
        <UserManager />
      </div>
    </DashboardLayout>
  )
}

