"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import axios from "axios"

export function ApiTestButton() {
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testApi = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
      const response = await axios.get(`${baseUrl}/test`, {
        headers: {
          Accept: "application/json",
        },
      })

      setResult(`Success: ${JSON.stringify(response.data)}`)
    } catch (error: any) {
      console.error("API test error:", error)
      setResult(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={testApi} disabled={isLoading} variant="outline" size="sm">
        {isLoading ? "Testing..." : "Test API"}
      </Button>

      {result && (
        <div
          className={`text-xs p-2 rounded ${result.startsWith("Success") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
        >
          {result}
        </div>
      )}
    </div>
  )
}

