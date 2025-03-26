"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/app/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover"
import { Input } from "@/app/components/ui/input"

interface DateRangePickerProps {
  dateRange: { from: Date; to: Date }
  setDateRange: (dateRange: { from: Date; to: Date }) => void
}

export function SimpleDateRangePicker({ dateRange, setDateRange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [fromDate, setFromDate] = useState(dateRange.from.toISOString().split("T")[0])
  const [toDate, setToDate] = useState(dateRange.to.toISOString().split("T")[0])

  const handleApply = () => {
    setDateRange({
      from: new Date(fromDate),
      to: new Date(toDate),
    })
    setIsOpen(false)
  }

  const selectPreset = (days: number) => {
    const to = new Date()
    const from = new Date()
    from.setDate(to.getDate() - days)

    setFromDate(from.toISOString().split("T")[0])
    setToDate(to.toISOString().split("T")[0])

    setDateRange({ from, to })
    setIsOpen(false)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button id="date" variant={"outline"} className="w-full sm:w-[300px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="from" className="text-sm font-medium">
                    From
                  </label>
                  <Input id="from" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="to" className="text-sm font-medium">
                    To
                  </label>
                  <Input id="to" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => selectPreset(7)}>
                  Last 7 days
                </Button>
                <Button variant="outline" size="sm" onClick={() => selectPreset(30)}>
                  Last 30 days
                </Button>
              </div>
              <Button size="sm" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

