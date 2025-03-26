import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Switch } from "@/app/components/ui/switch"
import { ArrowLeft, Save, Shield, AlertTriangle, Smartphone, Key } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"

export default function SecurityPage() {
  // Mock session data
  const activeSessions = [
    {
      id: "1",
      device: "Chrome on Windows",
      location: "New York, USA",
      ip: "192.168.1.1",
      lastActive: "Just now",
      current: true,
    },
    {
      id: "2",
      device: "Safari on iPhone",
      location: "Boston, USA",
      ip: "192.168.1.2",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      id: "3",
      device: "Firefox on MacOS",
      location: "San Francisco, USA",
      ip: "192.168.1.3",
      lastActive: "1 day ago",
      current: false,
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/profile">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">Security & Privacy</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="mr-2 h-5 w-5" />
              Password
            </CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Password must:</p>
              <ul className="list-disc list-inside pl-2 space-y-1 mt-1">
                <li>Be at least 8 characters long</li>
                <li>Include at least one uppercase letter</li>
                <li>Include at least one number</li>
                <li>Include at least one special character</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Update Password
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="mr-2 h-5 w-5" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>Add an extra layer of security to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Protect your account with an additional verification step when logging in.
                </p>
              </div>
              <Switch id="2fa" />
            </div>
            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-2">Recovery Codes</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Recovery codes can be used to access your account if you lose your two-factor authentication device.
              </p>
              <div className="flex gap-2">
                <Button variant="outline">View Recovery Codes</Button>
                <Button variant="outline">Generate New Codes</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Active Sessions
            </CardTitle>
            <CardDescription>Manage your active sessions across devices</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      {session.device}
                      {session.current && (
                        <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Current</span>
                      )}
                    </TableCell>
                    <TableCell>{session.location}</TableCell>
                    <TableCell>{session.ip}</TableCell>
                    <TableCell>{session.lastActive}</TableCell>
                    <TableCell className="text-right">
                      {!session.current && (
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          Revoke
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" className="text-destructive hover:text-destructive">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Revoke All Other Sessions
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

