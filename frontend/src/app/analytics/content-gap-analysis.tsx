"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Badge } from "../components/ui/badge"

interface ContentGapAnalysisProps {
  fullWidth?: boolean
}

export function ContentGapAnalysis({ fullWidth }: ContentGapAnalysisProps) {
  return (
    <Card className={fullWidth ? "md:col-span-2" : ""}>
      <CardHeader>
        <CardTitle>Content Gap Analysis</CardTitle>
        <CardDescription>Identified missing content based on user queries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          This analysis identifies potential content gaps based on unanswered questions and user feedback. Connect your
          Python backend to implement advanced content gap analysis with NLP.
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Topic Cluster</TableHead>
              <TableHead>Related Keywords</TableHead>
              <TableHead>Query Count</TableHead>
              <TableHead>Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">API Documentation</TableCell>
              <TableCell>api, integration, connect, webhook, developer</TableCell>
              <TableCell>87</TableCell>
              <TableCell>
                <Badge className="bg-red-100 text-red-800">High</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">International Shipping</TableCell>
              <TableCell>international, shipping, overseas, customs, import</TableCell>
              <TableCell>65</TableCell>
              <TableCell>
                <Badge className="bg-red-100 text-red-800">High</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Mobile App Features</TableCell>
              <TableCell>mobile, app, ios, android, download</TableCell>
              <TableCell>58</TableCell>
              <TableCell>
                <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Enterprise Solutions</TableCell>
              <TableCell>enterprise, corporate, bulk, volume, discount</TableCell>
              <TableCell>42</TableCell>
              <TableCell>
                <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Payment Methods</TableCell>
              <TableCell>payment, paypal, crypto, invoice, wire transfer</TableCell>
              <TableCell>36</TableCell>
              <TableCell>
                <Badge className="bg-green-100 text-green-800">Low</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

