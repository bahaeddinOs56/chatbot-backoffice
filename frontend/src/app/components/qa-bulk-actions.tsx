"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { qaApi } from "../../lib/api"
import { useToast } from "./ui/use-toast"
import { Loader2, Upload, Download, CheckCircle, XCircle, Trash } from "lucide-react"
import type { QAPair } from "../../types/qa"

interface QABulkActionsProps {
  selectedQAPairs: QAPair[]
  onClearSelection: () => void
  onBulkActionComplete: () => void
}

export function QABulkActions({ selectedQAPairs, onClearSelection, onBulkActionComplete }: QABulkActionsProps) {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  // Handle bulk enable/disable
  const handleBulkToggle = async (enabled: boolean) => {
    setIsProcessing(true)
    try {
      const ids = selectedQAPairs.map((qa) => qa.id.toString())
      await Promise.all(ids.map((id) => qaApi.toggleEnabled(id, enabled)))

      toast({
        title: `${enabled ? "Enabled" : "Disabled"} ${ids.length} QA pairs`,
        description: `Successfully ${enabled ? "enabled" : "disabled"} the selected QA pairs.`,
      })
      onBulkActionComplete()
      onClearSelection()
    } catch (error) {
      console.error(`Error ${enabled ? "enabling" : "disabling"} QA pairs:`, error)
      toast({
        title: "Error",
        description: `Failed to ${enabled ? "enable" : "disable"} the selected QA pairs. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    setIsProcessing(true)
    try {
      const ids = selectedQAPairs.map((qa) => qa.id.toString())
      await Promise.all(ids.map((id) => qaApi.delete(id)))

      toast({
        title: `Deleted ${ids.length} QA pairs`,
        description: "Successfully deleted the selected QA pairs.",
      })
      setIsDeleteDialogOpen(false)
      onBulkActionComplete()
      onClearSelection()
    } catch (error) {
      console.error("Error deleting QA pairs:", error)
      toast({
        title: "Error",
        description: "Failed to delete the selected QA pairs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle export
  const handleExport = async () => {
    setIsProcessing(true)
    try {
      const response = await qaApi.export()

      // Create a download link for the exported file
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `qa-pairs-export-${new Date().toISOString().slice(0, 10)}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      toast({
        title: "Export successful",
        description: "QA pairs have been exported successfully.",
      })
    } catch (error) {
      console.error("Error exporting QA pairs:", error)
      toast({
        title: "Export failed",
        description: "Failed to export QA pairs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle import
  const handleImport = async () => {
    if (!importFile) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const csvContent = e.target?.result as string
          const lines = csvContent.split("\n").filter((line) => line.trim())
          const headers = lines[0].split(",").map((header) => header.trim())

          // Validate headers
          const requiredHeaders = ["question", "answer", "category_id"]
          const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header))

          if (missingHeaders.length > 0) {
            throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`)
          }

          // Parse CSV data
          const qaPairs = []
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map((value) => value.trim())
            const qaPair: Record<string, any> = {}

            headers.forEach((header, index) => {
              qaPair[header] = values[index] || ""
            })

            // Set default values
            qaPair.enabled = qaPair.enabled === "true" || qaPair.enabled === "1" || true

            qaPairs.push(qaPair)
          }

          // Send to API
          await qaApi.bulkImport(qaPairs)

          toast({
            title: "Import successful",
            description: `Successfully imported ${qaPairs.length} QA pairs.`,
          })
          setIsImportDialogOpen(false)
          onBulkActionComplete()
        } catch (error) {
          console.error("Error processing import file:", error)
          toast({
            title: "Import failed",
            description: error instanceof Error ? error.message : "Failed to process the import file.",
            variant: "destructive",
          })
        } finally {
          setIsProcessing(false)
        }
      }

      reader.readAsText(importFile)
    } catch (error) {
      console.error("Error importing QA pairs:", error)
      toast({
        title: "Import failed",
        description: "Failed to import QA pairs. Please try again.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-muted/50 border rounded-md p-2 flex flex-wrap gap-2 items-center">
      <span className="text-sm font-medium mr-2">{selectedQAPairs.length} selected</span>

      <Button size="sm" variant="outline" onClick={() => handleBulkToggle(true)} disabled={isProcessing}>
        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
        Enable All
      </Button>

      <Button size="sm" variant="outline" onClick={() => handleBulkToggle(false)} disabled={isProcessing}>
        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
        Disable All
      </Button>

      <Button size="sm" variant="outline" onClick={() => setIsDeleteDialogOpen(true)} disabled={isProcessing}>
        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash className="mr-2 h-4 w-4" />}
        Delete All
      </Button>

      <Button size="sm" variant="outline" onClick={handleExport} disabled={isProcessing}>
        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
        Export
      </Button>

      <Button size="sm" variant="outline" onClick={() => setIsImportDialogOpen(true)} disabled={isProcessing}>
        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
        Import
      </Button>

      <Button size="sm" variant="ghost" onClick={onClearSelection} disabled={isProcessing}>
        Cancel
      </Button>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import QA Pairs</DialogTitle>
            <DialogDescription>
              Upload a CSV file with QA pairs to import. The file should have columns for question, answer, and
              category_id.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="importFile">CSV File</Label>
              <Input
                id="importFile"
                type="file"
                accept=".csv"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!importFile || isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete QA Pairs</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedQAPairs.length} QA pairs? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

