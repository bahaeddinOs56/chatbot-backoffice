"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import type { DateRange } from "react-day-picker"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"

// Placeholder data - this would come from your Python backend
const hourlyData = [
  { hour: "00:00", count: 12 },
  { hour: "01:00", count: 8 },
  { hour: "02:00", count: 5 },
  { hour: "03:00", count: 3 },
  { hour: "04:00", count: 2 },
  { hour: "05:00", count: 4 },
  { hour: "06:00", count: 7 },
  { hour: "07:00", count: 15 },
  { hour: "08:00", count: 25 },
  { hour: "09:00", count: 38 },
  { hour: "10:00", count: 45 },
  { hour: "11:00", count: 48 },
  { hour: "12:00", count: 52 },
  { hour: "13:00", count: 47 },
  { hour: "14:00", count: 43 },
  { hour: "15:00", count: 41 },
  { hour: "16:00", count: 35 },
  { hour: "17:00", count: 30 },
  { hour: "18:00", count: 28 },
  { hour: "19:00", count: 32 },
  { hour: "20:00", count: 36 },
  { hour: "21:00", count: 29 },
  { hour: "22:00", count: 21 },
  { hour: "23:00", count: 15 },
]

const conversationLengthData = [
  { length: "1-2 msgs", count: 320 },
  { length: "3-5 msgs", count: 480 },
  { length: "6-10 msgs", count: 280 },
  { length: "11-15 msgs", count: 120 },
  { length: "16+ msgs", count: 48 },
]

interface ConversationMetricsProps {
  dateRange: DateRange
}

export function ConversationMetrics({ dateRange }: ConversationMetricsProps) {
  // In a real implementation, you would fetch data based on the date range
  // const { data, isLoading } = useFetchConversationMetrics(dateRange)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Conversations by Hour</CardTitle>
          <CardDescription>Distribution of conversations throughout the day</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              count: {
                label: "Conversations",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversation Length Distribution</CardTitle>
          <CardDescription>Number of messages per conversation</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              count: {
                label: "Conversations",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversationLengthData} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
                <XAxis dataKey="length" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Conversation Completion Metrics</CardTitle>
          <CardDescription>Completion and abandonment rates by conversation stage</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Conversation Stage</TableHead>
                <TableHead>Completion Rate</TableHead>
                <TableHead>Abandonment Rate</TableHead>
                <TableHead>Avg. Time Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Initial Greeting</TableCell>
                <TableCell>98.2%</TableCell>
                <TableCell>1.8%</TableCell>
                <TableCell>15s</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Question Identification</TableCell>
                <TableCell>92.5%</TableCell>
                <TableCell>7.5%</TableCell>
                <TableCell>45s</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Answer Delivery</TableCell>
                <TableCell>87.3%</TableCell>
                <TableCell>12.7%</TableCell>
                <TableCell>1m 20s</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Follow-up Questions</TableCell>
                <TableCell>65.8%</TableCell>
                <TableCell>34.2%</TableCell>
                <TableCell>2m 10s</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Resolution Confirmation</TableCell>
                <TableCell>58.4%</TableCell>
                <TableCell>41.6%</TableCell>
                <TableCell>30s</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

