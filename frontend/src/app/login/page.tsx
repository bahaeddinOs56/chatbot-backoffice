"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { useToast } from "../components/ui/use-toast"
import { adminLogin } from "../../lib/api"
import { MessageSquare, Lock } from "lucide-react"
import axios from "axios"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [apiStatus, setApiStatus] = useState<string | null>(null)
  const [apiUrl, setApiUrl] = useState<string>("")

  useEffect(() => {
    // Get the API URL
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
    setApiUrl(url)

    // Test API connection
    testApiConnection()
  }, [])

  // Test API connection
  const testApiConnection = async () => {
    try {
      setApiStatus("Testing API connection...")
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
      const response = await axios.get(`${baseUrl}/test`, {
        headers: {
          Accept: "application/json",
        },
      })
      setApiStatus(`API connection successful: ${JSON.stringify(response.data)}`)
      console.log("API test response:", response.data)
    } catch (error) {
      console.error("API test error:", error)
      setApiStatus(`API connection failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    setError("")

    try {
      console.log("Submitting login form:", { email: formData.email })

      // Use the direct admin login function
      const response = await adminLogin(formData.email, formData.password)

      console.log("Login response:", response.data) // Debug log

      // Store the token and user info
      if (typeof window !== "undefined") {
        // Get the token from the response
        const token = response.data.access_token

        if (!token) {
          console.error("No token found in response:", response.data)
          setError("Authentication failed: No token received")
          return
        }

        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
      }

      toast({
        title: "Login successful",
        description: "Welcome back to the Chatbot Management System.",
      })

      // Redirect to dashboard
      router.push("/")
    } catch (error: any) {
      console.error("Login error:", error)

      // Handle specific error messages from the API
      const errorMessage = error.message || "Invalid email or password. Please try again."
      setError(errorMessage)

      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold">ChatAdmin</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="h-auto p-0 text-sm" type="button">
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="text-xs text-gray-500 mt-2">
                <p>API URL: {apiUrl}</p>
                {apiStatus && <p className="mt-1">{apiStatus}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Sign in
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={testApiConnection} className="w-full">
                Test API Connection
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-center text-muted-foreground mt-2">
            <span>Don't have an account? </span>
            <Button variant="link" className="p-0 h-auto" type="button">
              Contact your administrator
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

