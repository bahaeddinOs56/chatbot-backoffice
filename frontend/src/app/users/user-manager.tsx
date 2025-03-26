"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Users, Upload } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Switch } from "../components/ui/switch"
import { UserDialog } from "./user-dialog"
import { Badge } from "../components/ui/badge"
import { useToast } from "../components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
// Add these imports at the top of the file
import { UserDetail } from "./user-detail"
import { UserImport } from "./user-import"
import { BulkActionsDialog } from "./bulk-actions-dialog"
import { Checkbox } from "../components/ui/checkbox"

// Mock data for initial development
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
    lastLogin: "2023-04-15T10:30:00Z",
    avatarUrl: null,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "content_manager",
    status: "active",
    lastLogin: "2023-04-14T15:45:00Z",
    avatarUrl: null,
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "analyst",
    status: "inactive",
    lastLogin: "2023-03-28T09:15:00Z",
    avatarUrl: null,
  },
]

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  content_manager: "Content Manager",
  analyst: "Analyst",
  viewer: "Viewer",
}

export function UserManager() {
  const { toast } = useToast()
  const [users, setUsers] = useState(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any | null>(null)

  // Add these state variables inside the UserManager component
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [viewingUser, setViewingUser] = useState<any | null>(null)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [bulkActionsDialogOpen, setBulkActionsDialogOpen] = useState(false)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  // Add these functions inside the UserManager component
  const handleSelectUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId))
    } else {
      setSelectedUserIds([...selectedUserIds, userId])
    }
  }

  const handleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([])
    } else {
      setSelectedUserIds(filteredUsers.map((user) => user.id))
    }
  }

  const handleViewUser = (user: any) => {
    setViewingUser(user)
  }

  const handleUserUpdate = (updatedUser: any) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
    setViewingUser(updatedUser)
  }

  const handleImportComplete = (importedUsers: any[]) => {
    setUsers([...users, ...importedUsers])
  }

  const handleBulkAction = (action: string, value: string) => {
    if (action === "delete") {
      setUsers(users.filter((user) => !selectedUserIds.includes(user.id)))
      setSelectedUserIds([])
    } else if (action === "status") {
      setUsers(users.map((user) => (selectedUserIds.includes(user.id) ? { ...user, status: value } : user)))
    } else if (action === "role") {
      setUsers(users.map((user) => (selectedUserIds.includes(user.id) ? { ...user, role: value } : user)))
    }
  }

  const handleAddNew = () => {
    setCurrentUser(null)
    setDialogOpen(true)
  }

  const handleEdit = (user: any) => {
    setCurrentUser(user)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
    toast({
      title: "User Deleted",
      description: "The user has been deleted successfully.",
    })
  }

  const handleToggleStatus = (id: string) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )
    const user = users.find((user) => user.id === id)
    toast({
      title: user?.status === "active" ? "User Deactivated" : "User Activated",
      description: `The user has been ${user?.status === "active" ? "deactivated" : "activated"} successfully.`,
    })
  }

  const handleSave = (userData: any) => {
    if (currentUser) {
      // Edit existing
      setUsers(users.map((user) => (user.id === userData.id ? userData : user)))
      toast({
        title: "User Updated",
        description: "The user has been updated successfully.",
      })
    } else {
      // Add new
      setUsers([
        ...users,
        {
          ...userData,
          id: Math.random().toString(36).substring(2, 9),
          lastLogin: null,
        },
      ])
      toast({
        title: "User Added",
        description: "The new user has been added successfully.",
      })
    }
    setDialogOpen(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Replace the existing "flex flex-col sm:flex-row sm:items-center justify-between gap-4" div with this */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
            <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Import Users
            </Button>
            {selectedUserIds.length > 0 && (
              <Button variant="secondary" onClick={() => setBulkActionsDialogOpen(true)}>
                Bulk Actions ({selectedUserIds.length})
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="content_manager">Content Manager</SelectItem>
              <SelectItem value="analyst">Analyst</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No users found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery || roleFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Add your first user to get started"}
                </p>
                {searchQuery || roleFilter !== "all" || statusFilter !== "all" ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setRoleFilter("all")
                      setStatusFilter("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                ) : (
                  <Button onClick={handleAddNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New User
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            // Replace the existing filteredUsers.map block with this
            filteredUsers.map((user) => (
              <Card key={user.id} className={user.status === "inactive" ? "opacity-60" : undefined}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedUserIds.includes(user.id)}
                        onCheckedChange={() => handleSelectUser(user.id)}
                        aria-label={`Select ${user.name}`}
                      />
                      <div className="cursor-pointer" onClick={() => handleViewUser(user)}>
                        <Avatar>
                          {user.avatarUrl ? (
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                          ) : (
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          )}
                        </Avatar>
                      </div>
                      <div className="cursor-pointer" onClick={() => handleViewUser(user)}>
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {user.email}
                          {user.status === "inactive" && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Inactive
                            </Badge>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={user.status === "active"} onCheckedChange={() => handleToggleStatus(user.id)} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewUser(user)}>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(user)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                            {user.status === "active" ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(user.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Role:</span>
                      <span>{roleLabels[user.role] || user.role}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Last Login:</span>
                      <span>{formatDate(user.lastLogin)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {dialogOpen && (
        <UserDialog open={dialogOpen} onOpenChange={setDialogOpen} initialData={currentUser} onSave={handleSave} />
      )}
      {/* Add these components at the end of the return statement, just before the closing </> */}
      {viewingUser && (
        <UserDetail user={viewingUser} onBack={() => setViewingUser(null)} onUserUpdate={handleUserUpdate} />
      )}

      <UserImport open={importDialogOpen} onOpenChange={setImportDialogOpen} onImportComplete={handleImportComplete} />

      <BulkActionsDialog
        open={bulkActionsDialogOpen}
        onOpenChange={setBulkActionsDialogOpen}
        selectedUsers={selectedUserIds}
        onAction={handleBulkAction}
      />
    </>
  )
}

