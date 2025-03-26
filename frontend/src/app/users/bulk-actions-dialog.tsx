"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Label } from "../components/ui/label"
import { useToast } from "../components/ui/use-toast"
import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"

interface BulkActionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedUsers: string[]
  onAction: (action: string, value: string) => void
}

export function BulkActionsDialog({ open, onOpenChange, selectedUsers, onAction }: BulkActionsDialogProps) {
  const { toast } = useToast()
  const [action, setAction] = useState("")
  const [value, setValue] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleAction = () => {
    if (!action) return

    if (action === "delete" && !confirmDelete) {
      setConfirmDelete(true)
      return
    }

    onAction(action, value)

    toast({
      title: "Bulk Action Completed",
      description: `Successfully applied ${action} to ${selectedUsers.length} users.`,
    })

    // Reset state
    setAction("")
    setValue("")
    setConfirmDelete(false)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setAction("")
    setValue("")
    setConfirmDelete(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bulk Actions</DialogTitle>
          <DialogDescription>Apply actions to {selectedUsers.length} selected users.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="action">Select Action</Label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger id="action">
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Change Status</SelectItem>
                <SelectItem value="role">Change Role</SelectItem>
                <SelectItem value="delete">Delete Users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {action === "status" && (
            <div className="space-y-2">
              <Label htmlFor="status-value">New Status</Label>
              <Select value={value} onValueChange={setValue}>
                <SelectTrigger id="status-value">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {action === "role" && (
            <div className="space-y-2">
              <Label htmlFor="role-value">New Role</Label>
              <Select value={value} onValueChange={setValue}>
                <SelectTrigger id="role-value">
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
          )}

          {action === "delete" && confirmDelete && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                You are about to delete {selectedUsers.length} users. This action cannot be undone.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleAction}
            disabled={!action || (action !== "delete" && !value)}
            variant={action === "delete" && confirmDelete ? "destructive" : "default"}
          >
            {action === "delete" && confirmDelete ? "Confirm Delete" : "Apply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

