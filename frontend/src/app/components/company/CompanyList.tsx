"use client"

import type React from "react"
import { useState } from "react"
import { useCompany } from "../../contexts/CompanyContext"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { companyApi, type Company } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export function CompanyList() {
  const { companies, fetchCompanies, isSuperAdmin } = useCompany()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    domain: "",
  })

  if (!isSuperAdmin) {
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await companyApi.create(formData)
      toast({
        title: "Success",
        description: "Company created successfully",
      })
      setIsDialogOpen(false)
      setFormData({ name: "", slug: "", domain: "" })
      fetchCompanies()
    } catch (error) {
      console.error("Error creating company:", error)
      toast({
        title: "Error",
        description: "Failed to create company",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCompanyStatus = async (company: Company) => {
    try {
      await companyApi.toggle(company.id, !company.is_active)
      toast({
        title: "Success",
        description: `Company ${company.is_active ? "deactivated" : "activated"} successfully`,
      })
      fetchCompanies()
    } catch (error) {
      console.error("Error toggling company status:", error)
      toast({
        title: "Error",
        description: "Failed to update company status",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Companies</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Company</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Company</DialogTitle>
              <DialogDescription>Add a new company to the system. All fields are required.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="slug" className="text-right">
                    Slug
                  </Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="domain" className="text-right">
                    Domain
                  </Label>
                  <Input
                    id="domain"
                    name="domain"
                    value={formData.domain}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="example.com (optional)"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Company"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell className="font-medium">{company.name}</TableCell>
              <TableCell>{company.slug}</TableCell>
              <TableCell>{company.domain || "-"}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Switch checked={company.is_active} onCheckedChange={() => toggleCompanyStatus(company)} />
                  <span>{company.is_active ? "Active" : "Inactive"}</span>
                </div>
              </TableCell>
              <TableCell>{new Date(company.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

