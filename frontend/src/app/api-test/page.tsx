"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ApiTestPage() {
  const [testResult, setTestResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

  const testEndpoint = async (endpoint: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${baseUrl}${endpoint}`)
      const data = await response.json()
      setTestResult(JSON.stringify(data, null, 2))
    } catch (err: any) {
      setError(`Error: ${err.message}`)
      console.error("API test error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>API Connection Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p>
              Testing API connection to: <code>{baseUrl}</code>
            </p>
          </div>

          <div className="flex gap-4 mb-4">
            <Button onClick={() => testEndpoint("/test")} disabled={isLoading}>
              Test /api/test
            </Button>

            <Button onClick={() => testEndpoint("/ping")} disabled={isLoading} variant="outline">
              Test /api/ping
            </Button>
          </div>

          {isLoading && <p>Loading...</p>}

          {error && (
            <div className="p-4 bg-red-50 text-red-800 rounded-md mt-4">
              <h3 className="font-bold">Error</h3>
              <p>{error}</p>
            </div>
          )}

          {testResult && (
            <div className="p-4 bg-green-50 text-green-800 rounded-md mt-4">
              <h3 className="font-bold">Success</h3>
              <pre className="whitespace-pre-wrap">{testResult}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

