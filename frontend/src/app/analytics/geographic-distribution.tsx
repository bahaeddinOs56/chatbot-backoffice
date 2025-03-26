"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"

// Placeholder data - this would come from your Python backend
const geoData = [
  { country: "United States", users: 580 },
  { country: "United Kingdom", users: 320 },
  { country: "Canada", users: 280 },
  { country: "Australia", users: 190 },
  { country: "Germany", users: 150 },
  { country: "France", users: 120 },
  { country: "India", users: 110 },
  { country: "Brazil", users: 90 },
  { country: "Japan", users: 80 },
  { country: "Spain", users: 70 },
]

export function GeographicDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Distribution</CardTitle>
        <CardDescription>User distribution by country</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mb-6">
          <ChartContainer
            config={{
              users: {
                label: "Users",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geoData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                <XAxis type="number" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis dataKey="country" type="category" tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="users" fill="var(--color-users)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

