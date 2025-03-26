"use client"
import { CompanyList } from "@/components/company/CompanyList"
import { useCompany } from "../../contexts/CompanyContext"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"

export default function CompaniesPage() {
  const { user } = useAuth()
  const { isSuperAdmin } = useCompany()

  // Only super admins can access this page
  if (!user?.is_super_admin) {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Company Management</h1>
        <p className="text-muted-foreground">Create and manage companies in the system</p>
      </div>
      <CompanyList />
    </div>
  )
}

