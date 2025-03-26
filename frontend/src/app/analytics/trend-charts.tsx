"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import type { DateRange } from "react-day-picker"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"

// Placeholder data - this would come from your Python backend
const data = [
  { date: "Jan 01", conversations: 120, users: 80, responseTime: 1.2, resolutionRate: 85 },
  { date: "Jan 02", conversations: 132, users: 90, responseTime: 1.1, resolutionRate: 86 },
  { date: "Jan 03", conversations: 101, users: 75, responseTime: 1.3, resolutionRate: 84 },
  { date: "Jan 04", conversations: 134, users: 85, responseTime: 1.2, resolutionRate: 87 },
  { date: "Jan 05", conversations: 158, users: 95, responseTime: 1.0, resolutionRate: 89 },
  { date: "Jan 06", conversations: 160, users: 100, responseTime: 1.1, resolutionRate: 88 },
  { date: "Jan 07", conversations: 170, users: 110, responseTime: 1.0, resolutionRate: 90 },
  { date: "Jan 08", conversations: 145, users: 95, responseTime: 1.2, resolutionRate: 87 },
  { date: "Jan 09", conversations: 150, users: 100, responseTime: 1.3, resolutionRate: 86 },
  { date: "Jan 10", conversations: 180, users: 120, responseTime: 1.1, resolutionRate: 88 },
  { date: "Jan 11", conversations: 185, users: 125, responseTime: 1.0, resolutionRate: 89 },
  { date: "Jan 12", conversations: 190, users: 130, responseTime: 0.9, resolutionRate: 91 },
  { date: "Jan 13", conversations: 188, users: 135, responseTime: 0.9, resolutionRate: 90 },
  { date: "Jan 14", conversations: 200, users: 140, responseTime: 0.8, resolutionRate: 92 },
]

interface TrendChartsProps {
  dateRange: DateRange
}

export function TrendCharts({ dateRange }: TrendChartsProps) {
  // In a real implementation, you would fetch data based on the date range
  // const { data, isLoading } = useFetchTrendData(dateRange)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Conversation & User Trends</CardTitle>
          <CardDescription>Daily conversation and user counts over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              conversations: {
                label: "Conversations",
                color: "hsl(var(--chart-1))",
              },
              users: {
                label: "Users",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="conversations"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  stroke="var(--color-conversations)"
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  stroke="var(--color-users)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Response time and resolution rate over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              responseTime: {
                label: "Avg. Response Time (s)",
                color: "hsl(var(--chart-3))",
              },
              resolutionRate: {
                label: "Resolution Rate (%)",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} yAxisId="left" />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} orientation="right" yAxisId="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="responseTime"
                  strokeWidth={2}
                  yAxisId="left"
                  activeDot={{ r: 6 }}
                  stroke="var(--color-responseTime)"
                />
                <Line
                  type="monotone"
                  dataKey="resolutionRate"
                  strokeWidth={2}
                  yAxisId="right"
                  activeDot={{ r: 6 }}
                  stroke="var(--color-resolutionRate)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

