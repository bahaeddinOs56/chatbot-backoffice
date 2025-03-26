"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function FetchTest() {
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

  const testFetch = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // Use the native fetch API instead of axios
      const response = await fetch(`${baseUrl}/test`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (err: any) {
      setError(`Error: ${err.message}`)
      console.error("Fetch test error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-4 p-4 border rounded-md">
      <h2 className="text-lg font-bold mb-2">API Connection Test (Native Fetch)</h2>
      <Button onClick={testFetch} disabled={isLoading}>
        {isLoading ? "Testing..." : "Test API Connection"}
      </Button>

      {error && <div className="mt-2 p-2 bg-red-50 text-red-800 rounded">{error}</div>}

      {result && (
        <div className="mt-2 p-2 bg-green-50 text-green-800 rounded">
          <pre>{result}</pre>
        </div>
      )}
    </div>
  )
}

