"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Switch } from "./ui/switch"
import type { QAPair, Category } from "../../types/qa"

interface QADialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  qa: QAPair | null
  categories: Category[]
  onSave: (qa: QAPair) => void
}

export function QADialog({ open, onOpenChange, qa, categories, onSave }: QADialogProps) {
  const [formData, setFormData] = useState<Partial<QAPair>>({
    question: "",
    answer: "",
    category_id: "",
    enabled: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [localCategories, setLocalCategories] = useState<Category[]>(categories)

  useEffect(() => {
    setLocalCategories(categories)
  }, [categories])

  useEffect(() => {
    if (qa) {
      setFormData({
        id: qa.id,
        question: qa.question,
        answer: qa.answer,
        category_id: qa.category_id,
        enabled: qa.enabled,
      })
    } else {
      setFormData({
        question: "",
        answer: "",
        category_id: localCategories.length > 0 ? localCategories[0].id : "",
        enabled: true,
      })
    }
    setErrors({})
  }, [qa, localCategories])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { name: string; value: string | boolean },
  ) => {
    const { name, value } = "target" in e ? e.target : e
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: Record<string, string> = {}
    if (!formData.question?.trim()) {
      newErrors.question = "Question is required"
    }
    if (!formData.answer?.trim()) {
      newErrors.answer = "Answer is required"
    }
    if (!formData.category_id) {
      newErrors.category_id = "Category is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit form
    onSave(formData as QAPair)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{qa ? "Edit QA Pair" : "Add New QA Pair"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="question" className="text-right">
              Question
            </Label>
            <Input
              id="question"
              name="question"
              value={formData.question || ""}
              onChange={handleChange}
              className={errors.question ? "border-destructive" : ""}
            />
            {errors.question && <p className="text-sm text-destructive">{errors.question}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer" className="text-right">
              Answer
            </Label>
            <Textarea
              id="answer"
              name="answer"
              value={formData.answer || ""}
              onChange={handleChange}
              className={`min-h-[100px] ${errors.answer ? "border-destructive" : ""}`}
            />
            {errors.answer && <p className="text-sm text-destructive">{errors.answer}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select
              name="category_id"
              value={formData.category_id?.toString() || ""}
              onValueChange={(value) => handleChange({ name: "category_id", value })}
            >
              <SelectTrigger className={errors.category_id ? "border-destructive" : ""}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {localCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && <p className="text-sm text-destructive">{errors.category_id}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              name="enabled"
              checked={formData.enabled}
              onCheckedChange={(checked) => handleChange({ name: "enabled", value: checked })}
            />
            <Label htmlFor="enabled">Enabled</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{qa ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

