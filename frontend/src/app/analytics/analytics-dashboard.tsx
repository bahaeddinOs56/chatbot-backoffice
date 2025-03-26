"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { SimpleDateRangePicker } from "./simple-date-range-picker"
import { ConversationMetrics } from "./conversation-metrics"
import { UserEngagement } from "./user-engagement"
import { ContentPerformance } from "./content-performance"
import { ResponseMetrics } from "./response-metrics"
import { TrendCharts } from "./trend-charts"
import { GeographicDistribution } from "./geographic-distribution"
import { CategoryDistribution } from "./category-distribution"
import { SentimentAnalysis } from "./sentiment-analysis"
import { ConversationFlowAnalysis } from "./conversation-flow-analysis"
import { ContentGapAnalysis } from "./content-gap-analysis"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  })

  const [segmentFilter, setSegmentFilter] = useState("all")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SimpleDateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
        <div className="flex gap-2">
          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="new">New Users</SelectItem>
              <SelectItem value="returning">Returning Users</SelectItem>
              <SelectItem value="active">Active Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+12.3% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">+5.7% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">-0.3s from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last period</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 pt-4">
          <TrendCharts dateRange={dateRange} />
          <div className="grid gap-6 md:grid-cols-2">
            <CategoryDistribution />
            <SentimentAnalysis />
          </div>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-6 pt-4">
          <ConversationMetrics dateRange={dateRange} />
          <ResponseMetrics dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="users" className="space-y-6 pt-4">
          <UserEngagement dateRange={dateRange} />
          <GeographicDistribution />
        </TabsContent>

        <TabsContent value="content" className="space-y-6 pt-4">
          <ContentPerformance dateRange={dateRange} />
          <ContentGapAnalysis />
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-6 pt-4">
          <SentimentAnalysis fullWidth />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6 pt-4">
          <ConversationFlowAnalysis />
          <ContentGapAnalysis fullWidth />
        </TabsContent>
      </Tabs>
    </div>
  )
}

