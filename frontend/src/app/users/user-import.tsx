"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Download, FileText, AlertTriangle, Check } from "lucide-react"
import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useToast } from "../components/ui/use-toast"
import { Progress } from "../components/ui/progress"

interface UserImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportComplete: (users: any[]) => void
}

export function UserImport({ open, onOpenChange, onImportComplete }: UserImportProps) {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [validationResults, setValidationResults] = useState<{
    valid: boolean
    errors: string[]
    warnings: string[]
    validCount: number
    totalCount: number
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)

      // Reset validation results when a new file is selected
      setValidationResults(null)

      // Validate the file (in a real app, this would parse the CSV/Excel)
      setTimeout(() => {
        // Mock validation results
        setValidationResults({
          valid: true,
          errors: ["Row 5: Invalid email format", "Row 12: Missing role"],
          warnings: ["Row 3: User with this email already exists"],
          validCount: 10,
          totalCount: 12,
        })
      }, 500)
    }
  }

  const handleDownloadTemplate = () => {
    // In a real app, this would generate and download a CSV template
    toast({
      title: "Template Downloaded",
      description: "User import template has been downloaded.",
    })
  }

  const handleImport = () => {
    if (!file || !validationResults) return

    setImporting(true)

    // Simulate import progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    // Simulate import completion
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setImporting(false)

      // Mock imported users
      const importedUsers = Array.from({ length: validationResults.validCount }).map((_, i) => ({
        id: `imported-${i}`,
        name: `Imported User ${i + 1}`,
        email: `imported${i + 1}@example.com`,
        role: i % 3 === 0 ? "admin" : i % 3 === 1 ? "content_manager" : "viewer",
        status: "active",
        lastLogin: null,
      }))

      onImportComplete(importedUsers)

      toast({
        title: "Import Successful",
        description: `Successfully imported ${validationResults.validCount} users.`,
      })

      onOpenChange(false)
    }, 3000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Users</DialogTitle>
          <DialogDescription>Upload a CSV or Excel file with user data to bulk import users.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="user-import">Upload File</Label>
            <Button variant="outline" size="sm" onClick={handleDownloadTemplate} type="button">
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Input
              id="user-import"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              disabled={importing}
            />
            <p className="text-xs text-muted-foreground">Accepted formats: CSV, Excel (.xlsx, .xls)</p>
          </div>

          {file && (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              <span>{file.name}</span>
              <span className="text-muted-foreground">({Math.round(file.size / 1024)} KB)</span>
            </div>
          )}

          {validationResults && (
            <div className="space-y-3 border rounded-md p-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Validation Results</h4>
                <span className="text-sm">
                  {validationResults.validCount}/{validationResults.totalCount} valid
                </span>
              </div>

              {validationResults.errors.length > 0 && (
                <div className="space-y-1">
                  <h5 className="text-sm font-medium text-destructive flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Errors
                  </h5>
                  <ul className="text-sm text-destructive space-y-1">
                    {validationResults.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResults.warnings.length > 0 && (
                <div className="space-y-1">
                  <h5 className="text-sm font-medium text-yellow-600 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Warnings
                  </h5>
                  <ul className="text-sm text-yellow-600 space-y-1">
                    {validationResults.warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResults.valid && validationResults.validCount > 0 && (
                <div className="text-sm text-green-600 flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  {validationResults.validCount} users ready to import
                </div>
              )}
            </div>
          )}

          {importing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Importing users...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={importing}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || !validationResults?.valid || importing || validationResults?.validCount === 0}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import Users
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

