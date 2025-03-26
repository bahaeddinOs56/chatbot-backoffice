"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import api, { type Company } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/app/components/ui/use-toast"

interface CompanyContextType {
  companies: Company[]
  selectedCompany: Company | null
  setSelectedCompany: (company: Company | null) => void
  isLoading: boolean
  error: string | null
  fetchCompanies: () => Promise<void>
  isSuperAdmin: boolean
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { user, isAuthenticated } = useAuth()

  const isSuperAdmin = user?.is_super_admin || false

  const fetchCompanies = async () => {
    if (!isAuthenticated || !isSuperAdmin) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await api.get("/admin/companies")
      setCompanies(response.data.data)

      // If there's a stored company preference, use it
      const storedCompanyId = localStorage.getItem("selectedCompanyId")
      if (storedCompanyId) {
        const company = response.data.data.find((c: Company) => c.id === Number.parseInt(storedCompanyId))
        if (company) {
          setSelectedCompany(company)
        } else if (response.data.data.length > 0) {
          setSelectedCompany(response.data.data[0])
        }
      } else if (response.data.data.length > 0) {
        setSelectedCompany(response.data.data[0])
      }
    } catch (err: any) {
      console.error("Error fetching companies:", err)
      setError("Failed to load companies")
      toast({
        title: "Error",
        description: "Failed to load companies. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && isSuperAdmin) {
      fetchCompanies()
    }
  }, [isAuthenticated, isSuperAdmin])

  // Store selected company in localStorage when it changes
  useEffect(() => {
    if (selectedCompany) {
      localStorage.setItem("selectedCompanyId", selectedCompany.id.toString())
    }
  }, [selectedCompany])

  const value = {
    companies,
    selectedCompany,
    setSelectedCompany,
    isLoading,
    error,
    fetchCompanies,
    isSuperAdmin,
  }

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
}

export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider")
  }
  return context
}

