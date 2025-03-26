"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageSquare, Settings, Users, BarChart, CreditCard, Home, X, FolderTree } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "../../lib/utils"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

interface SidebarItemProps {
  icon: React.ElementType
  label: string
  href: string
  active?: boolean
}

function SidebarItem({ icon: Icon, label, href, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  )
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r p-4 transition-transform duration-200 md:relative md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">ChatAdmin</span>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        <div className="space-y-1">
          <SidebarItem icon={Home} label="Dashboard" href="/" active={pathname === "/"} />
          <SidebarItem icon={MessageSquare} label="Q&A Management" href="/qa" active={pathname === "/qa"} />
          <SidebarItem icon={FolderTree} label="Categories" href="/categories" active={pathname === "/categories"} />
          <SidebarItem icon={Users} label="User Management" href="/users" active={pathname === "/users"} />
          <SidebarItem icon={BarChart} label="Analytics" href="/analytics" active={pathname === "/analytics"} />
          <SidebarItem icon={CreditCard} label="Billing" href="/billing" active={pathname === "/billing"} />
          <SidebarItem icon={Settings} label="Settings" href="/settings" active={pathname === "/settings"} />
        </div>
      </div>
    </>
  )
}

