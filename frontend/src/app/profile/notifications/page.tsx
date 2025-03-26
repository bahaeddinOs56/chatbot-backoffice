import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Label } from "@/app/components/ui/label"
import { Switch } from "@/app/components/ui/switch"
import { ArrowLeft, Save, Bell, Mail, MessageSquare, AlertTriangle, BarChart } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/app/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/profile">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">Notification Preferences</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Control how and when you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="email-notifications" className="font-medium">
                      Email Notifications
                    </Label>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="push-notifications" className="font-medium">
                      Push Notifications
                    </Label>
                  </div>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="sms-notifications" className="font-medium">
                      SMS Notifications
                    </Label>
                  </div>
                  <Switch id="sms-notifications" />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Notification Types</h3>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <h4 className="font-medium">Q&A Management</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="qa-created" className="text-sm">
                        New Q&A created
                      </Label>
                      <Switch id="qa-created" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="qa-updated" className="text-sm">
                        Q&A updated
                      </Label>
                      <Switch id="qa-updated" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="qa-deleted" className="text-sm">
                        Q&A deleted
                      </Label>
                      <Switch id="qa-deleted" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="qa-comments" className="text-sm">
                        Comments on Q&A
                      </Label>
                      <Switch id="qa-comments" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                    <h4 className="font-medium">System Alerts</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="system-updates" className="text-sm">
                        System updates
                      </Label>
                      <Switch id="system-updates" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="security-alerts" className="text-sm">
                        Security alerts
                      </Label>
                      <Switch id="security-alerts" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="maintenance" className="text-sm">
                        Scheduled maintenance
                      </Label>
                      <Switch id="maintenance" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="downtime" className="text-sm">
                        Unexpected downtime
                      </Label>
                      <Switch id="downtime" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-muted-foreground" />
                    <h4 className="font-medium">Analytics & Reports</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="weekly-reports" className="text-sm">
                        Weekly reports
                      </Label>
                      <Switch id="weekly-reports" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="monthly-reports" className="text-sm">
                        Monthly reports
                      </Label>
                      <Switch id="monthly-reports" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="performance-alerts" className="text-sm">
                        Performance alerts
                      </Label>
                      <Switch id="performance-alerts" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="usage-stats" className="text-sm">
                        Usage statistics
                      </Label>
                      <Switch id="usage-stats" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Email Digest Frequency</h3>
              <RadioGroup defaultValue="daily" className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="realtime" id="realtime" />
                  <Label htmlFor="realtime">Real-time (as events occur)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily">Daily digest</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Weekly digest</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="never" />
                  <Label htmlFor="never">Never (disable email digests)</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

