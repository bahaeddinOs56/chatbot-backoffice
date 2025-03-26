"use client"

import { useState, useEffect } from "react"
import { categoryApi } from "../../lib/api"
import { useToast } from "../components/ui/use-toast"
import { CategoryManager } from "../components/category-manager"
import { DashboardLayout } from "../components/dashboard-layout"
import type { Category } from "../../types/qa"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const response = await categoryApi.getAll()

        // Handle different response structures
        if (response.data && Array.isArray(response.data)) {
          setCategories(response.data)
        } else if (Array.isArray(response)) {
          setCategories(response)
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data)
        } else {
          console.error("Unexpected API response structure:", response)
          setCategories([])
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [toast])

  return (
    <DashboardLayout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Categories</h1>
        <CategoryManager categories={categories} isLoading={isLoading} onCategoriesChange={setCategories} />
      </div>
    </DashboardLayout>
  )
}

