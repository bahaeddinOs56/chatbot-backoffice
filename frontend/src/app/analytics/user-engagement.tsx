"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import type { DateRange } from "react-day-picker"
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"

// Placeholder data - this would come from your Python backend
const userGrowthData = [
  { date: "Jan 01", total: 1200, new: 80, returning: 1120 },
  { date: "Jan 02", total: 1250, new: 70, returning: 1180 },
  { date: "Jan 03", total: 1280, new: 60, returning: 1220 },
  { date: "Jan 04", total: 1320, new: 75, returning: 1245 },
  { date: "Jan 05", total: 1380, new: 85, returning: 1295 },
  { date: "Jan 06", total: 1410, new: 65, returning: 1345 },
  { date: "Jan 07", total: 1460, new: 90, returning: 1370 },
  { date: "Jan 08", total: 1500, new: 75, returning: 1425 },
  { date: "Jan 09", total: 1530, new: 60, returning: 1470 },
  { date: "Jan 10", total: 1580, new: 85, returning: 1495 },
  { date: "Jan 11", total: 1620, new: 70, returning: 1550 },
  { date: "Jan 12", total: 1670, new: 90, returning: 1580 },
  { date: "Jan 13", total: 1710, new: 75, returning: 1635 },
  { date: "Jan 14", total: 1760, new: 85, returning: 1675 },
]

const retentionData = [
  { week: "Week 1", retention: 100 },
  { week: "Week 2", retention: 65 },
  { week: "Week 3", retention: 48 },
  { week: "Week 4", retention: 38 },
  { week: "Week 5", retention: 32 },
  { week: "Week 6", retention: 28 },
  { week: "Week 7", retention: 25 },
  { week: "Week 8", retention: 22 },
]

interface UserEngagementProps {
  dateRange: DateRange
}

export function UserEngagement({ dateRange }: UserEngagementProps) {
  // In a real implementation, you would fetch data based on the date range
  // const { data, isLoading } = useFetchUserEngagementData(dateRange)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>New and returning users over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              new: {
                label: "New Users",
                color: "hsl(var(--chart-1))",
              },
              returning: {
                label: "Returning Users",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="new"
                  stackId="1"
                  stroke="var(--color-new)"
                  fill="var(--color-new)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="returning"
                  stackId="1"
                  stroke="var(--color-returning)"
                  fill="var(--color-returning)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Retention</CardTitle>
          <CardDescription>Percentage of users retained over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              retention: {
                label: "Retention Rate (%)",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={retentionData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="retention" fill="var(--color-retention)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

