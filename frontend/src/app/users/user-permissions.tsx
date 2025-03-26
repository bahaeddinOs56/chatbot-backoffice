"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Switch } from "../components/ui/switch"
import { Label } from "../components/ui/label"
import { Card, CardContent } from "../components/ui/card"
import { useToast } from "../components/ui/use-toast"

interface Permission {
  id: string
  name: string
  description: string
  enabled: boolean
}

interface PermissionGroup {
  id: string
  name: string
  permissions: Permission[]
}

interface UserPermissionsProps {
  userId: string
  role: string
  onRoleChange: (role: string) => void
}

export function UserPermissions({ userId, role, onRoleChange }: UserPermissionsProps) {
  const { toast } = useToast()

  // Mock permission data based on role
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([
    {
      id: "qa",
      name: "Q&A Management",
      permissions: [
        {
          id: "qa.view",
          name: "View Q&As",
          description: "Can view all Q&A pairs",
          enabled: true,
        },
        {
          id: "qa.create",
          name: "Create Q&As",
          description: "Can create new Q&A pairs",
          enabled: role === "admin" || role === "content_manager",
        },
        {
          id: "qa.edit",
          name: "Edit Q&As",
          description: "Can edit existing Q&A pairs",
          enabled: role === "admin" || role === "content_manager",
        },
        {
          id: "qa.delete",
          name: "Delete Q&As",
          description: "Can delete Q&A pairs",
          enabled: role === "admin",
        },
      ],
    },
    {
      id: "users",
      name: "User Management",
      permissions: [
        {
          id: "users.view",
          name: "View Users",
          description: "Can view all users",
          enabled: role === "admin",
        },
        {
          id: "users.create",
          name: "Create Users",
          description: "Can create new users",
          enabled: role === "admin",
        },
        {
          id: "users.edit",
          name: "Edit Users",
          description: "Can edit existing users",
          enabled: role === "admin",
        },
        {
          id: "users.delete",
          name: "Delete Users",
          description: "Can delete users",
          enabled: role === "admin",
        },
      ],
    },
    {
      id: "analytics",
      name: "Analytics",
      permissions: [
        {
          id: "analytics.view",
          name: "View Analytics",
          description: "Can view analytics data",
          enabled: role === "admin" || role === "analyst",
        },
        {
          id: "analytics.export",
          name: "Export Analytics",
          description: "Can export analytics data",
          enabled: role === "admin" || role === "analyst",
        },
      ],
    },
    {
      id: "settings",
      name: "Settings",
      permissions: [
        {
          id: "settings.view",
          name: "View Settings",
          description: "Can view system settings",
          enabled: role === "admin" || role === "content_manager",
        },
        {
          id: "settings.edit",
          name: "Edit Settings",
          description: "Can edit system settings",
          enabled: role === "admin",
        },
      ],
    },
  ])

  const handleRoleChange = (newRole: string) => {
    // In a real app, this would be an API call
    onRoleChange(newRole)

    // Update permissions based on new role
    const updatedGroups = permissionGroups.map((group) => ({
      ...group,
      permissions: group.permissions.map((perm) => {
        let enabled = false

        // Set permissions based on role
        if (newRole === "admin") {
          enabled = true
        } else if (newRole === "content_manager") {
          enabled = perm.id.startsWith("qa.") || perm.id === "settings.view"
        } else if (newRole === "analyst") {
          enabled = perm.id.startsWith("analytics.") || perm.id === "qa.view"
        } else if (newRole === "viewer") {
          enabled = perm.id === "qa.view"
        }

        return { ...perm, enabled }
      }),
    }))

    setPermissionGroups(updatedGroups)

    toast({
      title: "Role Updated",
      description: "User role and permissions have been updated.",
    })
  }

  const handleTogglePermission = (groupId: string, permId: string) => {
    // In a real app, this would be an API call
    const updatedGroups = permissionGroups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          permissions: group.permissions.map((perm) => {
            if (perm.id === permId) {
              return { ...perm, enabled: !perm.enabled }
            }
            return perm
          }),
        }
      }
      return group
    })

    setPermissionGroups(updatedGroups)

    toast({
      title: "Permission Updated",
      description: "User permission has been updated.",
    })
  }

  const handleResetToDefault = () => {
    handleRoleChange(role)

    toast({
      title: "Permissions Reset",
      description: "User permissions have been reset to default for their role.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="space-y-1">
          <Label htmlFor="role">User Role</Label>
          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger id="role" className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="content_manager">Content Manager</SelectItem>
              <SelectItem value="analyst">Analyst</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={handleResetToDefault}>
          Reset to Default
        </Button>
      </div>

      <div className="space-y-4">
        {permissionGroups.map((group) => (
          <Card key={group.id}>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">{group.name}</h3>
              <div className="space-y-4">
                {group.permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor={permission.id}>{permission.name}</Label>
                      <p className="text-sm text-muted-foreground">{permission.description}</p>
                    </div>
                    <Switch
                      id={permission.id}
                      checked={permission.enabled}
                      onCheckedChange={() => handleTogglePermission(group.id, permission.id)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

