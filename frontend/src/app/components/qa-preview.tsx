"use client"

import { Card, CardContent, CardFooter } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { Pencil, Trash } from "lucide-react"
import type { QAPair } from "../../types/qa"
import { Checkbox } from "./ui/checkbox"

interface QAPreviewProps {
  qa: QAPair
  category: string
  onEdit: () => void
  onDelete: () => void
  onToggle: (enabled: boolean) => void
  isSelected?: boolean
  onSelect?: (selected: boolean) => void
  selectionMode?: boolean
}

export function QAPreview({
  qa,
  category,
  onEdit,
  onDelete,
  onToggle,
  isSelected = false,
  onSelect,
  selectionMode = false,
}: QAPreviewProps) {
  return (
    <Card className={`border ${isSelected ? "border-primary bg-primary/5" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {selectionMode && onSelect && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={onSelect}
              className="mt-1"
              aria-label={`Select ${qa.question}`}
            />
          )}

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="outline">{category}</Badge>
              <Badge variant={qa.enabled ? "default" : "secondary"}>{qa.enabled ? "Enabled" : "Disabled"}</Badge>
            </div>

            <h3 className="font-medium text-lg mb-2">{qa.question}</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{qa.answer}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-4 pt-0">
        <div className="flex items-center gap-2">
          <Switch
            checked={qa.enabled}
            onCheckedChange={onToggle}
            aria-label={`${qa.enabled ? "Disable" : "Enable"} this QA pair`}
          />
          <span className="text-sm text-muted-foreground">{qa.enabled ? "Enabled" : "Disabled"}</span>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

