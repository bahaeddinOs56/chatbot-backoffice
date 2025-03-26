"use client"

import { useState, useEffect } from "react"
import {
  MessageSquare,
  Edit,
  Trash,
  UserPlus,
  Settings,
  LogIn,
  LogOut,
  AlertTriangle,
  Check,
  X,
  FileText,
  Download,
  Upload,
} from "lucide-react"

interface ActivityLogItem {
  id: string
  userId: string
  action: string
  actionType: string
  timestamp: string
  details?: string
  ipAddress?: string
}

interface UserActivityLogProps {
  userId: string
}

export function UserActivityLog({ userId }: UserActivityLogProps) {
  const [activities, setActivities] = useState<ActivityLogItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchActivities = async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock data
      const mockActivities: ActivityLogItem[] = [
        {
          id: "1",
          userId,
          action: "Logged in",
          actionType: "auth",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          ipAddress: "192.168.1.1",
        },
        {
          id: "2",
          userId,
          action: "Updated Q&A item",
          actionType: "qa",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          details: "Modified answer for 'How do I reset my password?'",
        },
        {
          id: "3",
          userId,
          action: "Added new Q&A item",
          actionType: "qa",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
          details: "Added 'What are your business hours?'",
        },
        {
          id: "4",
          userId,
          action: "Changed settings",
          actionType: "settings",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          details: "Updated chatbot appearance",
        },
        {
          id: "5",
          userId,
          action: "Logged in",
          actionType: "auth",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
          ipAddress: "192.168.1.1",
        },
      ]

      setActivities(mockActivities)
      setLoading(false)
    }

    fetchActivities()
  }, [userId])

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "auth":
        return <LogIn className="h-4 w-4" />
      case "qa":
        return <MessageSquare className="h-4 w-4" />
      case "settings":
        return <Settings className="h-4 w-4" />
      case "user":
        return <UserPlus className="h-4 w-4" />
      case "delete":
        return <Trash className="h-4 w-4" />
      case "edit":
        return <Edit className="h-4 w-4" />
      case "logout":
        return <LogOut className="h-4 w-4" />
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      case "success":
        return <Check className="h-4 w-4" />
      case "failure":
        return <X className="h-4 w-4" />
      case "export":
        return <Download className="h-4 w-4" />
      case "import":
        return <Upload className="h-4 w-4" />
      case "report":
        return <FileText className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No activity found for this user</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
          <div className="bg-muted p-2 rounded-full">{getActionIcon(activity.actionType)}</div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between">
              <p className="font-medium">{activity.action}</p>
              <time className="text-sm text-muted-foreground">{formatDate(activity.timestamp)}</time>
            </div>
            {activity.details && <p className="text-sm text-muted-foreground">{activity.details}</p>}
            {activity.ipAddress && <p className="text-xs text-muted-foreground">IP: {activity.ipAddress}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

