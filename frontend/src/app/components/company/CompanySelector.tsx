"use client"
import { useCompany } from "../../contexts/CompanyContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function CompanySelector() {
    const { companies, selectedCompany, setSelectedCompany, isLoading } = useCompany()
    const { user } = useAuth()
  
    // Only show for super admins
    if (!user?.is_super_admin) {
      return null
    }
  
    // Don't show if loading or no companies
    if (isLoading || companies.length === 0) {
      return null
    }
  
    return (
      <div className="flex items-center space-x-2">
        <Building className="h-4 w-4 text-muted-foreground" />
        <Select
          value={selectedCompany?.id.toString()}
          onValueChange={(value) => {
            const company = companies.find((c) => c.id.toString() === value)
            if (company) {
              setSelectedCompany(company)
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select company" />
          </SelectTrigger>
          <SelectContent>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id.toString()}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }
  
  