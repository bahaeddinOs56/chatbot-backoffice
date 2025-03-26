import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/app/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Mail, CalendarDays, UserCircle } from "lucide-react"

export default function ProfilePage() {
  // Mock user data - in a real app, this would come from an API
  const user = {
    name: "Admin User",
    email: "admin@example.com",
    role: "Administrator",
    avatarUrl: null,
    joinedDate: "January 15, 2023",
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold tracking-tight">My Profile</h2>

        <Card className="max-w-xl mx-auto">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <Avatar className="h-24 w-24">
                {user.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                ) : (
                  <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1 space-y-4 text-center sm:text-left">
                <div>
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <p className="text-muted-foreground">{user.role}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 justify-center sm:justify-start text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>

                  <div className="flex items-center gap-2 justify-center sm:justify-start text-sm">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span>Member since {user.joinedDate}</span>
                  </div>

                  <div className="flex items-center gap-2 justify-center sm:justify-start text-sm">
                    <UserCircle className="h-4 w-4 text-muted-foreground" />
                    <span>Active account in good standing</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

