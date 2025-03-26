"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"

export function ConversationFlowAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversation Flow Analysis</CardTitle>
        <CardDescription>Common conversation paths and bottlenecks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          This visualization will show common conversation paths and identify bottlenecks. Connect your Python backend
          to implement advanced conversation flow analysis.
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Conversation Path</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Completion Rate</TableHead>
              <TableHead>Avg. Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Greeting → Question → Answer → Thanks</TableCell>
              <TableCell>42%</TableCell>
              <TableCell>85%</TableCell>
              <TableCell>1m 20s</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Greeting → Question → Clarification → Answer</TableCell>
              <TableCell>28%</TableCell>
              <TableCell>72%</TableCell>
              <TableCell>2m 45s</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Direct Question → Answer → Follow-up</TableCell>
              <TableCell>15%</TableCell>
              <TableCell>68%</TableCell>
              <TableCell>1m 50s</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Question → Clarification → Abandonment</TableCell>
              <TableCell>8%</TableCell>
              <TableCell>0%</TableCell>
              <TableCell>45s</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Greeting → Multiple Questions</TableCell>
              <TableCell>7%</TableCell>
              <TableCell>62%</TableCell>
              <TableCell>3m 30s</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

