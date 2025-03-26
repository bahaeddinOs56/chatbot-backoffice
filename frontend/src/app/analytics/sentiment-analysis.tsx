"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"

// Placeholder data - this would come from your Python backend
const sentimentTrendData = [
  { date: "Jan 01", positive: 65, neutral: 25, negative: 10 },
  { date: "Jan 02", positive: 68, neutral: 22, negative: 10 },
  { date: "Jan 03", positive: 64, neutral: 26, negative: 10 },
  { date: "Jan 04", positive: 62, neutral: 28, negative: 10 },
  { date: "Jan 05", positive: 60, neutral: 28, negative: 12 },
  { date: "Jan 06", positive: 58, neutral: 30, negative: 12 },
  { date: "Jan 07", positive: 59, neutral: 29, negative: 12 },
  { date: "Jan 08", positive: 62, neutral: 28, negative: 10 },
  { date: "Jan 09", positive: 65, neutral: 25, negative: 10 },
  { date: "Jan 10", positive: 68, neutral: 22, negative: 10 },
  { date: "Jan 11", positive: 70, neutral: 20, negative: 10 },
  { date: "Jan 12", positive: 72, neutral: 20, negative: 8 },
  { date: "Jan 13", positive: 75, neutral: 18, negative: 7 },
  { date: "Jan 14", positive: 78, neutral: 16, negative: 6 },
]

const sentimentByCategoryData = [
  { category: "General", positive: 75, neutral: 20, negative: 5 },
  { category: "Account", positive: 68, neutral: 22, negative: 10 },
  { category: "Billing", positive: 60, neutral: 25, negative: 15 },
  { category: "Technical", positive: 55, neutral: 30, negative: 15 },
  { category: "Product", positive: 70, neutral: 20, negative: 10 },
]

interface SentimentAnalysisProps {
  fullWidth?: boolean
}

export function SentimentAnalysis({ fullWidth }: SentimentAnalysisProps) {
  return (
    <Card className={fullWidth ? "md:col-span-2" : ""}>
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
        <CardDescription>User sentiment trends over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mb-6">
          <ChartContainer
            config={{
              positive: {
                label: "Positive",
                color: "hsl(142, 76%, 36%)",
              },
              neutral: {
                label: "Neutral",
                color: "hsl(215, 20%, 65%)",
              },
              negative: {
                label: "Negative",
                color: "hsl(0, 84%, 60%)",
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentTrendData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="positive"
                  stroke="var(--color-positive)"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="neutral"
                  stroke="var(--color-neutral)"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="negative"
                  stroke="var(--color-negative)"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {fullWidth && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Sentiment by Category</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Positive</TableHead>
                  <TableHead>Neutral</TableHead>
                  <TableHead>Negative</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sentimentByCategoryData.map((item) => (
                  <TableRow key={item.category}>
                    <TableCell className="font-medium">{item.category}</TableCell>
                    <TableCell className="text-green-600">{item.positive}%</TableCell>
                    <TableCell className="text-gray-500">{item.neutral}%</TableCell>
                    <TableCell className="text-red-600">{item.negative}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

