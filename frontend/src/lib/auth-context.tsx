"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { authApi, type User } from "./api"
import { toast } from "../app/components/ui/use-toast"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void> // Added refreshUser function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check for login page
      if (pathname === "/login") {
        setIsLoading(false)
        return
      }

      try {
        // Check if we have a token
        const token = localStorage.getItem("token")
        if (!token) {
          // Handle the no token case gracefully - just set as not authenticated
          setIsAuthenticated(false)
          setUser(null)
          setIsLoading(false)

          // Redirect to login if not already there
          if (pathname !== "/login") {
            router.push("/login")
          }
          return
        }

        // Verify token is valid
        const response = await authApi.checkAuth()
        setUser(response.data.user)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Auth check failed:", error)
        // Clear any invalid tokens
        localStorage.removeItem("token")
        setIsAuthenticated(false)
        setUser(null)

        // Only redirect if not already on login page
        if (pathname !== "/login") {
          router.push("/login")
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  // Add refreshUser function to fetch the latest user data
  const refreshUser = async () => {
    try {
      setIsLoading(true)
      const response = await authApi.getUser()
      setUser(response.data.user)
      return response.data.user
    } catch (error) {
      console.error("Failed to refresh user data:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await authApi.login(email, password)

      // Store the token
      const { access_token, user } = response.data
      localStorage.setItem("token", access_token)

      // Update state
      setUser(user)
      setIsAuthenticated(true)

      // Show success message
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)

      // Show error message
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      })

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)

      // Call logout API if authenticated
      if (isAuthenticated) {
        await authApi.logout()
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Always clear local state regardless of API success
      localStorage.removeItem("token")
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)

      // Redirect to login
      router.push("/login")

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        refreshUser, // Added to the context value
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

