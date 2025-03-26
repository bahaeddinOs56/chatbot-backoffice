"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { Badge } from "./ui/badge"
import { ScrollArea } from "./ui/scroll-area"
import { QAPreview } from "./qa-preview"
import { QADialog } from "./qa-dialog"
import { useToast } from "./ui/use-toast"
import { qaApi, categoryApi } from "../../lib/api"
import type { QAPair, Category } from "../../types/qa"
import { Search, Plus, RefreshCw } from "lucide-react"
// Add these imports at the top
import { QABulkActions } from "./qa-bulk-actions"
import { Checkbox } from "./ui/checkbox"

export function QAManager() {
  const [qaPairs, setQaPairs] = useState<QAPair[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentQA, setCurrentQA] = useState<QAPair | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  // Add these state variables after the other useState declarations
  const [selectedQAPairs, setSelectedQAPairs] = useState<QAPair[]>([])
  const [selectionMode, setSelectionMode] = useState(false)

  // Fetch QA pairs and categories
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [qaPairsResponse, categoriesResponse] = await Promise.all([qaApi.getAll(), categoryApi.getAll()])
      // Check if the response has a data property that contains the array
      if (qaPairsResponse.data && Array.isArray(qaPairsResponse.data)) {
        setQaPairs(qaPairsResponse.data)
      } else if (Array.isArray(qaPairsResponse)) {
        // If the response itself is the array
        setQaPairs(qaPairsResponse)
      } else if (qaPairsResponse.data && qaPairsResponse.data.data && Array.isArray(qaPairsResponse.data.data)) {
        // If the data is nested (common in Laravel responses with pagination)
        setQaPairs(qaPairsResponse.data.data)
      } else {
        // Fallback to empty array if structure is unexpected
        console.error("Unexpected API response structure:", qaPairsResponse)
        setQaPairs([])
      }

      if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
        setCategories(categoriesResponse.data)
      } else if (Array.isArray(categoriesResponse)) {
        setCategories(categoriesResponse)
      } else if (
        categoriesResponse.data &&
        categoriesResponse.data.data &&
        Array.isArray(categoriesResponse.data.data)
      ) {
        setCategories(categoriesResponse.data.data)
      } else {
        console.error("Unexpected API response structure:", categoriesResponse)
        setCategories([])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load QA pairs and categories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Refresh data
  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      await fetchData()
      toast({
        title: "Refreshed",
        description: "QA pairs and categories have been refreshed.",
      })
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Filter QA pairs based on search query and selected category
  const filteredQAPairs = Array.isArray(qaPairs)
    ? qaPairs.filter((qa) => {
        const matchesSearch =
          qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          qa.answer.toLowerCase().includes(searchQuery.toLowerCase())

        let matchesCategory = true

        // Determine if the QA pair is enabled based on either property
        const isEnabled = qa.enabled === true || qa.is_active === true

        if (selectedCategory === "enabled") {
          // Only show enabled QA pairs
          matchesCategory = isEnabled
        } else if (selectedCategory === "disabled") {
          // Only show disabled QA pairs (neither property is true)
          matchesCategory = !isEnabled
        } else if (selectedCategory !== "all") {
          // Filter by specific category
          matchesCategory = qa.category_id.toString() === selectedCategory
        }

        return matchesSearch && matchesCategory
      })
    : []

  // Handle QA pair creation
  const handleCreateQA = () => {
    setCurrentQA(null)
    setIsDialogOpen(true)
  }

  // Handle QA pair editing
  const handleEditQA = (qa: QAPair) => {
    setCurrentQA(qa)
    setIsDialogOpen(true)
  }

  // Handle QA pair saving
  const handleSaveQA = async (qa: QAPair) => {
    try {
      if (qa.id) {
        // Update existing QA pair
        await qaApi.update(qa.id.toString(), qa)
        setQaPairs((prev) => prev.map((item) => (item.id === qa.id ? qa : item)))
        toast({
          title: "Updated",
          description: "QA pair has been updated successfully.",
        })
      } else {
        // Create new QA pair
        const response = await qaApi.create(qa)
        setQaPairs((prev) => [...prev, response.data])
        toast({
          title: "Created",
          description: "New QA pair has been created successfully.",
        })
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving QA pair:", error)
      toast({
        title: "Error",
        description: "Failed to save QA pair. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle QA pair deletion
  const handleDeleteQA = async (id: string) => {
    try {
      await qaApi.delete(id)
      setQaPairs((prev) => prev.filter((qa) => qa.id.toString() !== id))
      toast({
        title: "Deleted",
        description: "QA pair has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting QA pair:", error)
      toast({
        title: "Error",
        description: "Failed to delete QA pair. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle QA pair toggle (enable/disable)
  const handleToggleQA = async (id: string, enabled: boolean) => {
    try {
      await qaApi.toggleEnabled(id, enabled)
      setQaPairs((prev) => prev.map((qa) => (qa.id.toString() === id ? { ...qa, enabled } : qa)))
      toast({
        title: enabled ? "Enabled" : "Disabled",
        description: `QA pair has been ${enabled ? "enabled" : "disabled"} successfully.`,
      })
    } catch (error) {
      console.error("Error toggling QA pair:", error)
      toast({
        title: "Error",
        description: `Failed to ${enabled ? "enable" : "disable"} QA pair. Please try again.`,
        variant: "destructive",
      })
    }
  }

  // Toggle selection mode
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode)
    setSelectedQAPairs([])
  }

  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedQAPairs(filteredQAPairs)
    } else {
      setSelectedQAPairs([])
    }
  }

  // Handle individual selection
  const handleSelectQA = (qa: QAPair, selected: boolean) => {
    if (selected) {
      setSelectedQAPairs((prev) => [...prev, qa])
    } else {
      setSelectedQAPairs((prev) => prev.filter((item) => item.id !== qa.id))
    }
  }

  // Check if a QA pair is selected
  const isQASelected = (qa: QAPair) => {
    return selectedQAPairs.some((item) => item.id === qa.id)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>QA Pairs</CardTitle>
            <CardDescription>Manage question and answer pairs for your chatbot</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={toggleSelectionMode}>
              {selectionMode ? "Cancel Selection" : "Select Multiple"}
            </Button>
            <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing}>
              {isRefreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
            <Button size="sm" onClick={handleCreateQA}>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search questions or answers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs
            defaultValue="all"
            className="w-full sm:w-[200px]"
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger>
              <TabsTrigger value="enabled" className="flex-1">
                Enabled
              </TabsTrigger>
              <TabsTrigger value="disabled" className="flex-1">
                Disabled
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      {selectionMode && selectedQAPairs.length > 0 && (
        <div className="px-4 py-2">
          <QABulkActions
            selectedQAPairs={selectedQAPairs}
            onClearSelection={() => setSelectedQAPairs([])}
            onBulkActionComplete={fetchData}
          />
        </div>
      )}
      <CardContent>
        {selectionMode && (
          <div className="mb-4 flex items-center gap-2">
            <Checkbox
              checked={selectedQAPairs.length === filteredQAPairs.length && filteredQAPairs.length > 0}
              onCheckedChange={handleSelectAll}
              aria-label="Select all QA pairs"
            />
            <span className="text-sm font-medium">Select All ({filteredQAPairs.length})</span>
          </div>
        )}
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className={selectedCategory === "all" ? "bg-primary text-primary-foreground" : ""}
            onClick={() => setSelectedCategory("all")}
          >
            All Categories
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant="outline"
              className={selectedCategory === category.id.toString() ? "bg-primary text-primary-foreground" : ""}
              onClick={() => setSelectedCategory(category.id.toString())}
            >
              {category.name}
            </Badge>
          ))}
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : filteredQAPairs.length > 0 ? (
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {filteredQAPairs.map((qa) => (
                <QAPreview
                  key={qa.id}
                  qa={qa}
                  category={categories.find((c) => c.id === qa.category_id)?.name || "Uncategorized"}
                  onEdit={() => handleEditQA(qa)}
                  onDelete={() => handleDeleteQA(qa.id.toString())}
                  onToggle={(enabled) => handleToggleQA(qa.id.toString(), enabled)}
                  isSelected={isQASelected(qa)}
                  onSelect={(selected) => handleSelectQA(qa, selected)}
                  selectionMode={selectionMode}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground mb-4">No QA pairs found matching your criteria.</p>
            <Button variant="outline" onClick={handleCreateQA}>
              <Plus className="mr-2 h-4 w-4" />
              Add your first QA pair
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredQAPairs.length} of {qaPairs.length} QA pairs
        </div>
      </CardFooter>
      <QADialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        qa={currentQA}
        categories={categories}
        onSave={handleSaveQA}
      />
    </Card>
  )
}

