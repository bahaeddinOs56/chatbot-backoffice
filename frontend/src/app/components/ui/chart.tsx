"use client"

import * as React from "react"
import { cn } from "../../../lib/utils"

interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

export function ChartContainer({ config, className, children, ...props }: ChartContainerProps) {
  // Create CSS variables for each color in the config
  const style = Object.entries(config).reduce(
    (acc, [key, value]) => {
      acc[`--color-${key}`] = value.color
      return acc
    },
    {} as Record<string, string>,
  )

  return (
    <div className={cn("", className)} style={style} {...props}>
      {children}
    </div>
  )
}

interface ChartTooltipProps {
  content: React.ReactNode
  active?: boolean
  payload?: any[]
  label?: string
}

export function ChartTooltip({ content, active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null
  }

  return content
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: any[]
  label?: string
}

export function ChartTooltipContent({ active, payload, label }: ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="font-medium">{label}</div>
        <div className="font-medium">Value</div>
        {payload.map((item: any) => (
          <React.Fragment key={item.name}>
            <div className="flex items-center gap-1" style={{ color: item.color }}>
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
            <div>{item.value}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export function ChartLegend({
  className,
  config,
}: {
  className?: string
  config: ChartConfig
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      {Object.entries(config).map(([key, value]) => (
        <div key={key} className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: value.color }} />
          <span className="text-sm text-muted-foreground">{value.label}</span>
        </div>
      ))}
    </div>
  )
}

