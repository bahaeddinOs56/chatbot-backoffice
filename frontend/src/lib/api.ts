import axios, { type AxiosError, type AxiosResponse } from "axios"
import { toast } from "../app/components/ui/use-toast"

// Define types for better TypeScript support
export interface QAPair {
  id: string
  question: string
  answer: string
  category_id: number
  enabled: boolean
  company_id?: number | null
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: string
  name: string
  description: string | null
  company_id?: number | null
  created_at?: string
  updated_at?: string
}

export interface Company {
  id: number
  name: string
  slug: string
  domain: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  name: string
  email: string
  is_admin: boolean
  is_super_admin: boolean
  company_id: number | null
}

export interface AppearanceSettings {
  id?: string
  primary_color: string
  logo_url: string | null
  dark_mode: boolean
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left"
}

// Create an axios instance with the Laravel API base URL
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
console.log("API baseURL:", baseURL)

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Temporarily disable withCredentials to test if that's causing issues
  // withCredentials: true,
})

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url)

    // Only add token for browser environment
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        console.log("Adding token to request:", token.substring(0, 10) + "...")
        config.headers.Authorization = `Bearer ${token}`
      }

      // Add company header if there's a selected company
      const selectedCompanyId = localStorage.getItem("selectedCompanyId")
      if (selectedCompanyId) {
        config.headers["X-Company-ID"] = selectedCompanyId
      }
    }
    return config
  },
  (error) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  },
)

// Add a response interceptor for global error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("API Response:", response.config.url, response.status)
    return response
  },
  (error: AxiosError) => {
    console.error("API Error:", error.message)
    console.error("Request URL:", error.config?.url)
    console.error("Response status:", error.response?.status)
    console.error("Response data:", error.response?.data)

    if (error.code === "ERR_NETWORK") {
      console.error("Network error details:", error)
      toast({
        title: "Network Error",
        description: "Cannot connect to the API server. Please check your network connection and server status.",
        variant: "destructive",
      })
    }
    // Handle authentication errors
    else if (error.response?.status === 401) {
      // Clear token if it's invalid or expired
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        // Redirect to login page if not already there
        if (window.location.pathname !== "/login") {
          window.location.href = "/login"
        }
      }

      toast({
        title: "Authentication Error",
        description: "Your session has expired. Please log in again.",
        variant: "destructive",
      })
    }
    // Handle server errors
    else if (error.response?.status === 500) {
      toast({
        title: "Server Error",
        description: "Something went wrong on the server. Please try again later.",
        variant: "destructive",
      })
    }

    return Promise.reject(error)
  },
)

// Direct login function with more detailed error logging
export const adminLogin = async (email: string, password: string) => {
  try {
    console.log("Attempting admin login with:", { email })

    // Use the full URL to ensure it hits the right endpoint
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
    const loginUrl = `${baseUrl}/admin/login`

    console.log("Admin login URL:", loginUrl)

    // Create a simple test request to check connectivity
    try {
      const testResponse = await fetch(`${baseUrl}/test`)
      console.log("Test API connection result:", testResponse.ok ? "Success" : "Failed")
    } catch (testError) {
      console.error("Test API connection error:", testError)
    }

    const response = await axios.post(
      loginUrl,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    )

    console.log("Admin login response:", response.status, response.data)
    return response
  } catch (error: any) {
    console.error("Admin login error:", error)
    console.error("Error type:", error.constructor.name)
    console.error("Error message:", error.message)

    if (error.code === "ERR_NETWORK") {
      console.error("Network error - cannot connect to API server")
      error.message = "Cannot connect to the API server. Please check your network connection and server status."
    }
    // Handle validation errors from Laravel
    else if (error.response?.data?.errors) {
      const errorMessages = Object.values(error.response.data.errors).flat().join(", ")
      error.message = errorMessages
    } else if (error.response?.data?.message) {
      error.message = error.response.data.message
    }

    throw error
  }
}

// Auth functions - UPDATED to match your Laravel routes
export const authApi = {
  // Use the admin login endpoint specifically
  login: (email: string, password: string) => {
    console.log("Attempting admin login with:", { email })
    return api.post("/admin/login", { email, password })
  },
  logout: () => api.post("/logout"),
  getUser: () => api.get("/user"),
  checkAuth: () => api.get("/check-auth"),
}

// Export other API functions
export const qaApi = {
  getAll: () => api.get("/admin/qa-pairs"),
  getById: (id: string) => api.get(`/admin/qa-pairs/${id}`),
  create: (data: any) => api.post("/admin/qa-pairs", data),
  update: (id: string, data: any) => api.put(`/admin/qa-pairs/${id}`, data),
  delete: (id: string) => api.delete(`/admin/qa-pairs/${id}`),
  toggleEnabled: (id: string, enabled: boolean) => api.patch(`/admin/qa-pairs/${id}/toggle`, { enabled }),
  bulkImport: (data: any[]) => api.post("/admin/qa-pairs/bulk-import", { qa_pairs: data }),
  bulkDelete: (ids: string[]) => api.post("/admin/qa-pairs/bulk-delete", { ids }),
  bulkToggle: (ids: string[], enabled: boolean) => api.post("/admin/qa-pairs/bulk-toggle", { ids, enabled }),
  export: () => api.get("/admin/qa-pairs/export", { responseType: "blob" }),
}

// API functions for categories
export const categoryApi = {
  getAll: () => api.get("/admin/categories"),
  getById: (id: string) => api.get(`/admin/categories/${id}`),
  create: (data: any) => api.post("/admin/categories", data),
  update: (id: string, data: any) => api.put(`/admin/categories/${id}`, data),
  delete: (id: string) => api.delete(`/admin/categories/${id}`),
}

// API functions for settings
export const settingsApi = {
  getAppearance: () => api.get("/admin/appearance"),
  updateAppearance: (data: any) => api.put("/admin/appearance", data),
}

// API functions for profile management
export const profileApi = {
  update: (data: { name: string; email: string }) => api.put("/profile", data),
  updatePassword: (data: { current_password: string; new_password: string; new_password_confirmation: string }) =>
    api.put("/profile/password", data),
}

// Company management API functions
export const companyApi = {
  getAll: () => api.get("/admin/companies"),
  getById: (id: number) => api.get(`/admin/companies/${id}`),
  create: (data: Partial<Company>) => api.post("/admin/companies", data),
  update: (id: number, data: Partial<Company>) => api.put(`/admin/companies/${id}`, data),
  delete: (id: number) => api.delete(`/admin/companies/${id}`),
  toggle: (id: number, isActive: boolean) => api.put(`/admin/companies/${id}/toggle`, { is_active: isActive }),
}

export default api

