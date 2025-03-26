"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import type { DateRange } from "react-day-picker"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"

// Placeholder data - this would come from your Python backend
const responseTimeData = [
  { category: "General", time: 0.8 },
  { category: "Account", time: 1.2 },
  { category: "Billing", time: 1.5 },
  { category: "Technical", time: 2.1 },
  { category: "Product", time: 1.3 },
  { category: "Shipping", time: 1.1 },
  { category: "Returns", time: 1.4 },
]

const resolutionRateData = [
  { hour: "00:00", rate: 88 },
  { hour: "02:00", rate: 90 },
  { hour: "04:00", rate: 92 },
  { hour: "06:00", rate: 89 },
  { hour: "08:00", rate: 85 },
  { hour: "10:00", rate: 82 },
  { hour: "12:00", rate: 80 },
  { hour: "14:00", rate: 83 },
  { hour: "16:00", rate: 85 },
  { hour: "18:00", rate: 87 },
  { hour: "20:00", rate: 89 },
  { hour: "22:00", rate: 91 },
]

interface ResponseMetricsProps {
  dateRange: DateRange
}

export function ResponseMetrics({ dateRange }: ResponseMetricsProps) {
  // In a real implementation, you would fetch data based on the date range
  // const { data, isLoading } = useFetchResponseMetricsData(dateRange)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Response Time by Category</CardTitle>
          <CardDescription>Average response time in seconds by question category</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              time: {
                label: "Response Time (s)",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                <XAxis type="number" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis dataKey="category" type="category" tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="time" fill="var(--color-time)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resolution Rate by Hour</CardTitle>
          <CardDescription>Percentage of queries successfully resolved</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              rate: {
                label: "Resolution Rate (%)",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolutionRateData} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} domain={[75, 95]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="var(--color-rate)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

