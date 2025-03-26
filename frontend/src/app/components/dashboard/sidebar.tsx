"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCompany } from "../../contexts/CompanyContext"
import { LayoutDashboard, MessageSquare, FolderTree, Tag, Users, Settings, Activity, Building } from "lucide-react"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "QA Pairs",
    icon: MessageSquare,
    href: "/dashboard/qa-pairs",
    color: "text-violet-500",
  },
  {
    label: "Categories",
    icon: FolderTree,
    href: "/dashboard/categories",
    color: "text-pink-700",
  },
  {
    label: "Tags",
    icon: Tag,
    color: "text-orange-500",
    href: "/dashboard/tags",
  },
  {
    label: "Users",
    icon: Users,
    href: "/dashboard/users",
    color: "text-emerald-500",
    adminOnly: true,
  },
  {
    label: "Companies",
    icon: Building,
    href: "/dashboard/companies",
    color: "text-blue-500",
    superAdminOnly: true,
  },
  {
    label: "Activity",
    icon: Activity,
    href: "/dashboard/activity",
    color: "text-rose-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isSuperAdmin } = useCompany()
  const { user } = useAuth()

  const isAdmin = user?.is_admin || false

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white">
      <div className="px-3 py-2 flex-1">
        <div className="relative h-8 flex items-center pl-3 mb-12">
          <h1 className="text-2xl font-bold">Chatbot</h1>
        </div>
        <div className="space-y-1">
          {routes.map((route) => {
            // Skip routes that require admin if user is not admin
            if (route.adminOnly && !isAdmin) return null

            // Skip routes that require super admin if user is not super admin
            if (route.superAdminOnly && !isSuperAdmin) return null

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                  pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Add this import at the top
import { useAuth } from "@/lib/auth-context"

