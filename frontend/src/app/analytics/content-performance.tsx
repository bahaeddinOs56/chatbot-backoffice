"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import type { DateRange } from "react-day-picker"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Badge } from "../components/ui/badge"

interface ContentPerformanceProps {
  dateRange: DateRange
}

export function ContentPerformance({ dateRange }: ContentPerformanceProps) {
  // In a real implementation, you would fetch data based on the date range
  // const { data, isLoading } = useFetchContentPerformanceData(dateRange)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Questions</CardTitle>
          <CardDescription>Questions with highest satisfaction ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Satisfaction</TableHead>
                <TableHead>Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">How do I reset my password?</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>98%</TableCell>
                <TableCell>1,245</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">What are your business hours?</TableCell>
                <TableCell>General</TableCell>
                <TableCell>96%</TableCell>
                <TableCell>987</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">How do I update my billing information?</TableCell>
                <TableCell>Billing</TableCell>
                <TableCell>95%</TableCell>
                <TableCell>876</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Can I change my subscription plan?</TableCell>
                <TableCell>Subscription</TableCell>
                <TableCell>94%</TableCell>
                <TableCell>765</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">How do I contact support?</TableCell>
                <TableCell>Support</TableCell>
                <TableCell>93%</TableCell>
                <TableCell>654</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Underperforming Questions</CardTitle>
          <CardDescription>Questions with lowest satisfaction ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Satisfaction</TableHead>
                <TableHead>Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">How do I cancel my account?</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>65%</TableCell>
                <TableCell>432</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Why was I charged twice?</TableCell>
                <TableCell>Billing</TableCell>
                <TableCell>68%</TableCell>
                <TableCell>321</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">How long does shipping take?</TableCell>
                <TableCell>Shipping</TableCell>
                <TableCell>72%</TableCell>
                <TableCell>298</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Can I get a refund?</TableCell>
                <TableCell>Billing</TableCell>
                <TableCell>75%</TableCell>
                <TableCell>276</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">How do I integrate with my website?</TableCell>
                <TableCell>Technical</TableCell>
                <TableCell>78%</TableCell>
                <TableCell>243</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Unanswered Questions</CardTitle>
          <CardDescription>Questions that couldn't be answered by the chatbot</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>First Seen</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Do you offer enterprise pricing?</TableCell>
                <TableCell>43</TableCell>
                <TableCell>Jan 05, 2023</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    Pending
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">How do I connect to the API?</TableCell>
                <TableCell>38</TableCell>
                <TableCell>Jan 08, 2023</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    In Progress
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">What payment methods do you accept in Europe?</TableCell>
                <TableCell>35</TableCell>
                <TableCell>Jan 10, 2023</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    Pending
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Can I use your service in Australia?</TableCell>
                <TableCell>29</TableCell>
                <TableCell>Jan 12, 2023</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    Not Started
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Do you have a mobile app?</TableCell>
                <TableCell>27</TableCell>
                <TableCell>Jan 15, 2023</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    In Progress
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

