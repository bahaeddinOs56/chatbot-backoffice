"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

// Placeholder data - this would come from your Python backend
const categoryData = [
  { name: "General", value: 25, color: "#3b82f6" },
  { name: "Account", value: 20, color: "#10b981" },
  { name: "Billing", value: 18, color: "#f59e0b" },
  { name: "Technical", value: 15, color: "#ef4444" },
  { name: "Product", value: 12, color: "#8b5cf6" },
  { name: "Shipping", value: 6, color: "#ec4899" },
  { name: "Returns", value: 4, color: "#6366f1" },
]

interface CategoryDistributionProps {
  fullWidth?: boolean
}

export function CategoryDistribution({ fullWidth }: CategoryDistributionProps) {
  return (
    <Card className={fullWidth ? "md:col-span-2" : ""}>
      <CardHeader>
        <CardTitle>Question Categories</CardTitle>
        <CardDescription>Distribution of questions by category</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value}%`, "Percentage"]}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

