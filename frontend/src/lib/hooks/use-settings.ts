"use client"

import { useState, useEffect, useCallback } from "react"
import { settingsApi } from "../api"
import type { AppearanceSettings } from "../../types/qa"
import { useToast } from "../../app/components/ui/use-toast"

export function useSettings() {
  const [settings, setSettings] = useState<AppearanceSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch settings from the backend
  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const response = await settingsApi.getAppearance()
      setSettings(response.data)
      setError(null)
    } catch (error: any) {
      console.error("Error fetching settings:", error)
      setError("Failed to load settings. Please try again.")

      toast({
        title: "Error loading settings",
        description: error.response?.data?.message || "Failed to load appearance settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Update settings in the backend
  const updateSettings = async (newSettings: Partial<AppearanceSettings>) => {
    setLoading(true)
    try {
      const response = await settingsApi.updateAppearance(newSettings)
      setSettings(response.data)
      setError(null)

      toast({
        title: "Settings updated",
        description: "Appearance settings have been updated successfully.",
      })

      return response.data // Return the updated settings
    } catch (error: any) {
      console.error("Error updating settings:", error)

      toast({
        title: "Error updating settings",
        description: error.response?.data?.message || "Failed to update appearance settings. Please try again.",
        variant: "destructive",
      })

      throw error // Rethrow the error to handle it in the form
    } finally {
      setLoading(false)
    }
  }

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return {
    settings,
    loading,
    error,
    updateSettings,
    refreshSettings: fetchSettings,
  }
}

