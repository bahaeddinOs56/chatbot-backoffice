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
import { Switch } from "../components/ui/switch"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Copy } from "lucide-react"
import { useToast } from "../components/ui/use-toast"

interface ResetPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userEmail: string
  onReset: (data: { sendEmail: boolean; password?: string }) => void
}

export function ResetPasswordDialog({ open, onOpenChange, userEmail, onReset }: ResetPasswordDialogProps) {
  const { toast } = useToast()
  const [sendEmail, setSendEmail] = useState(true)
  const [generatedPassword, setGeneratedPassword] = useState("")

  const handleGeneratePassword = () => {
    // Simple password generator - in a real app, use a more secure method
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setGeneratedPassword(password)
  }

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword)
    toast({
      title: "Password Copied",
      description: "The password has been copied to your clipboard.",
    })
  }

  const handleReset = () => {
    if (!sendEmail && !generatedPassword) {
      handleGeneratePassword()
      return
    }

    onReset({
      sendEmail,
      password: sendEmail ? undefined : generatedPassword,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>Reset the password for {userEmail}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Switch id="send-email" checked={sendEmail} onCheckedChange={setSendEmail} />
            <Label htmlFor="send-email">Send password reset email</Label>
          </div>

          {!sendEmail && (
            <div className="space-y-2">
              <Label htmlFor="generated-password">Generated Password</Label>
              <div className="flex gap-2">
                <Input
                  id="generated-password"
                  value={generatedPassword}
                  readOnly
                  placeholder="Click generate to create a password"
                />
                <Button variant="outline" size="icon" onClick={handleCopyPassword} type="button">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={handleGeneratePassword} type="button" className="mt-2">
                Generate
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleReset}>Reset Password</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

