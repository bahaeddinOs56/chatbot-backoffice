"use client"

import { useState } from "react"
import { ArrowLeft, Edit, Key, Mail, Shield, Clock, Activity, MoreHorizontal } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { UserDialog } from "./user-dialog"
import { ResetPasswordDialog } from "./reset-password-dialog"
import { UserActivityLog } from "./user-activity-log"
import { UserPermissions } from "./user-permissions"
import { useToast } from "../components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

interface UserDetailProps {
  user: any
  onBack: () => void
  onUserUpdate: (updatedUser: any) => void
}

export function UserDetail({ user, onBack, onUserUpdate }: UserDetailProps) {
  const { toast } = useToast()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)

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

  const handleSendInvite = () => {
    toast({
      title: "Invitation Sent",
      description: `An invitation email has been sent to ${user.email}.`,
    })
  }

  const handleResetPassword = (data: { sendEmail: boolean }) => {
    toast({
      title: "Password Reset",
      description: data.sendEmail
        ? `Password reset instructions have been sent to ${user.email}.`
        : "Password has been reset successfully.",
    })
    setResetPasswordDialogOpen(false)
  }

  const handleUserUpdate = (updatedUser: any) => {
    onUserUpdate(updatedUser)
    setEditDialogOpen(false)
  }

  const roleLabels: Record<string, string> = {
    admin: "Administrator",
    content_manager: "Content Manager",
    analyst: "Analyst",
    viewer: "Viewer",
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">User Details</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Profile</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setResetPasswordDialogOpen(true)}>
                      <Key className="mr-2 h-4 w-4" />
                      Reset Password
                    </DropdownMenuItem>
                    {user.status !== "active" && (
                      <DropdownMenuItem onClick={handleSendInvite}>
                        <Mail className="mr-2 h-4 w-4" />
                        Resend Invite
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                {user.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                ) : (
                  <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
                )}
              </Avatar>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
              <div className="flex gap-2 mb-4">
                <Badge variant={user.status === "active" ? "default" : "outline"}>
                  {user.status === "active" ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="secondary">{roleLabels[user.role] || user.role}</Badge>
              </div>
              <div className="w-full space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Login:</span>
                  <span>{formatDate(user.lastLogin)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDate(user.createdAt || "2023-04-01T10:00:00Z")}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" onClick={() => setEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setResetPasswordDialogOpen(true)}>
                <Key className="mr-2 h-4 w-4" />
                Reset Password
              </Button>
            </CardFooter>
          </Card>

          <div className="md:col-span-2">
            <Tabs defaultValue="activity">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="activity">
                  <Activity className="mr-2 h-4 w-4" />
                  Activity
                </TabsTrigger>
                <TabsTrigger value="permissions">
                  <Shield className="mr-2 h-4 w-4" />
                  Permissions
                </TabsTrigger>
                <TabsTrigger value="sessions">
                  <Clock className="mr-2 h-4 w-4" />
                  Sessions
                </TabsTrigger>
              </TabsList>
              <TabsContent value="activity" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                    <CardDescription>Recent actions performed by this user</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserActivityLog userId={user.id} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="permissions" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>User Permissions</CardTitle>
                    <CardDescription>Manage what this user can access and modify</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserPermissions
                      userId={user.id}
                      role={user.role}
                      onRoleChange={(newRole) => {
                        onUserUpdate({ ...user, role: newRole })
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="sessions" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                    <CardDescription>Manage user's active login sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No active sessions found</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Revoke All Sessions
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <UserDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} initialData={user} onSave={handleUserUpdate} />

      <ResetPasswordDialog
        open={resetPasswordDialogOpen}
        onOpenChange={setResetPasswordDialogOpen}
        userEmail={user.email}
        onReset={handleResetPassword}
      />
    </>
  )
}

